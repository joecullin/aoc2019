#!/usr/local/bin/node

const logger = require("../common/logger");
const { readCommaSeparatedLines } = require("../common/readInput");

const traceWire = pathInstructions => {
  let pathTraced = [];
  let currentPoint = [0, 0];
  pathInstructions.forEach(instruction => {
    logger.debug(`instruction: ${instruction}`);
    const direction = instruction.substring(0, 1);
    let steps = instruction.substring(1);
    while (steps > 0) {
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
      pathTraced.push(nextPoint.join(":"));
      currentPoint = nextPoint;
      logger.debug({ message: "point", currentPoint });
    }
  });
  return pathTraced;
};

readCommaSeparatedLines().then(input => {
  logger.debug({ message: "input", input });
  logger.debug("wire 1 -----------------------------");
  const path1 = traceWire(input[0]);
  logger.debug("wire 2 -----------------------------");
  const path2 = traceWire(input[1]);
  logger.debug({ message: "wire 1 path", path1 });
  logger.debug({ message: "wire 2 path", path2 });

  let points1 = new Set(path1);
  let points2 = new Set(path2);
  logger.debug({ message: "wire 1 points", values: Array.from(points1) });
  logger.debug({ message: "wire 2 points", values: Array.from(points2) });
  let intersections = [...points1].filter(x => points2.has(x));
  logger.debug({ message: "common points", intersections });

  const distances = intersections
    .map(point => {
      let coords = point.split(":");
      return Math.abs(coords[0]) + Math.abs(coords[1]);
    })
    .sort((a, b) => {
      return a - b;
    });
  logger.debug({ message: "distances", distances });
  logger.info(distances[0]);
});
