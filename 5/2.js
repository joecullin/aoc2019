#!/usr/local/bin/node

const logger = require("../common/logger");
const { readCommaSeparatedLineNumeric } = require("../common/readInput");

const runProgram = (memory, input) => {
  let i = 0;
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
        // initial input
        instructionLength = 2;
        paramCount = 0;
        outputIndex = 1;
        if (i !== 0) {
          logger.info("Odd: opcode 3 at non-zero position ${i}");
        }
        compute = () => {
          return { opResult: input };
        };
        break;
      case 4:
        // output
        instructionLength = 2;
        paramCount = 1;
        outputIndex = null;
        compute = paramValues => {
          const output = paramValues[0];
          logger.info(`OUTPUT: ${output}`);
          return { opResult: output };
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
        logger.info(`halt at position ${i}`);
        return {};
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
      memory[outputPosition] = result.opResult;
    }

    if (result.jumpTo) {
      i = result.jumpTo;
    } else {
      i += instructionLength;
    }

    // logger.debug("memory", memory);
  } while (i - 1 < memory.length);

  return memory[0];
};

readCommaSeparatedLineNumeric().then(memoryBase => {
  const memory = [...memoryBase];
  const input = 5;
  logger.debug("memory", memory);
  runProgram(memory, input);
  logger.info("That's it!");
  process.exit(0);
});
