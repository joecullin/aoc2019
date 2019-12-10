const logger = require("../common/logger");

const runProgram = ({ memory, inputs, pointer = 0, relativeBaseInput = 0 }) => {
  memory = memory.map(val => {
    return BigInt(val);
  });

  let i = BigInt(pointer);
  let relativeBase = BigInt(relativeBaseInput);
  let output;
  let state;

  const dumpMemory = () => {
    for (let m = 0; m < memory.length; m++) {
      if (memory[m] !== undefined) {
        const isCurrent = i === BigInt(m) ? "<--- current" : "";
        const isRelBase = relativeBase === BigInt(m) ? "<--- relBase" : "";
        logger.debug(`mem ${m}: ${memory[m]} ${isCurrent} ${isRelBase}`);
      }
    }
  };

  const readMemoryLocation = location => {
    if (location < 0 || location === undefined) {
      logger.error("ERROR Tried to read bad memory location!: " + location);
    }
    let value = memory[location];
    if (value === undefined) {
      value = 0n;
      memory[location] = value;
    }
    logger.debug({ message: `readMemoryLocation ${location}`, value });
    return value;
  };

  const readMemorySlice = (start, end) => {
    let values = [];
    for (let location = start; location < end; location++) {
      const value = readMemoryLocation(location);
      values.push(value);
    }
    return values;
  };

  const parseInstruction = instruction => {
    let opcodeString = "";
    let paramModes = [];
    let instructionDigits = instruction.toString().split("");
    opcodeString = instructionDigits.pop();
    if (instructionDigits.length) {
      opcodeString = instructionDigits.pop() + opcodeString;
    }
    const opcode = parseInt(opcodeString);

    for (let paramIndex = 0; paramIndex < 3; paramIndex++) {
      let digit = instructionDigits.pop();
      if (digit === undefined) {
        digit = "0";
      }
      paramModes[paramIndex] = parseInt(digit);
    }
    logger.debug({ message: `parsed ${instruction}`, opcode, paramModes });
    return { opcode, paramModes };
  };

  do {
    logger.debug(`${i} ---------------------------------------------`);
    dumpMemory();
    const instruction = readMemoryLocation(i);
    const instructionDetails = parseInstruction(instruction);
    let opcode = instructionDetails.opcode;
    let paramModes = instructionDetails.paramModes;

    let instructionLength;
    let paramCount;
    let outputIndex;

    // placeholder compute function
    let compute = () => {
      logger.error("ERROR Undefined compute function");
    };

    switch (opcode) {
      case 1:
        // add
        instructionLength = 4;
        paramCount = 2;
        outputIndex = 2;
        compute = paramValues => {
          logger.debug("add", paramValues[0]);
          const opResult = paramValues.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0n);
          return { opResult };
        };
        break;
      case 2:
        // multiply
        instructionLength = 4;
        paramCount = 2;
        outputIndex = 2;
        compute = paramValues => {
          const opResult = paramValues.reduce((accumulator, currentValue) => {
            return accumulator * currentValue;
          }, 1n);
          return { opResult };
        };
        break;
      case 3:
        // input
        instructionLength = 2;
        paramCount = 1;
        outputIndex = 0;
        compute = () => {
          return { opResult: inputs.shift() };
        };
        break;
      case 4:
        // output
        instructionLength = 2;
        paramCount = 1;
        outputIndex = null;
        compute = paramValues => {
          output = paramValues[0];
          logger.info(`OUTPUT: ${output}`);
          state = "output";
          return { opResult: null };
        };
        break;
      case 5:
        // jump-if-true
        instructionLength = 3;
        paramCount = 2;
        outputIndex = null;
        compute = paramValues => {
          return paramValues[0] ? { jumpTo: paramValues[1] } : {};
        };
        break;
      case 6:
        // jump-if-false
        instructionLength = 3;
        paramCount = 2;
        outputIndex = null;
        compute = paramValues => {
          return !paramValues[0] ? { jumpTo: paramValues[1] } : {};
        };
        break;
      case 7:
        // less-than
        instructionLength = 4;
        paramCount = 2;
        outputIndex = 2;
        compute = paramValues => {
          const opResult = paramValues[0] < paramValues[1] ? 1 : 0;
          return { opResult };
        };
        break;
      case 8:
        // equal-to
        instructionLength = 4;
        paramCount = 2;
        outputIndex = 2;
        compute = paramValues => {
          const opResult = paramValues[0] === paramValues[1] ? 1 : 0;
          return { opResult };
        };
        break;
      case 9:
        // change relative base
        instructionLength = 2;
        paramCount = 1;
        outputIndex = null;
        compute = paramValues => {
          logger.debug({
            message: `moving relative pointer`,
            to: paramValues[0]
          });
          return { moveRelativeBaseBy: paramValues[0] };
        };
        break;
      case 99:
        // halt
        logger.debug({ message: `halt at position ${i}`, output, pointer });
        return {
          memory: [...memory],
          output: inputs.shift(),
          halted: true,
          pointer: i + 1n
        };
      default:
        logger.error(
          `ERROR bad opcode in instruction '${instruction}' at position ${i}: '${opcode}'`
        );
        return {};
    }
    logger.debug("paramModes", paramModes);
    const params = readMemorySlice(i + 1n, i + 1n + BigInt(paramCount));
    logger.debug("params", params);

    let outputPosition = null;
    if (outputIndex !== null) {
      const mode = paramModes[outputIndex];
      switch (mode) {
        case 1:
          // immediate mode
          outputPosition = BigInt(outputIndex);
          break;
        case 2:
          // relative mode
          outputPosition = BigInt(outputIndex) + relativeBase;
          break;
        default:
          // position mode (0 or null)
          outputPosition = readMemoryLocation(i + 1n + BigInt(outputIndex)); // 1 is to skip the instruction at memory slot i. It's param #i, but memory slot i+1 in this instruction.
          break;
      }
    }
    logger.debug(
      `output param for opcode ${opcode} (param #${outputIndex}), mode=${paramModes[outputIndex]} ==> resolves to position ${outputPosition}`
    );

    const paramValues = params.map((param, paramIndex) => {
      let paramValue = BigInt(param);
      if (paramModes[paramIndex] === 1) {
        logger.debug(
          `param #${paramIndex}: (${param}) -- immediate --> ${paramValue}`
        );
      } else if (paramModes[paramIndex] === 2) {
        paramValue = readMemoryLocation(paramValue + relativeBase);
        logger.debug(
          `param #${paramIndex}: (${param}) -- relative from ${relativeBase} --> ${paramValue}`
        );
      } else {
        const paramPosition = param;
        paramValue = readMemoryLocation(paramPosition);
        logger.debug(
          `param #${paramIndex}: (${param}) -- memory[${paramPosition}] --> ${paramValue}`
        );
      }
      return paramValue;
    });

    let result = compute(paramValues);

    logger.debug(`instruction`, {
      position: i,
      relativeBase,
      instruction,
      opcode,
      instructionLength,
      params,
      paramModes,
      paramValues,
      outputPosition,
      result
    });

    if (result.opResult !== null) {
      if (outputPosition >= memory.length) {
        logger.debug(
          `extending memory from ${memory.length - 1} to ${outputPosition}`
        );
      } else if (outputPosition < 0) {
        logger.error(
          `ERROR attempt to write to negative address: ${outputPosition}`
        );
      }
      memory[outputPosition] = result.opResult;
    }

    if (result.jumpTo !== undefined) {
      i = BigInt(result.jumpTo);
    } else {
      i += BigInt(instructionLength);
    }

    if (result.moveRelativeBaseBy) {
      relativeBase += result.moveRelativeBaseBy;
    }

    // This was for day 7 when we were connecting amplifiers in series.
    // Pause after every output, freezing the machine state.
    const freeze = false;
    if (freeze) {
      if (state === "output") {
        return {
          memory: [...memory],
          output,
          halted: false,
          pointer: i
        };
      }
    }

    // logger.debug("memory", memory);
  } while (i - 1n < memory.length);

  logger.error("ERROR Overran memory with no halt instruction!");
  return;
};

module.exports = runProgram;
