import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { countVisited, parseMap } from "./lib.ts";
import type { Direction, Point } from "./lib.ts";

function solve(input: string) {
  const map = parseMap(input);
  const width = map[0].length;
  const height = map.length;

  const topRowPoints: Point[] = Array.from(
    { length: width },
    (_, x) => ({ coord: { x, y: 0 }, direction: "up" as Direction }),
  );

  const bottomRowPoints: Point[] = Array.from(
    { length: width },
    (_, x) => ({ coord: { x, y: height - 1 }, direction: "down" as Direction }),
  );

  const leftColumnPoints: Point[] = Array.from(
    { length: height },
    (_, y) => ({ coord: { x: 0, y }, direction: "left" as Direction }),
  );

  const rightColumnPoints: Point[] = Array.from(
    { length: height },
    (_, y) => ({ coord: { x: width - 1, y }, direction: "right" as Direction }),
  );

  const startCoords = [
    ...topRowPoints,
    ...bottomRowPoints,
    ...leftColumnPoints,
    ...rightColumnPoints,
  ];

  const counts = startCoords
    .map(({ coord, direction }) => countVisited(map, { coord, direction }));

  return Math.max(...counts);
}

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve(example);

  assertEquals(result, 51);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve(input);

  console.log("Result:", result);
});
