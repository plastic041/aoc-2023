import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import invariant from "npm:tiny-invariant";

function solve1(input: string) {
  const lines = input.split("\n");
  const digitRegex = /\d/;
  const digitsOnly = lines.map((line) =>
    line
      .split("")
      .filter((char) => digitRegex.test(char))
      .join("")
  );
  const firstAndLastLines = digitsOnly.map((num) => `${num[0]}${num.at(-1)}`);
  const sum = firstAndLastLines
    .map(Number)
    .reduce((acc, curr) => acc + curr, 0);

  return sum;
}

const DIGIT_STRINGS = [
  { name: "one", value: 1 },
  { name: "two", value: 2 },
  { name: "three", value: 3 },
  { name: "four", value: 4 },
  { name: "five", value: 5 },
  { name: "six", value: 6 },
  { name: "seven", value: 7 },
  { name: "eight", value: 8 },
  { name: "nine", value: 9 },
];
function solve2(input: string) {
  const lines = input.split("\n");

  function getNums(line: string) {
    const digitRegex = /\d/;

    const nums = [];
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (digitRegex.test(char)) {
        nums.push(Number(char));
      } else {
        for (const digitString of DIGIT_STRINGS) {
          const substring = line.substring(i, i + digitString.name.length);
          if (substring === digitString.name) {
            nums.push(digitString.value);
          }
        }
      }
    }

    return nums;
  }

  const nums = lines.map(getNums);
  const firstAndLastNums = nums
    .map((lineNums) => `${lineNums[0]}${lineNums.at(-1)}`)
    .map(Number);

  const sum = firstAndLastNums.reduce((acc, curr) => acc + curr, 0);

  return sum;
}

const cwd = Deno.cwd();
const inputPath = await Deno.readTextFile(cwd + "/input.txt");
const result = solve2(inputPath);

console.log(result);

Deno.test("Test", async () => {
  const examplePath = cwd + "/example.txt";
  const example = await Deno.readTextFile(examplePath);

  const exampleResult = solve2(example);

  assertEquals(exampleResult, 281);
});
