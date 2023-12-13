import invariant from "npm:tiny-invariant";

export type Cell = "#" | ".";
export type Pattern = Cell[][];
type Orientation = "cols" | "rows";

function getMinMaxRangeByCount(maxIndex: number, index: number) {
  invariant(index >= 0);
  invariant(index < maxIndex, `index: ${index}, maxIndex: ${maxIndex}`);

  const minDiff = Math.min(index, maxIndex - index - 1);
  const min = index - minDiff;
  const max = index + minDiff + 1;

  invariant((max - min) % 2 === 1);

  return [min, max];
}

export function getMinMaxRange(
  pattern: Pattern,
  index: number,
  orientation: Orientation,
) {
  invariant(index >= 0);
  return orientation === "cols"
    ? getMinMaxRangeByCount(pattern[0].length - 1, index)
    : getMinMaxRangeByCount(pattern.length - 1, index);
}
function divideByRowIndex(pattern: Pattern, rowIndex: number) {
  const [min, max] = getMinMaxRange(pattern, rowIndex, "rows");
  const subPattern = pattern.slice(min, max + 1);

  const length = subPattern.length;
  const halfLength = Math.floor(length / 2);

  const first = subPattern.slice(0, halfLength);
  const second = subPattern.slice(halfLength);

  return [first, second];
}
function divideByColIndex(pattern: Pattern, colIndex: number) {
  const [min, max] = getMinMaxRange(pattern, colIndex, "cols");
  const subPattern = pattern.map((row) => row.slice(min, max + 1));

  const length = subPattern[0].length;
  const halfLength = Math.floor(length / 2);

  const first = subPattern.map((row) => row.slice(0, halfLength));
  const second = subPattern.map((row) => row.slice(halfLength));

  return [first, second];
}
function mirrorPattern(
  pattern: Pattern,
  orientation: "horizontal" | "vertical",
) {
  if (orientation === "horizontal") {
    return pattern.slice().reverse();
  } else {
    return pattern.map((row) => row.slice().reverse());
  }
}
function countDifference(a: Pattern, b: Pattern) {
  return a.reduce((sum, row, i) => {
    return sum + row.reduce((sum, cell, j) => {
      return sum + (cell === b[i][j] ? 0 : 1);
    }, 0);
  }, 0);
}
export function findIndex(pattern: Pattern, part: 1 | 2): {
  index: number;
  orientation: "horizontal" | "vertical";
} {
  const diffTarget = part === 1 ? 0 : 1;

  // find with rows
  for (let y = 0; y < pattern.length - 1; y++) {
    const [first, second] = divideByRowIndex(pattern, y);
    const secondMirror = mirrorPattern(second, "horizontal");
    const diff = countDifference(first, secondMirror);
    if (diff === diffTarget) {
      return { index: y + 1, orientation: "horizontal" };
    }
  }

  // find with cols
  for (let x = 0; x < pattern[0].length - 1; x++) {
    const [first, second] = divideByColIndex(pattern, x);
    const secondMirror = mirrorPattern(second, "vertical");
    const diff = countDifference(first, secondMirror);
    if (diff === diffTarget) {
      return { index: x + 1, orientation: "vertical" };
    }
  }

  throw new Error("Not found");
}
