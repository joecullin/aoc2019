// from https://en.wikipedia.org/wiki/ANSI_escape_code#Escape_sequences
const CSI = "\x1B[";

const clearScreen = () => {
  process.stdout.write(CSI + "2J");
};

const printMap = ({ mapData, highlight = {}, which, redraw = false }) => {
  const darkBlock = "\u2588";
  const lightBlock = "\u2591";
  const spacer = " ";
  const padLength = 3;

  if (redraw) {
    process.stdout.write(CSI + "1;1H");
  }

  // column labels
  const columns = mapData[0].length;
  const columnDigits = columns.toString().split("").length;
  for (let row = 0; row < columnDigits; row++) {
    process.stdout.write(" ".padStart(padLength, " ") + spacer); // row label gap
    for (let col = 0; col < columns; col++) {
      const digits = col.toString().split("");
      const digit = digits[row] ? digits[row] : " ";
      process.stdout.write(digit.padStart(padLength, " "));
      process.stdout.write(spacer);
    }
    process.stdout.write("\n");
  }
  process.stdout.write("  " + spacer); // row label gap
  for (let col = 0; col < columns; col++) {
    process.stdout.write("-");
    process.stdout.write(spacer);
  }
  process.stdout.write("\n");

  mapData.forEach((row, y) => {
    process.stdout.write(y.toString().padStart(padLength, " ") + "|" + spacer); // row label
    row.forEach((asteroid, x) => {
      let char;
      let highlightStart = "";
      let highlightEnd = "";
      if (which === "values") {
        char = mapData[y][x].toString();
      } else {
        char = asteroid ? darkBlock : lightBlock;
      }
      if (highlight.x === x && highlight.y === y) {
        highlightStart = CSI + "91;47m";
        highlightEnd = CSI + "0m";
      }
      process.stdout.write(
        highlightStart + char.padStart(padLength, " ") + highlightEnd
      );
      process.stdout.write(spacer);
    });
    process.stdout.write("\n");
  });
  process.stdout.write("\n");
};

module.exports = { printMap, clearScreen };
