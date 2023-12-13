import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { type Cell, findIndex } from "./lib.ts";

function solve(input: string) {
  const patterns = input
    .split("\n\n")
    .map((line) =>
      line
        .split("\n")
        .map((row) => row.split("") as Cell[])
    );
  const indexes = patterns.map((pattern) => findIndex(pattern, 2));
  const result = indexes.reduce((acc, { index, orientation }) => {
    if (orientation === "horizontal") {
      return acc + index * 100;
    } else {
      return acc + index;
    }
  }, 0);

  return result;
}

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve(example);

  assertEquals(result, 400);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve(input);

  console.log("Result:", result);
});
