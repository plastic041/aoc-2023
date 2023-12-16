import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import invariant from "npm:tiny-invariant";

export type Coord = { x: number; y: number };
type CoordStr = `${number},${number}`;
export type Direction = "left" | "right" | "up" | "down";
export type Point = { coord: Coord; direction: Direction };
type Mirror = "/" | "\\" | "|" | "-";
type Cell = "." | Mirror;

function isValidCoord(coord: Coord, map: Cell[][]): boolean {
  return coord.y >= 0 && coord.y < map.length &&
    coord.x >= 0 && coord.x < map[coord.y].length;
}

function nextPoint(
  coord: Coord,
  fromDirection: Direction,
  map: Cell[][],
): Point[] {
  const cell = map[coord.y][coord.x];

  switch (cell) {
    case "/":
      switch (fromDirection) {
        case "left":
          return [{ coord: { x: coord.x, y: coord.y - 1 }, direction: "down" }];
        case "right":
          return [{ coord: { x: coord.x, y: coord.y + 1 }, direction: "up" }];
        case "up":
          return [{
            coord: { x: coord.x - 1, y: coord.y },
            direction: "right",
          }];
        case "down":
          return [{ coord: { x: coord.x + 1, y: coord.y }, direction: "left" }];
      }
    case "\\":
      switch (fromDirection) {
        case "left":
          return [{ coord: { x: coord.x, y: coord.y + 1 }, direction: "up" }];
        case "right":
          return [{ coord: { x: coord.x, y: coord.y - 1 }, direction: "down" }];
        case "up":
          return [{ coord: { x: coord.x + 1, y: coord.y }, direction: "left" }];
        case "down":
          return [{
            coord: { x: coord.x - 1, y: coord.y },
            direction: "right",
          }];
      }
    case "|":
      switch (fromDirection) {
        case "left":
        case "right":
          return [
            { coord: { x: coord.x, y: coord.y - 1 }, direction: "down" },
            { coord: { x: coord.x, y: coord.y + 1 }, direction: "up" },
          ];
        case "up":
          return [
            { coord: { x: coord.x, y: coord.y + 1 }, direction: "up" },
          ];
        case "down":
          return [
            { coord: { x: coord.x, y: coord.y - 1 }, direction: "down" },
          ];
      }
    case "-":
      switch (fromDirection) {
        case "left":
          return [
            { coord: { x: coord.x + 1, y: coord.y }, direction: "left" },
          ];
        case "right":
          return [
            { coord: { x: coord.x - 1, y: coord.y }, direction: "right" },
          ];
        case "up":
        case "down":
          return [
            { coord: { x: coord.x - 1, y: coord.y }, direction: "right" },
            { coord: { x: coord.x + 1, y: coord.y }, direction: "left" },
          ];
      }
    case ".":
      switch (fromDirection) {
        case "left":
          return [{ coord: { x: coord.x + 1, y: coord.y }, direction: "left" }];
        case "right":
          return [{
            coord: { x: coord.x - 1, y: coord.y },
            direction: "right",
          }];
        case "up":
          return [{ coord: { x: coord.x, y: coord.y + 1 }, direction: "up" }];
        case "down":
          return [{ coord: { x: coord.x, y: coord.y - 1 }, direction: "down" }];
      }
  }
}

export function parseMap(input: string): Cell[][] {
  const map = input.split("\n").map((line) => line.split("") as Cell[]);

  return map;
}

export function countVisited(
  map: Cell[][],
  start: Point = {
    coord: { x: 0, y: 0 },
    direction: "left",
  },
): number {
  const visited: Set<CoordStr> = new Set();
  const visitedWithDirection: Set<`${CoordStr},${Direction}`> = new Set();
  const queue: { coord: Coord; direction: Direction }[] = [start];

  while (queue.length > 0) {
    const { coord, direction } = queue.pop()!;

    const coordStr: CoordStr = `${coord.x},${coord.y}`;

    if (visitedWithDirection.has(`${coordStr},${direction}`)) {
      continue;
    }

    visited.add(coordStr);
    visitedWithDirection.add(`${coordStr},${direction}`);

    const nextCells = nextPoint(coord, direction, map);

    for (const nextCell of nextCells) {
      if (isValidCoord(nextCell.coord, map)) {
        queue.push(nextCell);
      }
    }
  }

  return visited.size;
}

// Deno.test("Test", () => {
//   const cells: Cell[] = ".O...#O..O".split("") as Cell[];

//   tiltCells(cells);

//   assertEquals(cells.join(""), "O....#OO..");
// });
