const getStdin = require("get-stdin");

const readInput = () => {
  return getStdin().then(input => {
    return input.split("\n").map(val => parseInt(val));
    resolve();
  });
};

module.exports = readInput;
