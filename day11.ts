// -------------- Day 11: Dumbo Octopus ---------------

const { testAnswer } = require("./utils");

const testInput = {
  input: `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`,
  partOneExpected: 1656,
  partTwoExpected: 195,
};

type Row = number[];
type Matrix = Row[];
interface Coordinates {
  x: number;
  y: number;
}

const [GET_GLOWED_COUNTER, ADD_ONE_GLOWED_COUNTER] = (function () {
  let count = 0;
  function getCounter() {
    return count;
  }
  function increaseCounter() {
    count++;
  }
  return [getCounter, increaseCounter];
})();

function parseInput(input: string): Matrix {
  return input
    .split("\n")
    .map<Row>((row) => row.split("").map<number>((value) => parseInt(value)));
}

function obtainMatrixSize(matrix: Matrix): [number, number] {
  return [matrix.length, matrix[0].length];
}

function makeOneStep(octopusMatrix: Matrix): Matrix {
  return octopusMatrix.map<Row>((row) => row.map<number>((value) => value + 1));
}

function makeOneStepLocal(
  octopusMatrix: Matrix,
  { x, y }: Coordinates
): Matrix {
  let [M, N] = obtainMatrixSize(octopusMatrix);
  [M, N] = [M - 1, N - 1];
  if (0 < x && x < N && 0 < y && y < M) {
    octopusMatrix[y - 1][x - 1]++;
    octopusMatrix[y - 1][x]++;
    octopusMatrix[y - 1][x + 1]++;
    octopusMatrix[y][x - 1]++;
    octopusMatrix[y][x + 1]++;
    octopusMatrix[y + 1][x - 1]++;
    octopusMatrix[y + 1][x]++;
    octopusMatrix[y + 1][x + 1]++;
    return octopusMatrix;
  }
  if (x === 0) {
    octopusMatrix[y][x + 1]++;
    if (0 < y && y < M) {
      octopusMatrix[y - 1][x]++;
      octopusMatrix[y + 1][x]++;
      octopusMatrix[y - 1][x + 1]++;
      octopusMatrix[y + 1][x + 1]++;
    }
    if (y === 0) {
      octopusMatrix[y + 1][x]++;
      octopusMatrix[y + 1][x + 1]++;
    }
    if (y === M) {
      octopusMatrix[y - 1][x]++;
      octopusMatrix[y - 1][x + 1]++;
    }
  }
  if (x === N) {
    octopusMatrix[y][x - 1]++;
    if (0 < y && y < M) {
      octopusMatrix[y - 1][x - 1]++;
      octopusMatrix[y - 1][x]++;
      octopusMatrix[y + 1][x - 1]++;
      octopusMatrix[y + 1][x]++;
    }
    if (y === 0) {
      octopusMatrix[y + 1][x - 1]++;
      octopusMatrix[y + 1][x]++;
    }
    if (y === M) {
      octopusMatrix[y - 1][x - 1]++;
      octopusMatrix[y - 1][x]++;
    }
  }
  if (0 < x && x < N) {
    octopusMatrix[y][x - 1]++;
    octopusMatrix[y][x + 1]++;
    if (y === 0) {
      octopusMatrix[y + 1][x - 1]++;
      octopusMatrix[y + 1][x]++;
      octopusMatrix[y + 1][x + 1]++;
    }
    if (y === M) {
      octopusMatrix[y - 1][x - 1]++;
      octopusMatrix[y - 1][x]++;
      octopusMatrix[y - 1][x + 1]++;
    }
  }
  return octopusMatrix;
}

function resetGlowed(octopusMatrix: Matrix): Matrix {
  return octopusMatrix.map<Row>((row) =>
    row.map<number>((value) => (value < 0 ? 0 : value))
  );
}

function checkIfSomeoneGlowed(octopusMatrix: Matrix): Coordinates[] {
  const whoGlowed = [] as Coordinates[];
  const [M, N] = obtainMatrixSize(octopusMatrix);
  for (let y = 0; y < M; y++) {
    for (let x = 0; x < N; x++) {
      if (octopusMatrix[y][x] >= 10) {
        whoGlowed.push({ x, y });
        ADD_ONE_GLOWED_COUNTER();
        octopusMatrix[y][x] = -99;
      }
    }
  }
  return whoGlowed;
}

function makeItGlow(octopusMatrix: Matrix, whoGlowed: Coordinates[]): Matrix {
  while (whoGlowed.length) {
    for (let coordinate of whoGlowed) {
      octopusMatrix = makeOneStepLocal(octopusMatrix, coordinate);
    }
    whoGlowed = checkIfSomeoneGlowed(octopusMatrix);
  }
  return octopusMatrix;
}

function matrixAfterNSteps(octopusMatrix: Matrix, steps: number): Matrix {
  for (let i = 0; i < steps; i++) {
    octopusMatrix = makeOneStep(octopusMatrix);
    octopusMatrix = resetGlowed(
      makeItGlow(octopusMatrix, checkIfSomeoneGlowed(octopusMatrix))
    );
  }
  return octopusMatrix;
}

function partOne(input: string | Matrix): number {
  if (typeof input === "string") input = parseInput(input);
  input = matrixAfterNSteps(input, 100);
  return GET_GLOWED_COUNTER();
}

function partTwo(input: string | Matrix): number {
  if (typeof input === "string") input = parseInput(input);
  let steps = 0;
  let inputToString = input.map<string>((row) => row.join("")).join("");
  const targetString =
    "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
  while (inputToString !== targetString) {
    input = makeOneStep(input);
    input = resetGlowed(makeItGlow(input, checkIfSomeoneGlowed(input)));
    inputToString = input.map<string>((row) => row.join("")).join("");
  }
  return steps;
}

testAnswer(testInput.input, partOne, testInput.partOneExpected);
testAnswer(testInput.input, partTwo, testInput.partTwoExpected);
