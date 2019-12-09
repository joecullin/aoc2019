#!/usr/local/bin/node

const logger = require("../common/logger");
const { readCommaSeparatedLineNumeric } = require("../common/readInput");
const runProgram = require("./intcode");

readCommaSeparatedLineNumeric().then(program => {
  let computer = { memory: [...program] };
  let inputs = [1];
  const result = runProgram({ inputs, ...computer });
  logger.debug({ message: "result:", result });

  process.exit(0);
});
