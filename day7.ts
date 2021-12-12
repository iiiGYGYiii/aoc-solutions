// -------------- Day 7: The Treachery of Whales ---------------

interface WantedSingleInput {
  position: number;
  concurrences: number;
}

type WantedInput = WantedSingleInput[];

const testInput = {
  input: "16,1,2,0,4,2,7,1,2,14",
  partOneExpected: 37,
  partTwoExpected: 168,
};

function countConcurrences(value: number, array: number[]): number {
  return array.filter((v) => v === value).length;
}

function countFuelFromPivot(pivot: number, array: WantedInput): number {
  let fuel = 0;
  for (let position of array) {
    fuel += Math.abs(pivot - position.position) * position.concurrences;
  }
  return fuel;
}

function sumFromAtoB(a: number, b: number): number {
  const delta = Math.abs(a - b);
  const r = (delta * (delta + 1)) / 2;
  return r;
}

function countIncrementalFuel(pivot: number, array: WantedInput): number {
  let fuel = 0;
  for (let position of array) {
    fuel += sumFromAtoB(pivot, position.position) * position.concurrences;
  }
  return fuel;
}

function fillInterestArea({
  pivotPosition,
  nextPosition,
  prevPosition,
}: {
  pivotPosition: number;
  nextPosition: number;
  prevPosition: number;
}): WantedInput {
  const wtf: WantedInput = Array<number>(nextPosition)
    .fill(0)
    .map((_, i) => i)
    .filter(
      (_, i) => i > prevPosition && i !== nextPosition && i !== pivotPosition
    )
    .map<WantedSingleInput>((value) => ({
      position: value,
      concurrences: 0,
    }));
  return wtf;
}

function parseInput(input: string): WantedInput {
  const arrayInput = input.split(",").map((value) => parseInt(value));
  const arrayUniqueValues = Array.from(new Set(arrayInput));
  const requiredInput: WantedInput = arrayUniqueValues.map<WantedSingleInput>(
    (value) => ({
      position: value,
      concurrences: countConcurrences(value, arrayInput),
    })
  );
  return requiredInput.sort((a, b) => a.position - b.position);
}

function partOne(input: string | WantedInput): number {
  if (typeof input === "string") input = parseInput(input);
  return Math.min(
    ...input.map((value, _, array) => countFuelFromPivot(value.position, array))
  );
}

function partTwo(input: string | WantedInput): number {
  if (typeof input === "string") input = parseInput(input);
  const overallFuelCounts = input.map((value, _, array) =>
    countIncrementalFuel(value.position, array)
  );
  const overallMinimunFuel = Math.min(
    ...input.map((value, _, array) =>
      countIncrementalFuel(value.position, array)
    )
  );
  const overallMinimunFuelIndex = overallFuelCounts.indexOf(overallMinimunFuel);
  const overallMinimunFuelPosition = input[overallMinimunFuelIndex].position;
  const interestMinimunArea: WantedInput = fillInterestArea({
    pivotPosition: overallMinimunFuelPosition,
    nextPosition: input[overallMinimunFuelIndex + 1].position,
    prevPosition: input[overallMinimunFuelIndex - 1].position,
  });
  input = input.concat(interestMinimunArea);
  return Math.min(
    ...input.map((value, _, array) =>
      countIncrementalFuel(value.position, array)
    )
  );
}

const partOneAnswer = partOne(testInput.input);
console.assert(
  partOneAnswer === testInput.partOneExpected,
  `Expected ${testInput.partOneExpected}, got ${partOneAnswer} instead`
);

const partTwoAnswer = partTwo(testInput.input);
console.assert(
  partTwoAnswer === testInput.partTwoExpected,
  `Expected ${testInput.partTwoExpected}, got ${partTwoAnswer} instead`
);
