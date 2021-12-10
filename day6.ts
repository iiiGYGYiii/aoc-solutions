// -------------- Day 6: Lanternfish ---------------

type parsedInput = number[];
type lanternfishArray = parsedInput;

const testInput = {
  input: `3,4,3,1,2`,
  partOneExpected: 5934,
  partTwoExpected: 26984457539,
};

function parseInput(input: string): parsedInput {
  return input.split(",").map((v) => parseInt(v));
}

function countConcurrency(value: number, input: parsedInput): number {
  return input.filter((num) => num === value).length;
}

function parseLanternFish(input: parsedInput): parsedInput {
  return Array(9)
    .fill(0)
    .map((_, i) => countConcurrency(i, input));
}

function sumAllFishes(input: parsedInput): number {
  return input.reduce((p, c) => p + c, 0);
}

function reproduceFishes(
  lanternFishes: lanternfishArray,
  time = 80
): lanternfishArray {
  const mutableArray = [...lanternFishes];
  for (let day = 1; day <= time; day++) {
    const zeroDay = mutableArray.shift();
    mutableArray.push(zeroDay);
    mutableArray[6] += zeroDay;
  }
  return mutableArray;
}

function partOne(input: string | parsedInput): number {
  if (typeof input === "string") input = parseInput(input);
  const lanternFishes = parseLanternFish(input);
  const fishesThroughTime = reproduceFishes(lanternFishes, 80);
  return sumAllFishes(fishesThroughTime);
}

function partTwo(input: string | parsedInput): number {
  if (typeof input === "string") input = parseInput(input);
  const lanternFishes = parseLanternFish(input);
  const fishesThroughTime = reproduceFishes(lanternFishes, 256);
  return sumAllFishes(fishesThroughTime);
}

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
