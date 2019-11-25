const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, metadata } = format;

const logLevelMax = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info";

function stringifyErrorReplacer(key, value) {
  if (value instanceof Error) {
    return {
      // Pull all enumerable properties, supporting properties on custom Errors
      ...value,
      // Explicitly pull Error's non-enumerable properties
      name: value.name,
      message: value.message,
      stack: value.stack
    };
  }

  return value;
}

const myFormat = printf(({ level, message, metadata }) => {
  const timestamp = metadata.timestamp;
  delete metadata.timestamp;
  let logLine = `${timestamp} ${level}: ${message}`;

  // Only include metadata if it's not empty.
  if (Object.keys(metadata).length) {
    logLine += "\t";

    // More readable format for an error message with no data.
    if (level === "error" && typeof metadata.error === "string") {
      logLine += metadata.error;
    } else {
      logLine += JSON.stringify(metadata, stringifyErrorReplacer);
    }
  }
  return logLine;
});

const logger = createLogger({
  level: logLevelMax,
  format: combine(timestamp(), metadata(), myFormat),
  transports: [new transports.Console()]
});

module.exports = logger;

