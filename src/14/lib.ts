import invariant from "npm:tiny-invariant";
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

export type Cell = "O" | "#" | ".";

/**
 * Move the "O" cell to the left as far as possible.
 */
export function tiltCells(cells: Cell[]) {
  const newCells = cells.slice();

  for (let i = 0; i < newCells.length; i++) {
    if (newCells[i] === "O") {
      for (let j = i - 1; j >= 0; j--) {
        if (newCells[j] === ".") {
          newCells[j] = "O";
          newCells[j + 1] = ".";
        } else {
          break;
        }
      }
    }
  }

  return newCells;
}

function transpose<T>(matrix: T[][]): T[][] {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}

export function parse(input: string) {
  const map = input.split("\n").map((line) => line.split("") as Cell[]);

  const transposed = transpose(map);

  return {
    map,
    transposed,
  };
}

export function calculateScore(map: Cell[][]) {
  const transposed = transpose(map);
  const reversed = transposed.reverse();
  const scores = reversed
    .map((row) => row.filter((cell) => cell === "O").length)
    .map((count, index) => count * (index + 1));

  return scores.reduce((acc, score) => acc + score, 0);
}

// Deno.test("Test", () => {
//   const cells: Cell[] = ".O...#O..O".split("") as Cell[];

//   tiltCells(cells);

//   assertEquals(cells.join(""), "O....#OO..");
// });
