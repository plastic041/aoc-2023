import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import invariant from "npm:tiny-invariant";

function parse1(input: string) {
  const lines = input.split("\n");
  const times = lines[0]
    .split(": ")[1]
    .trim()
    .split(" ")
    .filter((c) => c !== "")
    .map(Number);
  const distance = lines[1]
    .split(": ")[1]
    .trim()
    .split(" ")
    .filter((c) => c !== "")
    .map(Number);

  const races = [] as {
    time: number;
    distance: number;
  }[];

  for (let i = 0; i < times.length; i++) {
    races.push({ time: times[i], distance: distance[i] });
  }

  return races;
}

function parse2(input: string) {
  const lines = input.split("\n");
  const time = Number(
    lines[0]
      .split(": ")[1]
      .replaceAll(" ", ""),
  );

  const distance = Number(
    lines[1]
      .split(": ")[1]
      .replaceAll(" ", ""),
  );

  return { time, distance };
}

type Race = {
  time: number;
  distance: number;
};

function countRaceCompletions(race: Race) {
  let completions = 0;
  for (let charge = 0; charge < race.time; charge++) {
    const remainingTime = race.time - charge;
    const chargedDistance = charge * remainingTime;
    if (chargedDistance > race.distance) {
      completions++;
    }
  }

  return completions;
}

function solve1(input: string) {
  const races = parse1(input);
  const completions = races.map(countRaceCompletions);
  const product = completions.reduce((acc, curr) => acc * curr, 1);

  return product;
}

function solve2(input: string) {
  const race = parse2(input);

  const completions = countRaceCompletions(race);

  return completions;
}

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve2(example);

  assertEquals(result, 71503);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve2(input);

  console.log("Result:", result);
});
