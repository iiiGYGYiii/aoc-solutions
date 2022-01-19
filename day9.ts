// -------------- Day 9: Smoke Basin ---------------

const { testAnswer } = require("./utils");

type Row = number[];
type Matrix = Row[];
type checkerFunction = (args: CheckArgs) => boolean;
interface MatrixSize {
  m: number;
  n: number;
}
interface Coordinate {
  x: number;
  y: number;
}
interface CheckArgs {
  coordinates: Coordinate;
  matrix: Matrix;
  matrixSize: MatrixSize;
}
const testInput = {
  input: `2199943210
3987894921
9856789892
8767896789
9899965678`,
  partOneExpected: 15,
  partTwoExpected: 1134,
};

function parseInput(input: string): Matrix {
  return input
    .split("\n")
    .map((row) => row.split("").map((num) => parseInt(num)));
}

function getSizeOfMatrix(input: Matrix): MatrixSize {
  return {
    m: input.length,
    n: input[0].length,
  };
}

function checkUp({ coordinates: { x, y }, matrix }: CheckArgs): boolean {
  return matrix[y][x] < matrix[y - 1][x];
}

function checkDown({ coordinates: { x, y }, matrix }: CheckArgs): boolean {
  return matrix[y][x] < matrix[y + 1][x];
}

function checkLeft({ coordinates: { x, y }, matrix }: CheckArgs): boolean {
  return matrix[y][x] < matrix[y][x - 1];
}

function checkRight({ coordinates: { x, y }, matrix }: CheckArgs): boolean {
  return matrix[y][x] < matrix[y][x + 1];
}

function mapZerosAndOnes(matrix: Matrix): Matrix {
  return matrix.map((row) => row.map((value) => (value < 9 ? 1 : 0)));
}

function isLower({
  coordinates: { x, y },
  matrix,
  matrixSize,
}: CheckArgs): boolean {
  const checkFunctions = [] as checkerFunction[];
  if (x !== 0) checkFunctions.push(checkLeft);
  if (x !== matrixSize.n - 1) checkFunctions.push(checkRight);
  if (y !== 0) checkFunctions.push(checkUp);
  if (y !== matrixSize.m - 1) checkFunctions.push(checkDown);
  return checkFunctions.reduce<boolean>(
    (lower, checkFunction) =>
      lower &&
      checkFunction({
        coordinates: { x, y },
        matrix,
        matrixSize,
      }),
    true
  );
}

function partOne(input: string | Matrix): number {
  if (typeof input === "string") input = parseInput(input);
  const { m, n } = getSizeOfMatrix(input);
  const lowers = [] as number[];
  for (let y = 0; y < m; y++)
    for (let x = 0; x < n; x++)
      if (
        isLower({
          coordinates: {
            x,
            y,
          },
          matrix: input,
          matrixSize: {
            m,
            n,
          },
        })
      )
        lowers.push(input[y][x]);

  return lowers.reduce<number>(
    (acc, currentLower) => acc + currentLower,
    lowers.length
  );
}

function callBFS(
  getMatrix: () => Matrix,
  updateMatrix: (value: number, i: number, j: number) => void,
  i: number,
  j: number,
  addCounter: () => void
): void {
  if (
    i < 0 ||
    i >= getMatrix().length ||
    j < 0 ||
    j >= getMatrix()[0].length ||
    getMatrix()[i][j] === 0
  )
    return;
  updateMatrix(0, i, j);
  addCounter();
  callBFS(getMatrix, updateMatrix, i + 1, j, addCounter);
  callBFS(getMatrix, updateMatrix, i - 1, j, addCounter);
  callBFS(getMatrix, updateMatrix, i, j - 1, addCounter);
  callBFS(getMatrix, updateMatrix, i, j + 1, addCounter);
}

function partTwo(input: string | Matrix): number {
  if (typeof input === "string") input = parseInput(input);
  const { m, n } = getSizeOfMatrix(input);
  input = mapZerosAndOnes(input);
  const { getMatrix, updateMatrix } = (function () {
    let newMatrix = Array(m)
      .fill(0)
      .map((v, i) => [...input[i]]) as Matrix;
    function getMatrix() {
      return newMatrix;
    }
    function updateMatrix(value: number, i: number, j: number) {
      newMatrix[i][j] = value;
    }
    return {
      getMatrix,
      updateMatrix,
    };
  })();
  const { resetCounter, addCounter, getCounter } = (function () {
    let counter = 0;
    function getCounter() {
      return counter;
    }
    function addCounter() {
      counter++;
    }
    function resetCounter() {
      counter = 0;
    }
    return {
      resetCounter,
      addCounter,
      getCounter,
    };
  })();
  let count = 0;
  const islands = [] as number[];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (getMatrix()[i][j] === 1) {
        count++;
        callBFS(getMatrix, updateMatrix, i, j, addCounter);
        islands.push(getCounter());
        resetCounter();
      }
    }
  }
  islands.sort((a, b) => a - b);
  return islands.pop() * islands.pop() * islands.pop();
}

testAnswer(testInput.input, partOne, testInput.partOneExpected);

testAnswer(testInput.input, partTwo, testInput.partTwoExpected);
