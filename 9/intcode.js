const logger = require("../common/logger");

const runProgram = ({
  memory,
  inputs,
  pointer = 0,
  relativePointerInput = 0
}) => {
  let i = pointer;
  let relativePointer = relativePointerInput;
  let output;
  let state;

  const readMemoryLocation = location => {
    let value = memory[location];
    if (value === undefined) {
      value = 0;
      memory[location] = value;
    }
    logger.debug({ message: `readMemoryLocation ${location}`, value });
    return value;
  };

  const readMemorySlice = (start, end) => {
    let values = [];
    for (let location = start; location < end; location++) {
      const value = readMemoryLocation(location);
      logger.debug({ message: `readMemorySlice for ${location}:`, value });
      values.push(value);
    }
    logger.debug({
      message: `readMemorySlice from ${start} to ${end}`,
      values
    });
    return values;
  };

  do {
    logger.debug(`${i} ---------------------------------------------`);

    const instruction = readMemoryLocation(i);

    const instructionDigits = instruction
      .toString()
      .split("")
      .reverse();
    let opcodeString = "";
    let paramModes = [];
    for (
      let digitIndex = 0;
      digitIndex < instructionDigits.length;
      digitIndex++
    ) {
      const digit = instructionDigits[digitIndex];
      if (digitIndex <= 1) {
        opcodeString = digit + opcodeString;
      } else {
        paramModes[digitIndex - 2] = digit;
      }
    }
    let opcode = parseInt(opcodeString);
    let instructionLength;
    let paramCount;
    let outputIndex;

    // placeholder compute function
    let compute = () => {
      logger.error("Undefined compute function");
    };

    switch (opcode) {
      case 1:
        // add
        instructionLength = 4;
        paramCount = 2;
        outputIndex = 3;
        compute = paramValues => {
          logger.debug("add", paramValues[0]);
          const opResult = paramValues.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
          return { opResult };
        };
        break;
      case 2:
        // multiply
        instructionLength = 4;
        paramCount = 2;
        outputIndex = 3;
        compute = paramValues => {
          const opResult = paramValues.reduce((accumulator, currentValue) => {
            return accumulator * currentValue;
          }, 1);
          return { opResult };
        };
        break;
      case 3:
        // input
        instructionLength = 2;
        paramCount = 0;
        outputIndex = 1;
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
        outputIndex = 3;
        compute = paramValues => {
          const opResult = paramValues[0] < paramValues[1] ? 1 : 0;
          return { opResult };
        };
        break;
      case 8:
        // equal-to
        instructionLength = 4;
        paramCount = 2;
        outputIndex = 3;
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
          return { moveRelativePointerBy: paramValues[0] };
        };
        break;
      case 99:
        // halt
        logger.debug({ message: `halt at position ${i}`, output, pointer });
        return {
          memory: [...memory],
          output: inputs.shift(),
          halted: true,
          pointer: i + 1
        };
      default:
        logger.error(
          `bad opcode in instruction '${instruction}' at position ${i}: '${opcode}'`
        );
        return {};
    }
    logger.debug("paramModes", paramModes);
    logger.debug(
      "slice from " + (i + 1) + " to " + (i + 1 + paramCount) + " to get params"
    );
    const params = readMemorySlice(i + 1, i + 1 + paramCount);
    logger.debug("params", params);

    let outputPosition = null;
    if (outputIndex !== null) {
      switch (paramModes[outputIndex]) {
        case 1:
          // immediate mode
          outputPosition = outputIndex;
          break;
        case 2:
          // relative mode
          outputPosition = outputIndex + relativePointer;
          break;
        default:
          // position mode (0 or null)
          outputPosition = readMemoryLocation(i + outputIndex);
          break;
      }
    }
    logger.debug(
      `outputIndex=${outputIndex}, so output will go to memory position ${outputPosition}`
    );

    const paramValues = params.map((param, paramIndex) => {
      let paramValue = param;
      if (paramModes[paramIndex] === "1") {
        logger.debug(
          `param #${paramIndex}: (${param}) -- immediate --> ${paramValue}`
        );
      } else if (paramModes[paramIndex] === "2") {
        paramValue = readMemoryLocation(paramValue + relativePointer);
        logger.debug(
          `param #${paramIndex}: (${param}) -- relative from ${relativePointer} --> ${paramValue}`
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
      relativePointer,
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
      if (outputPosition >= memory.length || outputPosition < 0) {
        logger.debug(
          "Attempt to write beyond allocated memory, but I'll allow it..."
        );
      }
      memory[outputPosition] = result.opResult;
    }

    if (result.jumpTo) {
      i = result.jumpTo;
    } else {
      i += instructionLength;
    }

    if (result.moveRelativePointerBy) {
      relativePointer += result.moveRelativePointerBy;
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
  } while (i - 1 < memory.length);

  logger.error("Overran memory with no halt instruction!");
  return;
};

module.exports = runProgram;
