#!/Users/jcullin/.nvm/versions/node/v12.8.0/bin/node

const logger = require("../common/logger");
const { readCommaSeparatedLineNumeric } = require("../common/readInput");
const runProgram = require("./intcode");

readCommaSeparatedLineNumeric().then(input => {

//  let program = input.map( (val) => { return BigInt(val); });
//  console.log(program);
  let program = [...input];

  let computer = { memory: [...program] };
  let inputs = [1];
  const result = runProgram({ inputs, ...computer });
  logger.debug({ message: "result:", result });

  process.exit(0);
});
