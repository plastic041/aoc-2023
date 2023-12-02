import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import invariant from "npm:tiny-invariant";

// 12 red cubes, 13 green cubes, and 14 blue cubes
const SOLVE1_CUBES: {
  [key: string]: number;
} = {
  red: 12,
  green: 13,
  blue: 14,
};

const SUM_CUBES = 39;

type Cube = {
  count: number;
  color: "red" | "green" | "blue";
};

type Game = {
  id: number;
  cubes: Cube[][];
};

function solve1(input: string) {
  const lines = input.split("\n");
  const games: Game[] = lines.map((line) => ({
    id: Number(line.split(": ")[0].split(" ")[1]),
    cubes: line
      .split(": ")[1]
      .split("; ")
      .map((game) =>
        game
          .split(", ")
          .map((countCube) => countCube.split(" "))
          .map(([count, color]) => ({
            count: Number(count),
            color: color as "red" | "green" | "blue",
          }))
      ),
  }));

  function isValidGame(game: Game) {
    for (const cubes of game.cubes) {
      const sum = cubes.reduce((acc, curr) => acc + curr.count, 0);
      if (sum > SUM_CUBES) {
        return false;
      }

      for (const cube of cubes) {
        if (cube.count > SOLVE1_CUBES[cube.color]) {
          return false;
        }
      }
    }

    return true;
  }

  const validGames = games.filter(isValidGame);
  const validGamesIds = validGames.map((game) => game.id);
  const validGamesIdsSum = validGamesIds.reduce((acc, curr) => acc + curr, 0);

  return validGamesIdsSum;
}

function solve2(input: string) {
  const games: Game[] = input
    .split("\n")
    .map((line) => ({
      id: Number(line.split(": ")[0].split(" ")[1]),
      cubes: line
        .split(": ")[1]
        .split("; ")
        .map((game) =>
          game
            .split(", ")
            .map((countCube) => countCube.split(" "))
            .map(([count, color]) => ({
              count: Number(count),
              color: color as "red" | "green" | "blue",
            }))
        ),
    }));

  function newGameCubesCount() {
    return {
      red: 0,
      green: 0,
      blue: 0,
    };
  }

  function getCubesCount(game: Game) {
    const cubesCount = newGameCubesCount();

    for (const cubes of game.cubes) {
      for (const cube of cubes) {
        cubesCount[cube.color] = Math.max(cube.count, cubesCount[cube.color]);
      }
    }

    return cubesCount;
  }

  const cubesCounts = games.map(getCubesCount);
  const cubesCountsProduct = cubesCounts.map((cubesCount) =>
    cubesCount.red * cubesCount.green * cubesCount.blue
  );

  return cubesCountsProduct.reduce((acc, curr) => acc + curr, 0);
}

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve2(example);

  assertEquals(result, 2286);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve2(input);

  console.log("Result:", result);
});
