#!/usr/local/bin/node

const logger = require("../common/logger");
const { readCommaSeparatedLineNumeric } = require("../common/readInput");
const runProgram = require("./intcode");
const sequenceGenerator = require("./sequenceGenerator");

readCommaSeparatedLineNumeric().then(program => {
  const allSequences = sequenceGenerator({ start: 0, length: 5 });
  logger.debug({ message: "allSequences", allSequences });

  let results = allSequences.map(sequence => {
    let signal = 0;
    sequence.forEach(phaseSetting => {
      const memory = [...program];
      logger.debug({ message: "running program", phaseSetting, signal });
      const result = runProgram({ memory, inputs: [phaseSetting, signal] });
      signal = result.output;
      logger.debug({ message: "output", signal });
    });
    return { sequence, signal };
  });
  logger.debug({ message: "results:", results });
  let best = results.sort((a, b) => b.signal - a.signal)[0];

  logger.info({ message: "That's it!", best });
  process.exit(0);
});
