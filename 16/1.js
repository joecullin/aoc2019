#!/usr/local/bin/node

const logger = require("../common/logger-simple");
const { readLines } = require("../common/readInput");

const basePattern = [0, 1, 0, -1];
const maxPhases = 100;

readLines().then(input => {
  const initial = input[0].split("");
  logger.debug(initial);

  let signal = [...initial];
  let phaseNumber = 1;
  do {
    let newSignal = [];
    signal.forEach((signalDigit, signalDigitIndex) => {
      let signalDigitPosition = signalDigitIndex;

      // get pattern
      let pattern = [];
      basePattern.forEach(val => {
        if (pattern.length <= signal.length) {
          let i = 0;
          while (i++ <= signalDigitPosition) {
            pattern.push(val);
          }
        }
      });
      while (pattern.length <= signal.length) {
        pattern = pattern.concat([...pattern]);
      }
      pattern.shift();
      pattern = pattern.slice(0, signal.length);

      // calculate each digit of new signal
      let sum = signal.reduce((acc, digit, digitIndex) => {
        return acc + digit * pattern[digitIndex];
      }, 0);

      logger.debug(
        `phase #${phaseNumber} pattern #${signalDigitPosition} --> ${sum}`
      );
      // logger.debug(pattern);
      newSignal.push(
        sum
          .toString()
          .split("")
          .pop()
      );
    });

    logger.debug(`---> #${phaseNumber}: ` + newSignal.slice(0, 8).join(""));
    signal = newSignal;
  } while (phaseNumber++ < maxPhases);

  logger.info("done.");
});
