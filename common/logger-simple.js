const enableDebug = process.env.LOG_LEVEL === "debug";

const debug = (...args) => {
  if (enableDebug) {
    console.debug(...args);
  }
};

const info = (...args) => {
  console.log(...args);
};

module.exports = { info, debug };
