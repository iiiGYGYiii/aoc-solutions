// -------------- Day 5: Hydrothermal Venture ---------------

const { checkPerformance } = require("./utils");

const testInput = {
  input: `0,9 -> 5,9
  8,0 -> 0,8
  9,4 -> 3,4
  2,2 -> 2,1
  7,0 -> 7,4
  6,4 -> 2,0
  0,9 -> 2,9
  3,4 -> 1,4
  0,0 -> 8,8
  5,5 -> 8,2`,
  partOneExpected: 5,
  partTwoExpected: 12,
};

function parseInput(input) {
  input = input.split("\n").map((line) => {
    const idc = line
      .trim()
      .split(" -> ")
      .map((coordinate) => {
        const idk = coordinate.split(",").map((value) => {
          return parseInt(value);
        });
        return {
          x: idk[0],
          y: idk[1],
        };
      });
    return {
      a: idc[0],
      b: idc[1],
    };
  });
  return input;
}

function isVertical(line) {
  return line.a.x === line.b.x;
}

function isHorizontal(line) {
  return line.a.y === line.b.y;
}

function isVerticalOrHorizontal(line) {
  return isVertical(line) || isHorizontal(line);
}

function isDiagonalAcceptable(line) {
  return Math.abs(line.a.x - line.b.x) === Math.abs(line.a.y - line.b.y);
}

function fillHorizontalMatrix(line, matrix) {
  const [start, end] =
    line.a.x > line.b.x ? [line.b.x, line.a.x] : [line.a.x, line.b.x];
  const standardY = line.a.y;
  for (let x = start; x <= end; x++) {
    matrix[standardY][x] = matrix[standardY][x] + 1;
  }
  return matrix;
}

function fillVerticalMatrix(line, matrix) {
  const [start, end] =
    line.a.y > line.b.y ? [line.b.y, line.a.y] : [line.a.y, line.b.y];
  const standardX = line.a.x;
  for (let y = start; y <= end; y++) {
    matrix[y][standardX] = matrix[y][standardX] + 1;
  }
  return matrix;
}

function fillDiagonalMatrix(line, matrix) {
  const pivote = line.a;
  const direction = line.b;
  const xIncreasing = pivote.x < direction.x ? 1 : -1;
  const yIncreasing = pivote.y < direction.y ? 1 : -1;
  for (
    let x = pivote.x, y = pivote.y;
    pivote.x < direction.x ? x <= direction.x : x >= direction.x,
      pivote.y < direction.y ? y <= direction.y : y >= direction.y;
    x += xIncreasing, y += yIncreasing
  ) {
    matrix[y][x] += 1;
  }
  return matrix;
}

function countGreaterThanTwo(matrix) {
  return matrix.flat().filter((v) => v > 1).length;
}

function getGreatestCoordinates(input) {
  return input.reduce(
    (previousMax, currentLine) => [
      Math.max(previousMax[0], currentLine.a.x + 1, currentLine.b.x + 1),
      Math.max(previousMax[1], currentLine.a.y + 1, currentLine.b.y + 1),
    ],
    [0, 0]
  );
}

function partOne(input) {
  input = parseInput(input).filter(isVerticalOrHorizontal);
  const [gX, gY] = getGreatestCoordinates(input);
  let experimentalMatrix = Array(gY)
    .fill()
    .map((_) => Array(gX).fill(0));
  for (let line of input.filter(isVertical)) {
    experimentalMatrix = fillVerticalMatrix(line, experimentalMatrix);
  }
  for (let line of input.filter(isHorizontal)) {
    experimentalMatrix = fillHorizontalMatrix(line, experimentalMatrix);
  }
  return countGreaterThanTwo(experimentalMatrix);
}

function partTwo(input) {
  input = parseInput(input);
  const [gX, gY] = getGreatestCoordinates(input);
  let experimentalMatrix = Array(gY)
    .fill()
    .map((_) => Array(gX).fill(0));
  for (let line of input.filter(isVertical)) {
    experimentalMatrix = fillVerticalMatrix(line, experimentalMatrix);
  }
  for (let line of input.filter(isHorizontal)) {
    experimentalMatrix = fillHorizontalMatrix(line, experimentalMatrix);
  }
  for (let line of input.filter(isDiagonalAcceptable)) {
    experimentalMatrix = fillDiagonalMatrix(line, experimentalMatrix);
  }
  return countGreaterThanTwo(experimentalMatrix);
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
