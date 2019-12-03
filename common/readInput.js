const getStdin = require("get-stdin");

const readLinesNumeric = () => {
  return getStdin().then(input => {
    return input.split("\n").map(val => parseInt(val));
    resolve();
  });
};

const readCommaSeparatedLineNumeric = () => {
  return getStdin().then(input => {
    return input.trim().split(",").map(val => parseInt(val));
    resolve();
  });
};

const readCommaSeparatedLines = () => {
  return getStdin().then(input => {
    return input.trim().split("\n").map(line => line.split(","));
    resolve();
  });
};

module.exports = {readLinesNumeric, readCommaSeparatedLineNumeric, readCommaSeparatedLines};
