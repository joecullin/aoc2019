const readMap = ({ input }) => {
  let mapData = [];
  input.forEach(line => {
    let moon = {
      position: { x: null, y: null, z: null },
      velocity: { x: null, y: null, z: null }
    };
    line
      .replace(/[>< ]/g, "")
      .split(",")
      .forEach(coordinate => {
        const [axis, value] = coordinate.split(/[=]/);
        moon.position[axis] = value;
      });
    mapData.push(moon);
  });

  return mapData;
};

module.exports = readMap;
