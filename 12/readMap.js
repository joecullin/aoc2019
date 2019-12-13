const readMap = ({ input }) => {
  let mapData = [];
  input.forEach(line => {
    let moon = {
      position: { x: null, y: null, z: null },
      velocity: { x: 0, y: 0, z: 0 }
    };
    line
      .replace(/[>< ]/g, "")
      .split(",")
      .forEach(coordinate => {
        const [axis, value] = coordinate.split(/[=]/);
        moon.position[axis] = parseInt(value);
      });
    mapData.push(moon);
  });

  return mapData;
};

module.exports = readMap;
