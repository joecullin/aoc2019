const readImage = ({ width, height, input }) => {
  let digits = input[0].split("").map(val => parseInt(val));
  let image = [];
  let layer = [];
  let row = [];
  digits.forEach((digit, i) => {
    const lastDigit = i === digits.length - 1;
    row.push(digit);
    if (lastDigit || row.length === width) {
      layer.push([...row]);
      row = [];
      if (lastDigit || layer.length === height) {
        image.push([...layer]);
        layer = [];
      }
    }
  });
  return image;
};

module.exports = readImage;
