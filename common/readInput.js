const getStdin = require("get-stdin");

const readLinesNumeric = () => {
  return getStdin().then(input => {
    return input.split("\n").map(val => parseInt(val));
  });
};

const readLines = () => {
  return getStdin().then(input => {
    return input.split("\n");
  });
};

const readCommaSeparatedLineNumeric = () => {
  return getStdin().then(input => {
    return input
      .trim()
      .split(",")
      .map(val => parseInt(val));
  });
};

const readCommaSeparatedLines = () => {
  return getStdin().then(input => {
    return input
      .trim()
      .split("\n")
      .map(line => line.split(","));
  });
};

module.exports = {
  readLinesNumeric,
  readCommaSeparatedLineNumeric,
  readCommaSeparatedLines,
  readLines
};
