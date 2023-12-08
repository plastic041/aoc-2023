import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import invariant from "npm:tiny-invariant";

type Direction = "R" | "L";
type Directions = Direction[];

type Node = {
  name: string;
  left: string;
  right: string;
  // left: Node;
  // right: Node;
};

type Nodes = Record<string, { left: string; right: string }>;

/**
 * @param {string} line "AAA = (BBB, CCC)"
 */
function parseLine(line: string) {
  const [name, children] = line.split(" = ");
  const [left, right] = children.slice(1, -1).split(", ");
  return { name, left, right };
}

function parse(input: string) {
  const lines = input.split("\n");
  const directions = lines.shift()!.split("") as Directions;
  lines.shift(); // skip empty line
  const nodes = lines.map(parseLine).reduce((acc, { name, left, right }) => {
    acc[name] = { left, right };
    return acc;
  }, {} as Nodes);

  return { directions, nodes };
}

function solve1(input: string) {
  const { directions, nodes } = parse(input);

  let count = 0;
  let index = 0;
  let currentNode = "AAA";
  while (currentNode !== "ZZZ") {
    count++;
    const moddedIndex = index % directions.length;
    const direction = directions[moddedIndex];
    const node = nodes[currentNode];
    currentNode = direction === "L" ? node.left : node.right;
    index++;
  }

  return count;
}

function solve2(input: string) {
  const { directions, nodes } = parse(input);

  function isEnded(nodes: string[]) {
    return nodes.every((key) => key.endsWith("Z"));
  }

  let count = 0;
  let index = 0;
  let currentNodes = Object.keys(nodes).filter((key) => key.endsWith("A"));
  while (!isEnded(currentNodes)) {
    check();
  }

  return count;

  function check() {
    count++;
    const moddedIndex = index % directions.length;
    const direction = directions[moddedIndex];

    const newCurrentNodes: string[] = [];

    for (const currentNode of currentNodes) {
      const node = nodes[currentNode];
      newCurrentNodes.push(direction === "L" ? node.left : node.right);
    }

    currentNodes = newCurrentNodes;

    if (count % 1000000 === 0) {
      console.log(count, currentNodes);
    }
    index++;
  }
}

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve2(example);

  assertEquals(result, 6);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve2(input);

  console.log("Result:", result);
});
