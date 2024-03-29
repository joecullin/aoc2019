#!/Users/jcullin/.nvm/versions/node/v12.8.0/bin/node

const logger = require("../common/logger");
const { readCommaSeparatedLineNumeric } = require("../common/readInput");
const runProgram = require("./intcode");

readCommaSeparatedLineNumeric().then(async program => {
  let computer = { memory: [...program] };
  let inputs = [1];
  const result = await runProgram({ inputs, ...computer });
  logger.debug({ message: "result:", result });
  logger.info("done.");
  process.exit(0);
});
