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
    // are at least two adjacent digits the same,
    // but not part of a longer run?
    let lastDigit;
    let digitBeforeLast;
    let good = false;
    let lockedIn = false;
    digits.forEach(digit => {
      if (digit === lastDigit) {
        good = true;
        if (digit === digitBeforeLast) {
          good = false;
        }
      } else {
        if (good) {
          lockedIn = true;
        }
        good = false;
      }
      digitBeforeLast = lastDigit;
      lastDigit = digit;
    });
    if (lockedIn || good) {
      logger.debug(guess);
      validPasswords.push(guess);
    }
  }
}
logger.info("Found " + validPasswords.length + " valid passwords");
