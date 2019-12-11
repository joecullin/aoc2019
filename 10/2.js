#!/usr/local/bin/node

const logger = require("../common/logger");
const { readLines } = require("../common/readInput");
const readMap = require("./readMap");
const { printMap, clearScreen } = require("./printMap");

const findDistance = (a, b) => {
  if (a.x === b.x) {
    return Math.abs(a.y - b.y);
  } else if (a.y === b.y) {
    return Math.abs(a.x - b.x);
  } else {
    const sideX = Math.abs(a.x - b.x);
    const sideY = Math.abs(a.y - b.y);
    return Math.sqrt(Math.pow(sideX, 2) + Math.pow(sideY, 2));
  }
};

const findAngle = (a, b) => {
  // treat "a" as 0,0.
  // x,y represents "b" relative to "a":
  const x = b.x - a.x;
  const y = b.y - a.y;
  // https://math.stackexchange.com/a/1201367
  // const angle = (Math.atan2(y, x) * 180) / Math.PI;
  // That was good enough for part 1, but now:
  //   - My x axis is upside down, and
  //   - I want to start at noon.
  const atan2 = Math.atan2(y, x);
  const angle =
    ((atan2 >= 0 ? atan2 : 2 * Math.PI + atan2) * 360) / (2 * Math.PI);
  return angle;
};

const visibleCount = ({ x, y, mapData }) => {
  let allOthers = [];
  mapData.forEach((row, toY) => {
    row.forEach((asteroid, toX) => {
      const isSelf = x === toX && y === toY;
      if (asteroid && !isSelf) {
        const distance = findDistance({ x, y }, { x: toX, y: toY });
        const angle = findAngle({ x, y }, { x: toX, y: toY });
        allOthers.push({ toX, toY, distance, angle });
      }
    });
  });

  const allAngles = allOthers.map(point => {
    return point.angle;
  });
  const uniqueAngles = [...new Set(allAngles)];

  // Only one point (the closest) in each direction is visible.
  return uniqueAngles.length;
};

const findTargets = ({ x, y, mapData }) => {
  let allOthers = [];
  mapData.forEach((row, toY) => {
    row.forEach((asteroid, toX) => {
      const isSelf = x === toX && y === toY;
      if (asteroid && !isSelf) {
        const distance = findDistance({ x, y }, { x: toX, y: toY });
        const angle = findAngle({ x, y }, { x: toX, y: toY });
        allOthers.push({ x: toX, y: toY, distance, angle });
      }
    });
  });

  return allOthers;
};

readLines().then(input => {
  const mapData = readMap({ input });

  // part 1: find our base station asteroid.

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

  let station = counts.sort((a, b) => b.count - a.count)[0];
  const showPart1 = false;
  if (showPart1) {
    logger.info({ message: "station", station });

    printMap({ mapData, highlight: { x: station.x, y: station.y } });
    printMap({
      mapData: visualizeCounts,
      which: "values",
      highlight: { x: station.x, y: station.y }
    });
  }

  // part 2

  let targets = findTargets({ ...station, mapData });

  const allAngles = targets.map(point => {
    return point.angle;
  });
  const uniqueAngles = [...new Set(allAngles)].sort((a, b) => a - b);

  let guess = 200;
  let zapCount = 0;
  // find the first angle >= 270 degrees -- that's 12 o'clock from our station.
  let angleIndex = uniqueAngles.findIndex(angle => angle >= 270);

  let answer;
  clearScreen();
  while (zapCount < guess && targets.length) {
    if (angleIndex === uniqueAngles.length) {
      angleIndex = 0;
    }
    let angle = uniqueAngles[angleIndex++];
    const targetsInLine = targets
      .filter(t => {
        return t.angle === angle;
      })
      .sort((a, b) => {
        return a.distance - b.distance;
      });
    logger.debug({ message: `targets in line with ${angle}`, targetsInLine });

    const target = targetsInLine.shift();

    if (target) {
      logger.debug({ message: `target`, target });
      mapData[target.y][target.x] = false;
      targets = findTargets({ ...station, mapData });
      zapCount++;
      logger.debug({ message: `zapped ${zapCount}`, target });
    } else {
      logger.error(`no more left to zap at ${angle}`);
    }

    printMap({
      mapData,
      highlight: { x: station.x, y: station.y },
      redraw: true
    });

    if (zapCount === guess) {
      answer = (100 * target.x + target.y).toString();
      logger.debug(`zap #${guess} at ${target.x},${target.y} --> ${answer}`);
    }
  }

  logger.info("done: " + answer);
});
