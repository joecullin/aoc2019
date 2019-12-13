// const logger = require("../common/logger-simple");

const printMap = ({ mapData }) => {
  mapData.forEach((moon, moonIndex) => {
    // pad all values to equal lengths
    let pos = {};
    let vel = {};

    // I should just break my no-modules rule and find an sprintf implementation.
    const formatValue = value => {
      if (value === undefined || value === null) {
        value = "**";
      } else {
        value = value.toString();
      }
      if (value.slice(0, 1) !== "-") {
        value = " " + value;
      }
      return value.padEnd(3, " ");
    };

    Object.entries(moon.position).forEach(([axis, value]) => {
      pos[axis] = formatValue(value);
    });
    Object.entries(moon.velocity).forEach(([axis, value]) => {
      vel[axis] = formatValue(value);
    });

    process.stdout.write(
      [
        `moon #${moonIndex}:`,
        `pos=<x=${pos.x} y=${pos.y} z=${pos.z}>`,
        `vel=<x=${vel.x} y=${vel.y} z=${vel.z}>`
      ].join("   ")
    );
    process.stdout.write("\n");
  });
  process.stdout.write("\n");
};

module.exports = { printMap };
