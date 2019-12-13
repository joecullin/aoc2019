#!/usr/local/bin/node

const logger = require("../common/logger-simple");
const { readLines } = require("../common/readInput");
const readMap = require("./readMap");
const { printMap } = require("./printMap");

const applyGravity = ({ mapData }) => {
  const axes = ["x", "y", "z"];
  const allPositions = [
    mapData.map(moon => moon.position.x),
    mapData.map(moon => moon.position.y),
    mapData.map(moon => moon.position.z)
  ];

  // update velocities
  mapData.forEach((moon, moonIndex) => {
    axes.forEach((axis, axisIndex) => {
      let thisPosition = allPositions[axisIndex][moonIndex];
      let velocityChange = 0;
      allPositions[axisIndex]
        .filter((position, positionIndex) => positionIndex !== moonIndex)
        .forEach(otherMoonPosition => {
          if (otherMoonPosition !== thisPosition) {
            velocityChange += otherMoonPosition < thisPosition ? -1 : 1;
          }
        });
      // logger.debug(`moon #${moonIndex} ${axis} axis velocity change: ${velocityChange}`);
      mapData[moonIndex].velocity[axis] += velocityChange;
    });
  });

  // apply velocities
  mapData.forEach((moon, moonIndex) => {
    axes.forEach(axis => {
      mapData[moonIndex].position[axis] += mapData[moonIndex].velocity[axis];
    });
  });

  return mapData;
};

const moonPotential = moon => {
  const potential =
    Math.abs(moon.position.x) +
    Math.abs(moon.position.y) +
    Math.abs(moon.position.z);
  return potential;
};

const moonKinetic = moon => {
  const kinetic =
    Math.abs(moon.velocity.x) +
    Math.abs(moon.velocity.y) +
    Math.abs(moon.velocity.z);
  return kinetic;
};

readLines().then(input => {
  const inputMap = readMap({ input });
  const steps = 1000;

  let currentMap = [...inputMap];
  for (let step = 1; step <= steps; step++) {
    currentMap = applyGravity({ mapData: currentMap });
    logger.debug(`step ${step}`);
    printMap({ mapData: currentMap });
  }

  const totalEnergy = currentMap.reduce((acc, moon) => {
    return acc + moonPotential(moon) * moonKinetic(moon);
  }, 0);

  logger.info(`total energy: ${totalEnergy}`);
  logger.debug("done");
});
