#!/usr/local/bin/node

const logger = require("../common/logger");
const { readLines } = require("../common/readInput");
const readMap = require("./readMap");
const printMap = require("./printMap");

const findDistance = (a, b) => {
  // (Overly verbose b/c somehow I got it in my head that
  // I could square x by writing x^2, and I had to unpack
  // it value by value to see what I was doing wrong.)

  if (a.x === b.x) {
    return Math.abs(a.y - b.y);
  } else if (a.y === b.y) {
    return Math.abs(a.x - b.x);
  } else {
    const sideX = Math.abs(a.x - b.x);
    const sideY = Math.abs(a.y - b.y);
    const sideZ = Math.sqrt(sideX * sideX + sideY * sideY);
    return sideZ;
  }
};

// https://math.stackexchange.com/a/1201367
const findAngle = (a, b) => {
  // treat "a" as 0,0.
  // x,y represents "b" relative to "a":
  const x = b.x - a.x;
  const y = b.y - a.y;
  return (Math.atan2(y, x) * 180) / Math.PI;
};

const visibleCount = ({ x, y, mapData }) => {
  let allOthers = [];
  mapData.forEach((row, toY) => {
    row.forEach((asteroid, toX) => {
      // const debug = toX === 3 && toY === 2;
      const isSelf = x === toX && y === toY;
      if (asteroid && !isSelf) {
        const distance = findDistance({ x, y }, { x: toX, y: toY });
        const angle = findAngle({ x, y }, { x: toX, y: toY });
        allOthers.push({ toX, toY, distance, angle });
      }
    });
  });
  // logger.debug({ message: `data for x=${x} y=${y}`, allOthers });

  const allAngles = allOthers.map(point => {
    return point.angle;
  });
  const uniqueAngles = [...new Set(allAngles)];

  // Only one point (the closest) in each direction is visible.
  return uniqueAngles.length;
};

readLines().then(input => {
  const mapData = readMap({ input });

  const visualizeCounts = [];
  const counts = [];
  mapData.forEach((row, y) => {
    let visualizeRow = [];
    row.forEach((asteroid, x) => {
      if (asteroid) {
        const count = visibleCount({ x, y, mapData });
        visualizeRow.push(count);
        counts.push({ count, x, y });
      } else {
        visualizeRow.push(0);
      }
    });
    visualizeCounts.push(visualizeRow);
  });

  printMap({ mapData });
  printMap({ mapData: visualizeCounts, which: "values" });

  let best = counts.sort((a, b) => b.count - a.count)[0];

  logger.info({ message: "best", best });

  logger.info("done.");
});
