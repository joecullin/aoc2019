#!/usr/local/bin/node

const logger = require("../common/logger");
const { readLines } = require("../common/readInput");

const pathToCom = ({ object, path, lines }) => {
  if (!path) {
    path = [];
  }
  const line = lines.find(l => {
    return l.outer === object;
  });
  if (line) {
    if (line.inner !== "COM") {
      path = pathToCom({ object: line.inner, path, lines });
    }
    path.push(line);
  }
  return path;
};

readLines().then(input => {
  let lines = [];
  let objectsSet = new Set();
  input.forEach(line => {
    const points = line.split(")");
    lines.push({
      inner: points[0],
      outer: points[1]
    });
    objectsSet.add(points[0]);
    objectsSet.add(points[1]);
  });
  let objects = Array.from(objectsSet);

  const totalOrbits = objects.reduce((acc, object) => {
    const path = pathToCom({ object, lines });
    logger.debug({ message: `path to COM from ${object}:`, path });
    logger.debug({
      message: `orbits to COM from ${object}:`,
      orbits: path.length
    });
    return acc + path.length;
  }, 0);
  logger.info(`total orbits: ${totalOrbits}`);
});
