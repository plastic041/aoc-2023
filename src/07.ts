import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import invariant from "npm:tiny-invariant";

const CARDS_1: Record<string, number> = {
  "A": 14,
  "K": 13,
  "Q": 12,
  "J": 11,
  "T": 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
};

const CARDS_WITH_JOKER: Record<string, number> = {
  "A": 14,
  "K": 13,
  "Q": 12,
  "T": 11,
  "9": 10,
  "8": 9,
  "7": 8,
  "6": 7,
  "5": 6,
  "4": 5,
  "3": 4,
  "2": 3,
  "J": 2,
};

type Rank =
  | "FIVE_OF_A_KIND"
  | "FOUR_OF_A_KIND"
  | "FULL_HOUSE"
  | "THREE_OF_A_KIND"
  | "TWO_PAIRS"
  | "ONE_PAIR"
  | "HIGH_CARD";

const RANK_SCORES: Record<Rank, number> = {
  "FIVE_OF_A_KIND": 8,
  "FOUR_OF_A_KIND": 7,
  "FULL_HOUSE": 6,
  "THREE_OF_A_KIND": 5,
  "TWO_PAIRS": 4,
  "ONE_PAIR": 3,
  "HIGH_CARD": 2,
};

class Hand {
  powers = new Array<number>();
  cards = new Array<string>();

  constructor(hand: string, withJoker: boolean = false) {
    const cards = hand.split("");
    invariant(cards.length === 5);

    this.cards = cards;
    if (withJoker) {
      this.powers = cards.map((card) => CARDS_WITH_JOKER[card]);
    } else {
      this.powers = cards.map((card) => CARDS_1[card]);
    }
  }

  get getRankScore(): number {
    const rank = Hand.getRank(this);

    return RANK_SCORES[rank];
  }

  get getRankScoreWithJoker(): number {
    const rank = Hand.getRankWithJoker(this);

    return RANK_SCORES[rank];
  }

  static getRank(hand: Hand): Rank {
    const deduplicated = [...new Set(hand.powers)];
    const counts = deduplicated
      .map((power) => hand.powers.filter((p) => p === power).length);

    if (deduplicated.length === 1) {
      return "FIVE_OF_A_KIND";
    }

    if (deduplicated.length === 2) {
      if (counts.includes(4)) {
        return "FOUR_OF_A_KIND";
      }

      return "FULL_HOUSE";
    }

    if (deduplicated.length === 3) {
      if (counts.includes(3)) {
        return "THREE_OF_A_KIND";
      }

      return "TWO_PAIRS";
    }

    if (deduplicated.length === 4) {
      return "ONE_PAIR";
    }

    return "HIGH_CARD";
  }

  static getRankWithJoker(hand: Hand): Rank {
    const deduplicated = [...new Set(hand.cards)];
    const counts: Record<string, number> = {};
    for (let i = 0; i < deduplicated.length; i++) {
      const card = deduplicated[i];
      const count = hand.cards.filter((c) => c === card).length;

      counts[card] = count;
    }

    counts["J"] = 0;

    const mostFrequentCard = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)[0][0];

    const cardsWithJoker = hand.cards.map((card) =>
      card === "J" ? mostFrequentCard : card
    );

    const deduplicatedWithJoker = [...new Set(cardsWithJoker)];
    const countsWithJoker = deduplicatedWithJoker
      .map((card) => cardsWithJoker.filter((c) => c === card).length);

    if (deduplicatedWithJoker.length === 1) {
      return "FIVE_OF_A_KIND";
    }

    if (deduplicatedWithJoker.length === 2) {
      if (countsWithJoker.includes(4)) {
        return "FOUR_OF_A_KIND";
      }

      return "FULL_HOUSE";
    }

    if (deduplicatedWithJoker.length === 3) {
      if (countsWithJoker.includes(3)) {
        return "THREE_OF_A_KIND";
      }

      return "TWO_PAIRS";
    }

    if (deduplicatedWithJoker.length === 4) {
      return "ONE_PAIR";
    }

    return "HIGH_CARD";
  }

  static compareSameRank(a: Hand, b: Hand): number {
    for (let i = 0; i < a.powers.length; i++) {
      if (a.powers[i] > b.powers[i]) {
        return 1;
      }

      if (a.powers[i] < b.powers[i]) {
        return -1;
      }
    }

    throw new Error("Should not happen");
  }

  static compare(a: Hand, b: Hand): number {
    if (a.getRankScore > b.getRankScore) {
      return 1;
    }

    if (a.getRankScore < b.getRankScore) {
      return -1;
    }

    if (a.getRankScore === b.getRankScore) {
      return Hand.compareSameRank(a, b);
    }

    throw new Error("Should not happen 2");
  }

  static compareWithJoker(a: Hand, b: Hand): number {
    if (
      a.getRankScoreWithJoker >
        b.getRankScoreWithJoker
    ) {
      return 1;
    }

    if (
      a.getRankScoreWithJoker <
        b.getRankScoreWithJoker
    ) {
      return -1;
    }

    if (a.getRankScoreWithJoker === b.getRankScoreWithJoker) {
      return Hand.compareSameRank(a, b);
    }

    throw new Error("Should not happen 2");
  }
}

function parse(input: string, withJoker = false) {
  const users = input
    .split("\n")
    .map((line) => line.split(" "))
    .map(([hand, bid]) => ({
      hand: new Hand(hand, withJoker),
      bid: Number(bid),
    }));

  return users;
}

function solve1(input: string) {
  const users = parse(input);

  const sortedUsers = users
    .sort((a, b) => Hand.compareWithJoker(a.hand, b.hand));

  const bids = sortedUsers.map((user) => user.bid);

  let sum = 0;
  for (let i = 0; i < bids.length; i++) {
    const rank = i + 1;
    const bid = bids[i];
    const score = rank * bid;

    sum += score;
  }

  return sum;
}

function solve2(input: string) {
  const users = parse(input, true);

  const sortedUsers = users
    .sort((a, b) => Hand.compareWithJoker(a.hand, b.hand));

  const bids = sortedUsers.map((user) => user.bid);

  let sum = 0;
  for (let i = 0; i < bids.length; i++) {
    const rank = i + 1;
    const bid = bids[i];
    const score = rank * bid;

    sum += score;
  }

  return sum;
}

Deno.test("Test", async () => {
  const cwd = Deno.cwd();
  const example = await Deno.readTextFile(cwd + "/example.txt");

  const result = solve2(example);

  assertEquals(result, 6839);
});

Deno.test("Solve", async () => {
  const cwd = Deno.cwd();
  const input = await Deno.readTextFile(cwd + "/input.txt");

  const result = solve2(input);

  console.log("Result:", result);
});
