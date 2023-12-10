import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import invariant from "npm:tiny-invariant";

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

type Tile = "." | "|" | "-" | "L" | "J" | "7" | "F" | "S";
type Direction = "N" | "E" | "S" | "W";

function isStart(tile: Tile) {
  return tile === "S";
}

function findNext(
  map: Tile[][],
  x: number,
  y: number,
  from: Direction,
): { x: number; y: number; direction: Direction } {
  const tile = map[y][x];

  switch (from) {
    case "N":
      switch (tile) {
        case "|":
          return { x, y: y + 1, direction: "N" };
        case "L":
          return { x: x + 1, y, direction: "W" };
        case "J":
          return { x: x - 1, y, direction: "E" };
        default:
          invariant(false, `Invalid tile ${tile} at ${x},${y}`);
      }
      break;
    case "E":
      switch (tile) {
        case "-":
          return { x: x - 1, y, direction: "E" };
        case "L":
          return { x, y: y - 1, direction: "S" };
        case "F":
          return { x, y: y + 1, direction: "N" };
        default:
          invariant(false, `Invalid tile ${tile} at ${x},${y}`);
      }
      break;
    case "S":
      switch (tile) {
        case "|":
          return { x, y: y - 1, direction: "S" };
        case "7":
          return { x: x - 1, y, direction: "E" };
        case "F":
          return { x: x + 1, y, direction: "W" };
        default:
          invariant(false, `Invalid tile ${tile} at ${x},${y}`);
      }
      break;
    case "W":
      switch (tile) {
        case "-":
          return { x: x + 1, y, direction: "W" };
        case "J":
          return { x, y: y - 1, direction: "S" };
        case "7":
          return { x, y: y + 1, direction: "N" };
        default:
          invariant(false, `Invalid tile ${tile} at ${x},${y}`);
      }
  }
}

function solve1(input: string) {
  const map: Tile[][] = input
    .split("\n")
    .map((line) => line.split("") as Tile[]);

  const start = map
    .flatMap((line, y) =>
      line
        .map((tile, x) => ({ x, y, tile }))
        .filter((t) => isStart(t.tile))
    )[0];

  const neighbors: {
    x: number;
    y: number;
    direction: Direction;
  }[] = [
    { x: start.x, y: start.y - 1, direction: "S" as Direction },
    { x: start.x, y: start.y + 1, direction: "N" as Direction },
    { x: start.x - 1, y: start.y, direction: "W" as Direction },
    { x: start.x + 1, y: start.y, direction: "E" as Direction },
  ]
    .filter((n) => map[n.y][n.x] !== undefined)
    .filter((n) => map[n.y][n.x] !== ".")
    .filter((n) => map[n.y][n.x] !== "S");

  let current = neighbors[0];
  let steps = 2; // start + first step
  while (true) {
    const next = findNext(map, current.x, current.y, current.direction);

    if (isStart(map[next.y][next.x])) {
      break;
    }

    current = next;
    steps++;
  }

  return steps / 2;
}

function solve2(input: string) {
  const map: Tile[][] = input
    .split("\n")
    .map((line) => line.split("") as Tile[]);

  const start = map
    .flatMap((line, y) =>
      line
        .map((tile, x) => ({ x, y, tile }))
        .filter((t) => isStart(t.tile))
    )[0];

  const neighbors: {
    x: number;
    y: number;
    direction: Direction;
  }[] = [
    { x: start.x, y: start.y - 1, direction: "S" as Direction },
    { x: start.x, y: start.y + 1, direction: "N" as Direction },
    { x: start.x - 1, y: start.y, direction: "W" as Direction },
    { x: start.x + 1, y: start.y, direction: "E" as Direction },
  ]
    .filter((n) => map[n.y]?.[n.x] !== undefined)
    .filter((n) => map[n.y][n.x] !== ".")
    .filter((n) => map[n.y][n.x] !== "S");

  let current = neighbors[0];
  let steps = 2; // start + first step
  const loop = [{ ...current }];

  while (true) {
    const next = findNext(map, current.x, current.y, current.direction);
    loop.push({ ...next });

    if (isStart(map[next.y][next.x])) {
      break;
    }

    current = next;

    steps++;
  }

  function isInsideLoop(x: number, y: number) {
    const isLoopEdge = loop.some((l) => l.x === x && l.y === y);
    if (isLoopEdge) return false;

    // loop edges, { x: x - 1, y: y - 1 }, { x: x - 2, y: y - 2 }, { x: x - 3, y: y - 3 }, ...
    // until we hit a loop edge or a loop corner
    function findLoopEdgesInUpLeft(x: number, y: number) {
      const loopEdges = [];
      const min = Math.min(x, y);
      for (let i = 1; i <= min; i++) {
        const tile = loop.find((l) => l.x === x - i && l.y === y - i);
        if (tile === undefined) {
          continue;
        }

        loopEdges.push(tile);
      }

      return loopEdges;
    }

    const loopEdgesInUpLeft = findLoopEdgesInUpLeft(x, y);

    if (loopEdgesInUpLeft.length % 2 === 0) {
      return false;
    }

    function findLoopEdgesInDownRight(x: number, y: number) {
      const loopEdges = [];
      const max = Math.max(x, y);
      for (let i = 1; i <= max; i++) {
        const tile = loop.find((l) => l.x === x + i && l.y === y + i);
        if (tile === undefined) {
          continue;
        }

        loopEdges.push(tile);
      }

      return loopEdges;
    }

    const loopEdgesInDownRight = findLoopEdgesInDownRight(x, y);

    if (loopEdgesInDownRight.length % 2 === 0) {
      return false;
    }

    return true;
  }

  const tilesInsideLoop = map
    .flatMap((line, y) =>
      line
        .map((_, x) => ({ x, y }))
        .filter((t) => isInsideLoop(t.x, t.y))
    );

  return tilesInsideLoop.length;
}

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve2(example);

  assertEquals(result, 4);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve2(input);

  console.log("Result:", result);
});
