#!/usr/local/bin/node

const logger = require("../common/logger");

const min = 137683;
const max = 596253;
let validPasswords = [];

for (let i = min; i <= max; i++) {
  guess = i.toString();
  const digits = guess.split("");

  // are digits ascending?
  if (
    digits.join("") ===
    digits
      .sort((a, b) => {
        return a - b;
      })
      .join("")
  ) {
    // are at least two adjacent digits the same?
    let lastDigit;
    if (
      digits.some(digit => {
        if (digit === lastDigit) {
          return true;
        }
        lastDigit = digit;
      })
    ) {
      logger.debug(guess);
      validPasswords.push(guess);
    }
  }
}
logger.info("Found " + validPasswords.length + " valid passwords");
