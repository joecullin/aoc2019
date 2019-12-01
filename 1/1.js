#!/usr/local/bin/node

const logger = require("../common/logger");
const readInput = require("../common/readInput");

const calculateFuel = mass => {
  const fuel = Math.floor(mass / 3) - 2;
  logger.debug(`${mass} --> ${fuel}`);
  return fuel;
};

readInput().then(input => {
  const total = input.reduce((accumulator, currentValue) => {
    return accumulator + calculateFuel(currentValue);
  }, 0);

  logger.info("total: " + total);
});
