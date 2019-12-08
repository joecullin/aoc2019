#!/usr/local/bin/node

const logger = require("../common/logger");
const { readLines } = require("../common/readInput");
const readImage = require("./readImage");

const width = 25;
const height = 6;

readLines().then(input => {
  const image = readImage({ width, height, input });
  // logger.debug({ message: "image", image });

  const countDigitInLayer = (targetDigit, layer) => {
    let count = 0;
    layer.forEach(row => {
      count += row.filter(d => {
        return d === targetDigit;
      }).length;
    });
    logger.debug({
      message: `found ${count} of ${targetDigit} in layer`,
      layer
    });
    return count;
  };

  let layer = image.sort(
    (a, b) => countDigitInLayer(0, a) - countDigitInLayer(0, b)
  )[0];
  logger.debug({ message: "found layer", layer });
  let checksum = countDigitInLayer(1, layer) * countDigitInLayer(2, layer);
  logger.info("answer: " + checksum);
});
