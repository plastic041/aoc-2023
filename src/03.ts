import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import invariant from "npm:tiny-invariant";

const DIGIT_REGEX = /\d/;
function isDigit(char: string) {
  return DIGIT_REGEX.test(char);
}

const NUMBER_REGEX = /\d+/g;
function isNumber(char: string) {
  return NUMBER_REGEX.test(char);
}

function isSymbol(char: string) {
  return !DIGIT_REGEX.test(char) && char !== ".";
}

type Coord = {
  x: number;
  y: number;
};
function solve1(input: string) {
  const lines = input.split("\n");

  const numberRegex = /\d+/g;
  const nums: {
    x: number;
    y: number;
    value: number;
  }[] = [];
  lines.forEach((line, y) => {
    const numbers = line.matchAll(numberRegex);
    for (const number of numbers) {
      const x = number.index;
      invariant(x !== undefined);
      nums.push({ x, y, value: Number(number[0]) });
    }
  });
  const isValidCoord = ({ x, y }: Coord) => {
    return x >= 0 && y >= 0 && y < lines.length && x < lines[y].length;
  };
  const result = nums
    .filter(({ x: numX, y: numY, value }) => {
      const minX = numX;
      const maxX = numX + String(value).length - 1;

      const neighbors: { x: number; y: number }[] = [];
      // add neighbors
      // top left to top right
      for (let x = minX - 1; x <= maxX + 1; x++) {
        const coord = { x, y: numY - 1 };
        if (isValidCoord(coord)) {
          neighbors.push(coord);
        }
      }
      // left, right
      const leftCoord = { x: minX - 1, y: numY };
      if (isValidCoord(leftCoord)) {
        neighbors.push(leftCoord);
      }
      const rightCoord = { x: maxX + 1, y: numY };
      if (isValidCoord(rightCoord)) {
        neighbors.push(rightCoord);
      }
      // bottom left to bottom right
      for (let x = minX - 1; x <= maxX + 1; x++) {
        const coord = { x, y: numY + 1 };
        if (isValidCoord(coord)) {
          neighbors.push(coord);
        }
      }

      for (const neighbor of neighbors) {
        if (isSymbol(lines[neighbor.y][neighbor.x])) {
          return true;
        }
      }

      return false;
    })
    .reduce((acc, { value }) => acc + value, 0);

  return result;
}

function solve2(input: string) {
  const lines = input.split("\n");

  const numberRegex = /\d+/g;
  const nums: {
    x: number;
    y: number;
    value: number;
  }[] = [];
  lines.forEach((line, y) => {
    const numbers = line.matchAll(numberRegex);
    for (const number of numbers) {
      const x = number.index;
      invariant(x !== undefined);
      nums.push({ x, y, value: Number(number[0]) });
    }
  });
  const isValidCoord = ({ x, y }: Coord) => {
    return x >= 0 && y >= 0 && y < lines.length && x < lines[y].length;
  };
  const resultMap = nums
    .map(({ x: numX, y: numY, value }) => {
      const minX = numX;
      const maxX = numX + String(value).length - 1;

      const neighbors: { x: number; y: number }[] = [];
      // add neighbors
      // top left to top right
      for (let x = minX - 1; x <= maxX + 1; x++) {
        const coord = { x, y: numY - 1 };
        if (isValidCoord(coord)) {
          neighbors.push(coord);
        }
      }
      // left, right
      const leftCoord = { x: minX - 1, y: numY };
      if (isValidCoord(leftCoord)) {
        neighbors.push(leftCoord);
      }
      const rightCoord = { x: maxX + 1, y: numY };
      if (isValidCoord(rightCoord)) {
        neighbors.push(rightCoord);
      }
      // bottom left to bottom right
      for (let x = minX - 1; x <= maxX + 1; x++) {
        const coord = { x, y: numY + 1 };
        if (isValidCoord(coord)) {
          neighbors.push(coord);
        }
      }

      for (const neighbor of neighbors) {
        if (isSymbol(lines[neighbor.y][neighbor.x])) {
          return {
            coord: { x: numX, y: numY },
            value,
            symbol: {
              value: lines[neighbor.y][neighbor.x],
              coord: neighbor,
            },
          };
        }
      }

      return undefined;
    })
    .flatMap((d) => d ? [d] : [])
    .filter((d) => d.symbol.value === "*")
    .reduce((acc, curr) => {
      const coordStr = `${curr.symbol.coord.x}.${curr.symbol.coord.y}`;
      const value = acc.get(coordStr);
      if (value) {
        acc.set(coordStr, value.concat(curr.value));
      } else {
        acc.set(coordStr, [curr.value]);
      }

      return acc;
    }, new Map<string, number[]>());

  const result = [...resultMap.values()]
    .filter((d) => d.length > 1)
    .reduce(
      (acc, curr) => acc + curr.reduce((acc, curr) => acc * curr, 1),
      0,
    );

  return result;
}

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve2(example);

  assertEquals(result, 467835);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve2(input);

  console.log("Result:", result);
});
