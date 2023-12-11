import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import invariant from "npm:tiny-invariant";

type Cell = "#" | ".";
type Point = {
  cell: Cell;
  x: number;
  y: number;
};
type Map = Cell[][];

function solve1(input: string) {
  const map = input.split("\n").map((line) => line.split("") as Cell[]);

  const rowsWithOnlyDots = map
    .map((row, rowIndex) => ({ row, rowIndex }))
    .filter(({ row }) => row.every((cell) => cell === "."))
    .map(({ rowIndex }) => rowIndex);
  const columnsWithOnlyDots = map
    .map((_, x) => map.map((row) => row[x]))
    .map((column, x) => ({ column, x }))
    .filter(({ column }) => column.every((cell) => cell === "."))
    .map(({ x }) => x);

  function createEmptyRow() {
    return Array(map[0].length).fill(".");
  }

  for (const row of rowsWithOnlyDots.toReversed()) {
    map.splice(row, 0, createEmptyRow());
  }

  for (const column of columnsWithOnlyDots.toReversed()) {
    map.forEach((row) => row.splice(column, 0, "."));
  }

  /**
   * Get the manhattan distance between two points
   */
  function getDistance(point1: Point, point2: Point) {
    const distance = Math.abs(point1.x - point2.x) +
      Math.abs(point1.y - point2.y);

    if (point1.x === 0 && point1.y === 2 && point2.x === 12 && point2.y === 8) {
      console.log(
        distance,
        Math.abs(point1.x - point2.x),
        Math.abs(point1.y - point2.y),
      );
    }
    return distance;
  }

  const sharps: Point[] = map
    .flatMap((line, y) => line.map((cell, x) => ({ cell, x, y })))
    .filter(({ cell }) => cell === "#");

  const distancesBetweenSharps = sharps
    .flatMap((point1) =>
      sharps.map((point2) => ({
        point1,
        point2,
        distance: getDistance(point1, point2),
      }))
    )
    .filter(({ point1, point2 }) => point1 !== point2);

  const sumOfDistances = distancesBetweenSharps
    .reduce((sum, { distance }) => sum + distance, 0) / 2;

  return sumOfDistances;
}

function solve2(input: string) {
  const map = input.split("\n").map((line) => line.split("") as Cell[]);

  const rowsWithOnlyDots = map
    .map((row, rowIndex) => ({ row, rowIndex }))
    .filter(({ row }) => row.every((cell) => cell === "."))
    .map(({ rowIndex }) => rowIndex);
  const columnsWithOnlyDots = map
    .map((_, x) => map.map((row) => row[x]))
    .map((column, x) => ({ column, x }))
    .filter(({ column }) => column.every((cell) => cell === "."))
    .map(({ x }) => x);

  function createEmptyRow(): Cell[] {
    return Array(map[0].length).fill(".");
  }

  function createEmptyRows(count: number): Cell[][] {
    return Array(count).fill(createEmptyRow());
  }

  const EXPAND = 3;

  for (const column of columnsWithOnlyDots.toReversed()) {
    map.forEach((row) => row.splice(column, 0, ...Array(EXPAND).fill(".")));
  }

  for (const row of rowsWithOnlyDots.toReversed()) {
    map.splice(row, 0, ...createEmptyRows(EXPAND));
  }

  console.log(map.map((row) => row.join("")).join("\n"));

  /**
   * Get the manhattan distance between two points
   */
  function getDistance(point1: Point, point2: Point) {
    const distance = Math.abs(point1.x - point2.x) +
      Math.abs(point1.y - point2.y);

    if (point1.x === 0 && point1.y === 2 && point2.x === 12 && point2.y === 8) {
      console.log(
        distance,
        Math.abs(point1.x - point2.x),
        Math.abs(point1.y - point2.y),
      );
    }
    return distance;
  }

  const sharps: Point[] = map
    .flatMap((line, y) => line.map((cell, x) => ({ cell, x, y })))
    .filter(({ cell }) => cell === "#");

  const distancesBetweenSharps = sharps
    .flatMap((point1) =>
      sharps.map((point2) => ({
        point1,
        point2,
        distance: getDistance(point1, point2),
      }))
    )
    .filter(({ point1, point2 }) => point1 !== point2);

  const sumOfDistances = distancesBetweenSharps
    .reduce((sum, { distance }) => sum + distance, 0) / 2;

  return sumOfDistances;
}

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve2(example);

  assertEquals(result, 1030);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve1(input);

  console.log("Result:", result);
});
