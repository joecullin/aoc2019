#!/usr/local/bin/node

const logger = require("../common/logger-simple");
const { readLines } = require("../common/readInput");
const readMap = require("./readMap");
const mathjs = require("mathjs");

const axes = ["x", "y", "z"];

readLines().then(async input => {
  let theMap = readMap({ input });
  let originalMap = readMap({ input });

  let foundLoop = { x: 0, y: 0, z: 0 };
  let step = 1;
  while (foundLoop.x === 0 || foundLoop.y === 0 || foundLoop.z === 0) {
    let allPositions = [
      theMap.map(moon => moon.position.x),
      theMap.map(moon => moon.position.y),
      theMap.map(moon => moon.position.z)
    ];

    // update velocities
    theMap.forEach((moon, moonIndex) => {
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
        theMap[moonIndex].velocity[axis] += velocityChange;
      });
    });

    // apply velocities
    theMap.forEach((moon, moonIndex) => {
      axes.forEach(axis => {
        theMap[moonIndex].position[axis] += theMap[moonIndex].velocity[axis];
      });
    });

    // The trick:
    //  - each axis is unaffected by the other axes, and
    //  - each axis has a repeating pattern.
    // So we count when each axis first encounters an already-seen state.
    // (i.e. when it's back to its starting point.)
    // Then find the least common multiple of all 3 counts.
    axes.forEach(axis => {
      if (
        !foundLoop[axis] &&
        theMap.every(
          (moon, moonIndex) =>
            moon.position[axis] === originalMap[moonIndex].position[axis] &&
            moon.velocity[axis] === originalMap[moonIndex].velocity[axis]
        )
      ) {
        foundLoop[axis] = step;
      }
    });

    if (step % 100000 === 0) {
      logger.debug(`step ${step} (` + step.toString().length + ` digits)`);
    }

    step++;
  }

  logger.debug(
    `stopped at ${step} (` + step.toString().length + ` digits)`,
    foundLoop
  );

  const answer = mathjs.lcm(foundLoop.x, foundLoop.y, foundLoop.z);
  logger.info(`answer: ${answer}`);

  // await sleep(10 * 60 * 1000);
  logger.debug("done");
});
