// -------------- Day 6: Lanternfish ---------------

type parsedInput = number[];
type lanternfishArray = parsedInput;

const input =
  "5,1,4,1,5,1,1,5,4,4,4,4,5,1,2,2,1,3,4,1,1,5,1,5,2,2,2,2,1,4,2,4,3,3,3,3,1,1,1,4,3,4,3,1,2,1,5,1,1,4,3,3,1,5,3,4,1,1,3,5,2,4,1,5,3,3,5,4,2,2,3,2,1,1,4,1,2,4,4,2,1,4,3,3,4,4,5,3,4,5,1,1,3,2,5,1,5,1,1,5,2,1,1,4,3,2,5,2,1,1,4,1,5,5,3,4,1,5,4,5,3,1,1,1,4,5,3,1,1,1,5,3,3,5,1,4,1,1,3,2,4,1,3,1,4,5,5,1,4,4,4,2,2,5,5,5,5,5,1,2,3,1,1,2,2,2,2,4,4,1,5,4,5,2,1,2,5,4,4,3,2,1,5,1,4,5,1,4,3,4,1,3,1,5,5,3,1,1,5,1,1,1,2,1,2,2,1,4,3,2,4,4,4,3,1,1,1,5,5,5,3,2,5,2,1,1,5,4,1,2,1,1,1,1,1,2,1,1,4,2,1,3,4,2,3,1,2,2,3,3,4,3,5,4,1,3,1,1,1,2,5,2,4,5,2,3,3,2,1,2,1,1,2,5,3,1,5,2,2,5,1,3,3,2,5,1,3,1,1,3,1,1,2,2,2,3,1,1,4,2";

const testInput = {
  input: `3,4,3,1,2`,
  partOneExpected: 5934,
  partTwoExpected: 26984457539,
};

function parseInput(input: string): parsedInput {
  return input.split(",").map((v) => parseInt(v));
}

function oneDayLess(lanternsFish: lanternfishArray): lanternfishArray {
  return lanternsFish.map((fish) => fish - 1);
}

function checkNewBorn(lanternsFish: lanternfishArray): lanternfishArray {
  if (lanternsFish.some((fish) => fish < 0)) {
    for (let _ of lanternsFish.filter((fish) => fish < 0)) {
      lanternsFish = lanternsFish.concat(8);
      lanternsFish = lanternsFish.map((fish) => (fish < 0 ? 6 : fish));
    }
  }
  return lanternsFish;
}

function countConcurrences(value: number, array: number[]): number {
  return array.filter((num) => num === value).length;
}

function estimateFishesCreated(lanternfishDays: number, days = 80): number {
  let lanternsFish: lanternfishArray = [lanternfishDays];
  for (let i = 0; i < days; i++) {
    lanternsFish = checkNewBorn(oneDayLess(lanternsFish));
  }
  return lanternsFish.length;
}

function tabulateFishesBorn(days = 80): number[] {
  return Array(8)
    .fill(0)
    .map((v, i) => estimateFishesCreated(i, days));
}

function partOne(input: string | parsedInput): number {
  if (typeof input === "string") input = parseInput(input);
  const uniqueValues = new Set<number>(input);
  const tableOfFishes = tabulateFishesBorn();
  let totalSum = 0;
  for (let v of Array.from(uniqueValues)) {
    totalSum += tableOfFishes[v] * countConcurrences(v, input);
  }
  return totalSum;
}

function partTwo(input: string | parsedInput): number {
  if (typeof input === "string") input = parseInput(input);
  const uniqueValues = new Set<number>(input);
  const tableOfFishes = tabulateFishesBorn(256);
  let totalSum = 0;
  for (let v of Array.from(uniqueValues)) {
    totalSum += tableOfFishes[v] * countConcurrences(v, input);
  }
  return totalSum;
}

// console.log(partTwo(input));

const partOneAnswer = partOne(testInput.input);
console.assert(
  partOneAnswer === testInput.partOneExpected,
  `Expected ${testInput.partOneExpected}, got ${partOneAnswer} instead`
);

const partTwoAnswer = partTwo(testInput.input);
console.assert(
  partTwoAnswer === testInput.partTwoExpected,
  `Expected ${testInput.partTwoExpected} got ${partTwoAnswer} instead`
);

console.log("XD");
