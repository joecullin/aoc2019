const readMap = ({ input }) => {
  let mapData = [];
  input.forEach(line => {
    let chars = line.split("");
    let row = [];
    chars.forEach(char => {
      const asteroid = char === "#";
      row.push(asteroid);
    });
    mapData.push([...row]);
  });
  return mapData;
};

module.exports = readMap;
