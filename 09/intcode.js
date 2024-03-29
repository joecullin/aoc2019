const sleep = require("../common/sleep");

const runProgram = async ({
  memory,
  inputs,
  pointer = 0,
  relativeBaseInput = 0
}) => {
  memory = memory.map(val => {
    return BigInt(val);
  });

  let i = BigInt(pointer);
  let relativeBase = BigInt(relativeBaseInput);
  let output;
  let state;

  const dumpMemory = () => {
    for (let m = 0; m < memory.length; m++) {
      if (memory[m] !== undefined) {
        const isCurrent = i === BigInt(m) ? "<--- current" : "";
        const isRelBase = relativeBase === BigInt(m) ? "<--- relBase" : "";
        console.debug(`mem ${m}: ${memory[m]} ${isCurrent} ${isRelBase}`);
      }
    }
  };

  const readMemoryLocation = location => {
    if (location < 0 || location === undefined) {
      console.error("ERROR Tried to read bad memory location!: " + location);
    }
    let value = memory[location];
    if (value === undefined) {
      value = 0n;
      memory[location] = value;
    }
    console.debug({ message: `readMemoryLocation ${location}: ${value}` });
    return value;
  };

  const readMemorySlice = (start, end) => {
    let values = [];
    for (let location = start; location < end; location++) {
      const value = readMemoryLocation(location);
      values.push(value);
    }
    return values;
  };

  const parseInstruction = instruction => {
    let opcodeString = "";
    let paramModes = [];
    let instructionDigits = instruction.toString().split("");
    opcodeString = instructionDigits.pop();
    if (instructionDigits.length) {
      opcodeString = instructionDigits.pop() + opcodeString;
    }
    const opcode = parseInt(opcodeString);

    for (let paramIndex = 0; paramIndex < 3; paramIndex++) {
      let digit = instructionDigits.pop();
      if (digit === undefined) {
        digit = "0";
      }
      paramModes[paramIndex] = parseInt(digit);
    }
    console.debug({ message: `parsed ${instruction}`, opcode, paramModes });
    return { opcode, paramModes };
  };

  let pass = 0;
  do {
    console.debug(
      `\npass ${pass++} (i=${i}) (relativeBase=${relativeBase}) ---------------------------------------------`
    );
    // Slow the program down, so I can capture heap snapshots before it's gigantic.
    // await sleep(10);

    const instruction = readMemoryLocation(i);
    const instructionDetails = parseInstruction(instruction);
    let opcode = instructionDetails.opcode;
    let paramModes = instructionDetails.paramModes;

    let instructionLength;
    let paramCount;
    let outputIndex;

    // placeholder compute function
    let compute = () => {
      console.error("ERROR Undefined compute function");
    };

    switch (opcode) {
      case 1:
        // add
        instructionLength = 4;
        paramCount = 2;
        outputIndex = 2;
        compute = paramValues => {
          const opResult = paramValues.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0n);
          console.debug({
            message: `compute: added ${paramValues[0]} to ${
              paramValues[1]
            }. result: ${opResult}`
          });
          return { opResult };
        };
        break;
      case 2:
        // multiply
        instructionLength = 4;
        paramCount = 2;
        outputIndex = 2;
        compute = paramValues => {
          console.debug({
            message: `multiplying ${paramValues[0]} by ${paramValues[1]}`
          });
          const opResult = paramValues.reduce((accumulator, currentValue) => {
            return accumulator * currentValue;
          }, 1n);
          console.debug({
            message: `compute: multiplied ${paramValues[0]} by ${
              paramValues[1]
            }. result: ${opResult}`
          });
          return { opResult };
        };
        break;
      case 3:
        // input
        instructionLength = 2;
        paramCount = 1;
        outputIndex = 0;
        compute = () => {
          const opResult = BigInt(inputs.shift());
          console.debug({ message: `compute: read input result: ${opResult}` });
          return { opResult };
        };
        break;
      case 4:
        // output
        instructionLength = 2;
        paramCount = 1;
        outputIndex = null;
        compute = paramValues => {
          output = paramValues[0];
          console.debug({ message: `compute: output value: ${output}` });
          console.info(`OUTPUT: ${output}`);
          state = "output";
          return { opResult: null };
        };
        break;
      case 5:
        // jump-if-true
        instructionLength = 3;
        paramCount = 2;
        outputIndex = null;
        compute = paramValues => {
          if (paramValues[0]) {
            console.debug({
              message: `compute: jump to ${paramValues[1]} because ${
                paramValues[0]
              } is true.`
            });
            return { jumpTo: paramValues[1] };
          } else {
            console.debug({
              message: `compute: do not jump to ${paramValues[1]} because ${
                paramValues[0]
              } is not true.`
            });
            return {};
          }
        };
        break;
      case 6:
        // jump-if-false
        instructionLength = 3;
        paramCount = 2;
        outputIndex = null;
        compute = paramValues => {
          if (!paramValues[0]) {
            console.debug({
              message: `compute: jump to ${paramValues[1]} because ${
                paramValues[0]
              } is false.`
            });
            return { jumpTo: paramValues[1] };
          } else {
            console.debug({
              message: `compute: do not jump to ${paramValues[1]} because ${
                paramValues[0]
              } is not false.`
            });
            return {};
          }
          return !paramValues[0] ? { jumpTo: paramValues[1] } : {};
        };
        break;
      case 7:
        // less-than
        instructionLength = 4;
        paramCount = 2;
        outputIndex = 2;
        compute = paramValues => {
          let opResult;
          if (paramValues[0] < paramValues[1]) {
            opResult = 1n;
            console.debug({
              message: `compute: ${paramValues[0]} is less than ${
                paramValues[1]
              }. result: ${opResult}`
            });
          } else {
            opResult = 0n;
            console.debug({
              message: `compute: ${paramValues[0]} is not less than ${
                paramValues[1]
              }. result: ${opResult}`
            });
          }
          return { opResult };
        };
        break;
      case 8:
        // equal-to
        instructionLength = 4;
        paramCount = 2;
        outputIndex = 2;
        compute = paramValues => {
          let opResult;
          if (paramValues[0] == paramValues[1]) {
            opResult = 1n;
            console.debug({
              message: `compute: ${paramValues[0]} is equal to ${
                paramValues[1]
              }. result: ${opResult}`
            });
          } else {
            opResult = 0n;
            console.debug({
              message: `compute: ${paramValues[0]} is not equal to ${
                paramValues[1]
              }. result: ${opResult}`
            });
          }
          return { opResult };
        };
        break;
      case 9:
        // change relative base
        instructionLength = 2;
        paramCount = 1;
        outputIndex = null;
        compute = paramValues => {
          console.debug({
            message: `compute: move relativeBase ${relativeBase} by ${
              paramValues[0]
            }`
          });
          return { moveRelativeBaseBy: paramValues[0] };
        };
        break;
      case 99:
        // halt
        console.debug({ message: `halt at position ${i}`, output, pointer });
        return {
          memory: [...memory],
          output: inputs.shift(),
          halted: true,
          pointer: i + 1n
        };
      default:
        console.error(
          `ERROR bad opcode in instruction '${instruction}' at position ${i}: '${opcode}'`
        );
        return {};
    }
    console.debug("paramModes", paramModes);
    const params = readMemorySlice(i + 1n, i + 1n + BigInt(paramCount));
    console.debug({ message: "params", params });

    let outputPosition = null;
    if (outputIndex !== null) {
      const mode = paramModes[outputIndex];
      switch (mode) {
        case 1:
          // immediate mode
          outputPosition = BigInt(outputIndex);
          break;
        case 2:
          // relative mode
          outputPosition =
            readMemoryLocation(i + 1n + BigInt(outputIndex)) + relativeBase;
          break;
        default:
          // position mode (0 or null)
          outputPosition = readMemoryLocation(i + 1n + BigInt(outputIndex)); // 1 is to skip the instruction at memory slot i. It's param #i, but memory slot i+1 in this instruction.
          break;
      }
    }
    console.debug(
      `output (param #${outputIndex} ${params[outputIndex]}), mode=${paramModes[outputIndex]} ==> resolves to position ${outputPosition}`
    );

    const paramValues = params.map((param, paramIndex) => {
      let paramValue = BigInt(param);
      if (paramModes[paramIndex] == 1) {
        console.debug(
          `param #${paramIndex}: (${param}) -- immediate --> ${paramValue}`
        );
      } else if (paramModes[paramIndex] == 2) {
        paramValue = readMemoryLocation(paramValue + relativeBase);
        console.debug(
          `param #${paramIndex}: (${param}) -- relative from ${relativeBase} --> ${paramValue}`
        );
      } else {
        const paramPosition = param;
        paramValue = readMemoryLocation(paramPosition);
        console.debug(
          `param #${paramIndex}: (${param}) -- memory[${paramPosition}] --> ${paramValue}`
        );
      }
      return paramValue;
    });

    let result = compute(paramValues);
    console.debug({ message: `outputPosition: ${outputPosition}` });

    const stringifyBigInt = val => {
      return val === null ? null : val.toString();
    };

    console.debug({
      message: `result:`,
      instruction: instruction.toString(),
      opcode,
      params: params.map(p => stringifyBigInt(p)),
      paramModes: paramModes.map(p => stringifyBigInt(p)),
      paramValues: paramValues.map(p => stringifyBigInt(p)),
      outputPosition: stringifyBigInt(outputPosition),
      result
    });

    if (result.opResult !== null) {
      if (outputPosition >= memory.length) {
        console.debug(
          `extending memory from ${memory.length - 1} to ${outputPosition}`
        );
      } else if (outputPosition < 0) {
        console.error(
          `ERROR attempt to write to negative address: ${outputPosition}`
        );
      }
      memory[outputPosition] = result.opResult;
    }

    if (result.jumpTo !== undefined) {
      i = BigInt(result.jumpTo);
    } else {
      i += BigInt(instructionLength);
    }

    if (result.moveRelativeBaseBy) {
      relativeBase += result.moveRelativeBaseBy;
    }

    // This was for day 7 when we were connecting amplifiers in series.
    // Pause after every output, freezing the machine state.
    const freeze = false;
    if (freeze) {
      if (state === "output") {
        return {
          memory: [...memory],
          output,
          halted: false,
          pointer: i
        };
      }
    }

    // console.debug("memory", memory);
  } while (i - 1n < memory.length);

  console.error("ERROR Overran memory with no halt instruction!");
  return;
};

module.exports = runProgram;
