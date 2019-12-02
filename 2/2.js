#!/usr/local/bin/node

const logger = require("../common/logger");
const { readCommaSeparatedLineNumeric } = require("../common/readInput");

const runProgram = memory => {
  logger.debug("runProgram input", memory);
  for (let i = 0; i < memory.length; i++) {
    logger.debug(`${i} ${memory[i]}`);
    if (i % 4 === 0) {
      const opcode = memory[i];
      const param1 = memory[memory[i + 1]];
      const param2 = memory[memory[i + 2]];
      const outputPosition = memory[i + 3];
      let opResult;
      if (opcode === 99) {
        break;
      } else if (opcode === 1) {
        opResult = param1 + param2;
      } else if (opcode === 2) {
        opResult = param1 * param2;
      } else {
        logger.error(`bad opcode '${opcode}' at position ${i}`);
        break;
      }
      logger.debug(
        `$i: op=${opcode} memorys=${param1}, ${param2} destination=${outputPosition} result=${opResult}`
      );
      memory[outputPosition] = opResult;
    }
  }
  return memory[0];
};

readCommaSeparatedLineNumeric().then(memoryBase => {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      let memory = [...memoryBase];
      memory[1] = noun;
      memory[2] = verb;
      const output = runProgram(memory);
      logger.info(`${noun},${verb}: ${output}`);
      if (output === 19690720) {
        logger.info("That's it!");
        logger.info(100 * noun + verb);
        process.exit(0);
      }
    }
  }
});
