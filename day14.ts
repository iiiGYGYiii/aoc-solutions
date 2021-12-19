// -------------- Day 14: Extended Polymerization ---------------

const { testAnswer } = require("./utils");

const testInput = {
  input: `NNCB

  CH -> B
  HH -> N
  CB -> H
  NH -> C
  HB -> C
  HC -> B
  HN -> C
  NN -> C
  BH -> H
  NC -> B
  NB -> B
  BN -> B
  BB -> N
  BC -> B
  CC -> N
  CN -> C`,
  partOneExpected: 1588,
  partTwoExpected: 2188189693529n,
};

interface ParsedInput {
  polymerTemplate: string;
  pairInsertions: any;
}

function parseInput(input: string): ParsedInput {
  const newInput = input.split("\n").map((v) => v.trim());
  const polymerTemplate = newInput[0];
  const pairInsertions: any = newInput
    .slice(2)
    .map<string[]>((str) => str.split(" -> "))
    .reduce((p, c) => ({ ...p, [c[0]]: c[1] }), {});
  return {
    polymerTemplate,
    pairInsertions,
  };
}

function getPairs(template: string): any {
  const pairs = [];
  for (let i = 0; i < template.length - 1; i++) {
    const pair = `${template[i]}${template[i + 1]}`;
    pairs.push(pair);
  }
  return pairs.reduce(
    (p, c) => ({
      ...p,
      [c]: p[c] ? p[c] + 1 : 1,
    }),
    {}
  );
}

function insertPair(pairs: any, pairInsertions: any): any {
  let newPairs = [];
  for (let [polymerPair, times] of Object.entries(pairs) as [any, number]) {
    const insertion = pairInsertions[polymerPair];
    const firstPair = `${polymerPair[0]}${insertion}`;
    const secondPair = `${insertion}${polymerPair[1]}`;
    newPairs[firstPair] = newPairs[firstPair]
      ? newPairs[firstPair] + times
      : times;
    newPairs[secondPair] = newPairs[secondPair]
      ? newPairs[secondPair] + times
      : times;
  }
  return newPairs;
}

function countConcurrences(pairs: any, lastElement: string): any {
  const allChars = Array.from(
    new Set(Object.keys(pairs).join("").split(""))
  ).reduce((p, c) => ({ ...p, [c]: 0 }), {});
  for (let [pair, times] of Object.entries(pairs) as [any, number]) {
    const letters = pair.split("");
    allChars[letters[0]] += times;
  }
  allChars[lastElement] += 1;
  return allChars;
}

function getMaxFromConcurrences(concurrences: any): number {
  return Object.values<number>(concurrences)
    .sort((a, b) => a - b)
    .pop();
}

function getMinFromConcurrences(concurrences: any): number {
  return Object.values<number>(concurrences)
    .sort((a, b) => a - b)
    .shift();
}

function getDeltaFromConcurrences(concurrences: any): number {
  return (
    getMaxFromConcurrences(concurrences) - getMinFromConcurrences(concurrences)
  );
}

function insertPairsNSteps(
  pairs: any,
  pairInsertions: any,
  steps: number
): any {
  for (let i = 0; i < steps; i++) {
    pairs = insertPair(pairs, pairInsertions);
  }
  return pairs;
}

function partOne(input: string | ParsedInput): number {
  if (typeof input === "string") input = parseInput(input);
  const { pairInsertions, polymerTemplate } = input;
  let pairs = getPairs(polymerTemplate);
  pairs = insertPairsNSteps(pairs, pairInsertions, 10);
  const concurrences = countConcurrences(
    pairs,
    polymerTemplate[polymerTemplate.length - 1]
  );
  return getDeltaFromConcurrences(concurrences);
}

function partTwo(input: string | ParsedInput): bigint {
  if (typeof input === "string") input = parseInput(input);
  const { pairInsertions, polymerTemplate } = input;
  let pairs = getPairs(polymerTemplate);
  pairs = insertPairsNSteps(pairs, pairInsertions, 40);
  const concurrences = countConcurrences(
    pairs,
    polymerTemplate[polymerTemplate.length - 1]
  );
  return BigInt(getDeltaFromConcurrences(concurrences));
}

testAnswer(testInput.input, partOne, testInput.partOneExpected);
testAnswer(testInput.input, partTwo, testInput.partTwoExpected);
