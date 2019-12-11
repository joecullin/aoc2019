#!/usr/local/bin/node

const logger = require("../common/logger");
const { readCommaSeparatedLines } = require("../common/readInput");

const traceWire = pathInstructions => {
  let pathTraced = [];
  let totalSteps = 0;
  let stepCounts = {};
  let currentPoint = [0, 0];
  pathInstructions.forEach(instruction => {
    logger.debug(`instruction: ${instruction}`);
    const direction = instruction.substring(0, 1);
    let steps = instruction.substring(1);
    while (steps > 0) {
      totalSteps++;
      steps--;
      let x = 0;
      let y = 0;
      switch (direction) {
        case "R":
          x = 1;
          break;
        case "L":
          x = -1;
          break;
        case "U":
          y = 1;
          break;
        case "D":
          y = -1;
          break;
        default:
          logger.error(`invalid direction ${instruction}`);
      }
      let nextPoint = [...currentPoint];
      nextPoint[0] += x;
      nextPoint[1] += y;
      const pointString = nextPoint.join(":");
      pathTraced.push(pointString);
      if (!stepCounts[pointString]) {
        stepCounts[pointString] = totalSteps;
      }
      currentPoint = nextPoint;
      logger.debug({ message: "point", currentPoint });
    }
  });
  return { pathTraced: pathTraced, stepCounts: stepCounts };
};

readCommaSeparatedLines().then(input => {
  logger.debug({ message: "input", input });
  const wire1 = traceWire(input[0]);
  const wire2 = traceWire(input[1]);
  logger.debug({ message: "wire 1", wire1 });
  logger.debug({ message: "wire 2", wire2 });

  let points1 = new Set(wire1.pathTraced);
  let points2 = new Set(wire2.pathTraced);
  logger.debug({ message: "wire 1 points", values: Array.from(points1) });
  logger.debug({ message: "wire 2 points", values: Array.from(points2) });
  let intersections = [...points1].filter(x => points2.has(x));
  logger.debug({ message: "common points", intersections });

  const distances = intersections
    .map(point => {
      const steps1 = wire1.stepCounts[point];
      const steps2 = wire2.stepCounts[point];
      return steps1 + steps2;
    })
    .sort((a, b) => {
      return a - b;
    });
  logger.debug({ message: "distances", distances });
  logger.info(distances[0]);
});
