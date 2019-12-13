#!/usr/local/bin/node

const logger = require("../common/logger-simple");
const { readLines } = require("../common/readInput");
const readMap = require("./readMap");
const { printMap } = require("./printMap");

const applyGravity = ({ mapData }) => {
  let adjustedMap = [...mapData];

  // for each axis
    // collect all the moon's mapData values on that axis
    // for each moon A
      // for each other moon B
        // adjust A's velocity based on comparing A vs B values





  return adjustedMap;
};

readLines().then(input => {
  const inputMap = readMap({ input });
  const steps = 3;

  let currentMap = [...inputMap];
  for (let step = 1; step <= steps; step++) {
    currentMap = applyGravity({ mapData: currentMap });
    logger.debug(`step ${step}`);
    printMap({ mapData: currentMap });
  }

  logger.debug("done");
});
