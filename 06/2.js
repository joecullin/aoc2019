#!/usr/local/bin/node

const logger = require("../common/logger");
const { readLines } = require("../common/readInput");

const pathToObject = ({ from, to, path, lines }) => {
  if (!path) {
    path = [];
  }
  const line = lines.find(l => {
    return l.outer === from;
  });
  if (line) {
    if (line.inner !== to) {
      path = pathToObject({ from: line.inner, to, path, lines });
    }
    path.push(line);
  }
  return path;
};

readLines().then(input => {
  let lines = [];
  input.forEach(line => {
    const points = line.split(")");
    lines.push({
      inner: points[0],
      outer: points[1]
    });
  });

  const pathToCom = from => {
    return pathToObject({ from, to: "COM", lines })
      .reverse()
      .map(line => line.inner);
  };
  const pathYouToCom = pathToCom("YOU");
  const pathSanToCom = pathToCom("SAN");
  logger.debug({ message: `path from YOU to COM:`, pathYouToCom });
  logger.debug({ message: `path from SAN to COM:`, pathSanToCom });

  let intersection = pathYouToCom.find(youPoint => {
    return pathSanToCom.find(sanPoint => youPoint === sanPoint);
  });
  logger.debug(`intersection: ${intersection}`);

  const pathToYou = pathToObject({ to: intersection, from: "YOU", lines });
  const pathToSan = pathToObject({ to: intersection, from: "SAN", lines });
  logger.debug({ message: "paths", pathToYou, pathToSan });
  const orbits = pathToYou.length + pathToSan.length - 2;

  logger.info(`orbits: ${orbits}`);
});
