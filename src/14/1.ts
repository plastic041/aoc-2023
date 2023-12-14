import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { calculateScore, parse, tiltCells } from "./lib.ts";

function solve(input: string) {
  const { transposed } = parse(input);
  const transposedTilted = transposed.map(tiltCells);

  const score = calculateScore(transposedTilted);

  return score;
}

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve(example);

  assertEquals(result, 136);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve(input);

  console.log("Result:", result);
});
