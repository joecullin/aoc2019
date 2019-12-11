#!/usr/local/bin/node

const logger = require("../common/logger");
const {readLinesNumeric} = require("../common/readInput");

const calculateFuel = mass => {
  const fuel = Math.floor(mass / 3) - 2;
  return fuel > 0 ? fuel : 0;
};

const calculateExtraFuel = fuelMass => {
  logger.debug(`calculateExtraFuel ${fuelMass}`);
  let extraFuel = calculateFuel(fuelMass);
  if (extraFuel > 0) {
    extraFuel += calculateExtraFuel(extraFuel);
  }
  return extraFuel;
};

readLinesNumeric().then(input => {
  const total = input.reduce((accumulator, moduleMass) => {
    const moduleFuel = calculateFuel(moduleMass);
    logger.debug(`Initial ${moduleMass} --> ${moduleFuel}`);

    const extraFuel = calculateExtraFuel(moduleFuel);
    logger.debug(`---> extra ${extraFuel}`);

    return accumulator + moduleFuel + extraFuel;
  }, 0);

  logger.info("total: " + total);
});
