const logger = require("../common/logger");

const runProgram = ({ memory, inputs, pointer = 0 }) => {
  let i = pointer;
  let output;
  let state;
  do {
    logger.debug(`${i} ---------------------------------------------`);

    const instruction = memory[i];

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
          logger.debug(`OUTPUT: ${output}`);
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
    const params = memory.slice(i + 1, i + 1 + paramCount);
    logger.debug("params", params);

    let outputPosition = null;
    if (outputIndex !== null) {
      outputPosition =
        paramModes[outputIndex] === 1 ? outputIndex : memory[i + outputIndex];
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
      } else {
        const paramPosition = param;
        paramValue = memory[paramPosition];
        logger.debug(
          `param #${paramIndex}: (${param}) -- memory[${paramPosition}] --> ${paramValue}`
        );
      }
      return paramValue;
    });

    let result = compute(paramValues);

    logger.debug(`instruction`, {
      position: i,
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

    if (state === "output") {
      return {
        memory: [...memory],
        output,
        halted: false,
        pointer: i
      };
    }

    // logger.debug("memory", memory);
  } while (i - 1 < memory.length);

  logger.error("Overran memory with no halt instruction!");
  return;
};

module.exports = runProgram;
