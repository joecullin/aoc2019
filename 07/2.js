#!/usr/local/bin/node

const logger = require("../common/logger");
const { readCommaSeparatedLineNumeric } = require("../common/readInput");
const runProgram = require("./intcode");
const sequenceGenerator = require("./sequenceGenerator");

readCommaSeparatedLineNumeric().then(program => {
  const allSequences = sequenceGenerator({ start: 5, length: 5 });

  let results = allSequences.map(sequence => {
    let amps = sequence.map(phaseSetting => {
      return { phaseSetting, memory: [...program], initialized: false };
    });

    let initialized = false;
    const runCircuit = signal => {
      let halted = false;
      amps.forEach((amp, ampNumber) => {
        logger.debug("===========================================\n");
        let inputs = [];
        if (!initialized) {
          inputs.push(amp.phaseSetting);
        }
        inputs.push(signal);
        logger.debug({ message: `running amp ${ampNumber}`, inputs });
        const result = runProgram({ inputs, ...amp });

        // Preserving the computer state outside of the machine.
        // I have a feeling I'll be refactoring this in a few days,
        // but it's simple enough to do it here for now.
        amp.memory = result.memory;
        amp.pointer = result.pointer;
        signal = result.output;
        halted = result.halted;

        logger.debug({ message: "output", signal });
      });
      initialized = true;
      if (!halted) {
        signal = runCircuit(signal);
      }
      return signal;
    };
    const signal = runCircuit(0);
    return { sequence, signal };
  });
  logger.debug({ message: "results:", results });
  let best = results.sort((a, b) => b.signal - a.signal)[0];

  logger.info({ message: "That's it!", best });
  process.exit(0);
});
