#!/usr/local/bin/node

const logger = require("../common/logger");
const { readLines } = require("../common/readInput");
const readImage = require("./readImage");

const width = 25;
const height = 6;

const printLayer = layer => {
  const darkBlock = "\u2588";
  const lightBlock = "\u2591";
  layer.forEach(row => {
    row.forEach(digit => {
      const char = digit === 0 ? lightBlock : darkBlock;
      process.stdout.write(char);
    });
    process.stdout.write("\n");
  });
};

const viewImage = image => {
  // Initialize all pixels to white.
  let visibleLayer = Array.from({ length: height }, () => []);
  visibleLayer.forEach((row, i) => {
    visibleLayer[i] = Array.from({ length: width }, () => 1);
  });

  // Overlay each layer, from back to front.
  image.reverse().forEach(layer => {
    layer.forEach((row, rowNum) => {
      row.forEach((digit, digitNum) => {
        if (digit !== 2) {
          visibleLayer[rowNum][digitNum] = digit;
        }
      });
    });
  });

  return visibleLayer;
};

readLines().then(input => {
  const image = readImage({ width, height, input });
  const visibleLayer = viewImage(image);
  printLayer(visibleLayer);
  logger.info("done.");
});
