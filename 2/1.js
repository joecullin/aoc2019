#!/usr/local/bin/node

const logger = require("../common/logger");
const { readCommaSeparatedLineNumeric } = require("../common/readInput");

readCommaSeparatedLineNumeric().then(input => {
  logger.debug(input);
  for (let i = 0; i < input.length; i++) {
    logger.debug(`${i} ${input[i]}`);
    if (i % 4 === 0) {
      const opcode = input[i];
      const op1 = input[input[i + 1]];
      const op2 = input[input[i + 2]];
      const outputPosition = input[i + 3];
      let opResult;
      if (opcode === 99) {
        break;
      } else if (opcode === 1) {
        opResult = op1 + op2;
      } else if (opcode === 2) {
        opResult = op1 * op2;
      } else {
        logger.error(`bad opcode '${opcode}' at position ${i}`);
        break;
      }
      logger.debug(
        `$i: op=${opcode} inputs=${op1}, ${op2} destination=${outputPosition} result=${opResult}`
      );
      input[outputPosition] = opResult;
    }
  }
  logger.info(input);
});
