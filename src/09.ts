import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import invariant from "npm:tiny-invariant";

function getDiffs(nums: number[]) {
  const diffs = nums
    .map((n, i) => {
      if (i === 0) return n;
      return n - nums[i - 1];
    })
    .slice(1);

  return diffs;
}

function isAllZeroes(nums: number[]) {
  return nums.every((n) => n === 0);
}

function solve1(input: string) {
  const lines = input.split("\n");
  const nums = lines.map((line) => line.split(" ").map(Number));

  function getNextDiff(nums: number[]): number {
    if (isAllZeroes(nums)) {
      return 0;
    }
    const lastNum = nums.at(-1);
    invariant(lastNum !== undefined, "lastNum is undefined");
    const diffs = getDiffs(nums);
    const nextNum = lastNum + getNextDiff(diffs);

    return nextNum;
  }

  const lastNums = nums.map(getNextDiff);
  const sum = lastNums.reduce((acc, n) => acc + n, 0);

  return sum;
}

function solve2(input: string) {
  const lines = input.split("\n");
  const nums = lines.map((line) => line.split(" ").map(Number));

  function getPrevDiff(nums: number[]): number {
    if (isAllZeroes(nums)) {
      return 0;
    }
    const firstNum = nums.at(0);
    invariant(firstNum !== undefined, "lastNum is undefined");
    const diffs = getDiffs(nums);
    const prevNum = firstNum - getPrevDiff(diffs);

    return prevNum;
  }

  const prevNums = nums.map(getPrevDiff);
  const sum = prevNums.reduce((acc, n) => acc + n, 0);

  return sum;
}

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve2(example);

  assertEquals(result, 2);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve2(input);

  console.log("Result:", result);
});
