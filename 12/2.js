#!/usr/local/bin/node

const logger = require("../common/logger-simple");
const { readLines } = require("../common/readInput");
const readMap = require("./readMap");
const sleep = require("../common/sleep");
var levelup = require("levelup");
var leveldown = require("leveldown");

const maxSteps = 4686774924;
// const maxSteps = 10000;
const axes = ["x", "y", "z"];
let theMap = {};
let allPositions = [];
let step = 1;
let thisPosition;
let velocityChange;

let seenBuckets = {};
let seen = [];
let seenKey = "";
let keyValues = [];

// Generate shorter (but still unique) array keys.
// I only need to go one-way, so I took shortcuts with chunks & ordering.
const alphabet =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const toRange = alphabet.split("");
const toBase = toRange.length;
const fromRange = toRange.slice(0, 12);
const packKey = () => {
  seenKey = "";
  keyValues.forEach(val => {
    if (val < 0) {
      seenKey += "a";
      seenKey += Math.abs(val).toString();
    } else {
      seenKey += "b";
      seenKey += val.toString();
    }
  });

  let keyChunks = [];
  for (let i = 16; i < seenKey.length; i += 16) {
    keyChunks.push(seenKey.slice(i - 16, i));
  }
  keyChunks.push(seenKey.slice(seenKey.length - (16 - (seenKey.length % 16)))); // last fragment

  seenKey = "";
  keyChunks.forEach(chunk => {
    let decimal = 0;
    decimal = chunk.split("").reduce(function(acc, digit, index) {
      return (acc += fromRange.indexOf(digit) * Math.pow(12, index));
    }, 0);

    while (decimal > 0) {
      seenKey += toRange[decimal % toBase];
      decimal = (decimal - (decimal % toBase)) / toBase;
    }
  });
};

readLines().then(async input => {
  theMap = readMap({ input });
  let foundRepeat = false;

  while (step <= maxSteps && !foundRepeat) {
    allPositions = [
      theMap.map(moon => moon.position.x),
      theMap.map(moon => moon.position.y),
      theMap.map(moon => moon.position.z)
    ];

    // update velocities
    theMap.forEach((moon, moonIndex) => {
      axes.forEach((axis, axisIndex) => {
        thisPosition = allPositions[axisIndex][moonIndex];
        velocityChange = 0;
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

    // generate unique key
    keyValues = [];
    theMap.forEach((moon, moonIndex) => {
      axes.forEach(axis => {
        keyValues.push(theMap[moonIndex].position[axis]);
        keyValues.push(theMap[moonIndex].velocity[axis]);
      });
    });
    packKey();

    const bucketId = seenKey.substring(0, 2);
    try {
      seen = levelup(leveldown("./data/db" + bucketId));
    } catch (err) {
      logger.info(`Error creating/opening bucket '${bucketId}`, err);
    }

    if (seenBuckets[bucketId]) {
      try {
        await seen.get(seenKey);
        logger.info(`repeated state at step #${step}! for ${seenKey}`);
        foundRepeat = true;
      } catch (err) {
        // We expect lots of notFound errors. Only report other errors.
        if (!err.notFound) {
          logger.info(`GET error. step=${step} key=${seenKey}`, err);
        }
      }
    } else {
      seenBuckets[bucketId] = true;
    }

    try {
      await seen.put(seenKey, "");
    } catch (err) {
      logger.info(`error in put for '${seenKey}'`, err);
    }

    try {
      await seen.close();
    } catch (err) {
      logger.info(`error in close for '${seenKey}'`, err);
    }

    if (step % 100000 === 0) {
      logger.debug(`step ${step} (` + step.toString().length + ` digits)`);
    }

    step++;
  }

  logger.debug(
    `pausing at step ${step} (` + step.toString().length + ` digits)`
  );

  // await sleep(10 * 60 * 1000);
  logger.debug("done");
});
