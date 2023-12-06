import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import invariant from "npm:tiny-invariant";

type ConvertMapLine = {
  destinationMin: number;
  sourceMin: number;
  range: number;
};

function map(
  num: number,
  { destinationMin, sourceMin, range }: ConvertMapLine,
) {
  const sourceMax = sourceMin + range;
  const destinationMax = destinationMin + range;

  const sourceRange = sourceMax - sourceMin;
  const destinationRange = destinationMax - destinationMin;

  const ratio = destinationRange / sourceRange;

  return (num - sourceMin) * ratio + destinationMin;
}

function convert(num: number, convertMap: ConvertMapLine[]) {
  for (const convertMapLine of convertMap) {
    const sourceMin = convertMapLine.sourceMin;
    const sourceMax = sourceMin + convertMapLine.range;

    if (num >= sourceMin && num <= sourceMax) {
      return map(num, convertMapLine);
    }
  }

  return num;
}

function solve1(input: string) {
  const lines = input.split("\n");
  const seeds = lines.shift()?.split(": ")[1].split(" ").map(Number);
  invariant(seeds);

  const convertMaps: ConvertMapLine[][] = [];
  lines
    .filter((line) => line.length > 0)
    .forEach((line) => {
      if (line.endsWith(":")) {
        convertMaps.push([]);
      } else {
        const nums = line.split(" ").map(Number);
        convertMaps.at(-1)?.push({
          destinationMin: nums[0],
          sourceMin: nums[1],
          range: nums[2],
        });
      }
    });

  const convertedSeeds = seeds
    .map((seed) =>
      convertMaps
        .reduce((acc, convertMap) => convert(acc, convertMap), seed)
    );

  return Math.min(...convertedSeeds);
}

function solve2(input: string) {
  const lines = input.split("\n");
  const seedsLine = lines.shift()?.split(": ")[1].split(" ").map(Number);
  invariant(seedsLine);

  const convertMaps: ConvertMapLine[][] = [];
  lines
    .filter((line) => line.length > 0)
    .forEach((line) => {
      if (line.endsWith(":")) {
        convertMaps.push([]);
      } else {
        const nums = line.split(" ").map(Number);
        convertMaps.at(-1)?.push({
          destinationMin: nums[0],
          sourceMin: nums[1],
          range: nums[2],
        });
      }
    });

  let debugCount = 0;
  let minResult = Infinity;
  for (let i = 0; i < seedsLine.length; i += 2) {
    const seedMin = seedsLine[i];
    const seedRange = seedsLine[i + 1];
    for (let j = seedMin; j < seedMin + seedRange; j++) {
      debugCount++;
      if (debugCount % 100000 === 0) {
        console.log("debugCount", debugCount);
      }
      const converted = convertMaps.reduce(
        (acc, convertMap) => convert(acc, convertMap),
        j,
      );
      minResult = Math.min(minResult, converted);
    }
  }

  return minResult;
}

Deno.test("map", () => {
  const mapped1 = map(79, {
    destinationMin: 52,
    sourceMin: 50,
    range: 48,
  });
  assertEquals(mapped1, 81);

  const mapped2 = map(55, {
    destinationMin: 52,
    sourceMin: 50,
    range: 48,
  });
  assertEquals(mapped2, 57);
});

Deno.test("convert", () => {
  const convertMaps: ConvertMapLine[] = [
    {
      destinationMin: 50,
      sourceMin: 98,
      range: 2,
    },
    {
      destinationMin: 52,
      sourceMin: 50,
      range: 48,
    },
  ];

  const converted = convert(79, convertMaps);
  assertEquals(converted, 81);
});

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve2(example);

  assertEquals(result, 46);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve2(input);

  console.log("Result:", result);
});
