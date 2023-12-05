import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import invariant from "npm:tiny-invariant";

function getIntersect<T>(a: T[], b: T[]) {
  const setB = new Set(b);
  return [...new Set(a)].filter((x) => setB.has(x));
}

function solve1(input: string) {
  const lines = input.split("\n");

  const cards = lines
    .map((line) => line.split(": ")[1])
    .map((line) => line.split(" | "))
    .map(([winningNumsStr, numsStr]) => ({
      winningNums: winningNumsStr
        .trim()
        .split(" ")
        .filter((x) => x !== "")
        .map((numStr) => numStr.trim())
        .map(Number),
      nums: numsStr
        .trim()
        .split(" ")
        .filter((x) => x !== "")
        .map((numStr) => numStr.trim())
        .map(Number),
    }));

  const withIntersections = cards
    .map(({ winningNums, nums }) => getIntersect(winningNums, nums))
    .filter((x) => x.length > 0);

  const sum = withIntersections
    .map((x) => x.length)
    .map((x) => 2 ** (x - 1))
    .reduce((a, b) => a + b, 0);

  return sum;
}

type ScratchCard = {
  id: number;
  winningNums: number[];
  nums: number[];
};

function solve2(input: string) {
  const scratchCards: ScratchCard[] = input.split("\n")
    .map((line) => line.split(": ")[1])
    .map((line) => line.split(" | "))
    .map(([winningNumsStr, numsStr], index) => ({
      id: index + 1,
      winningNums: winningNumsStr
        .trim()
        .split(" ")
        .filter((x) => x !== "")
        .map((numStr) => numStr.trim())
        .map(Number),
      nums: numsStr
        .trim()
        .split(" ")
        .filter((x) => x !== "")
        .map((numStr) => numStr.trim())
        .map(Number),
    }));

  const idCountCache: {
    [key: number]: number;
  } = {};

  for (const card of scratchCards) {
    const id = card.id;
    const intersect = getIntersect(card.winningNums, card.nums);
    idCountCache[id] = (idCountCache[id] ?? 0) + 1;
    const idCount = idCountCache[id];
    for (let c = 0; c < idCount; c++) {
      for (let i = 1; i <= intersect.length; i++) {
        const nextId = id + i;
        idCountCache[nextId] = (idCountCache[nextId] ?? 0) + 1;
      }
    }
  }

  const sum = Object.entries(idCountCache).map(([, count]) => count).reduce(
    (a, b) => a + b,
    0,
  );

  return sum;
}

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve2(example);

  assertEquals(result, 30);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve2(input);

  console.log("Result:", result);
});
