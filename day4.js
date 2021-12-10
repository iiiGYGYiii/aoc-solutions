// -------------- Day 4: Giant Squid ---------------

const { checkPerformance } = require("./utils");

const testInput = {
  input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
8  2 23  4 24
21  9 14 16  7
6 10  3 18  5
1 12 20 15 19

3 15  0  2 22
9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
2  0 12  3  7`,
  firstPartExpected: 4512,
  secondPartExpected: 1924,
};

const SOLUTIONS = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
];

function parseInput(input) {
  input = input.split("\n").filter((v) => v !== "");
  let instructions,
    boards = [];
  [instructions, ...input] = input;
  instructions = instructions.split(",").map((v) => parseInt(v));
  for (let i = 0; i < input.length; i += 5) {
    const newInput = [];
    for (let j = 0; j < 5; j++) {
      newInput[j] = input[i + j];
    }
    boards.push(newInput);
  }
  boards = boards.map((board) =>
    board
      .join(" ")
      .split(" ")
      .filter((v) => v !== "")
      .map((v) => parseInt(v))
  );
  return {
    instructions,
    boards,
  };
}

function checkForSolution(arrayOfIndexes) {
  for (let solution of SOLUTIONS) {
    if (solution.every((v) => arrayOfIndexes.includes(v))) return solution;
  }
  return false;
}

function partOne(input) {
  const { instructions, boards } = parseInput(input);
  let arrayOfIndexes = Array(boards.length)
    .fill()
    .map((v) => Array(1));
  let solution, boardWinner, lastNumberCalled;
  let i = 1;
  for (let instruction of instructions) {
    arrayOfIndexes = arrayOfIndexes.map((v, i) => {
      if (boards[i].includes(instruction))
        v.push(boards[i].indexOf(instruction));
      return v;
    });
    if (i <= 5) {
      i++;
      continue;
    }
    solution = arrayOfIndexes.some(checkForSolution);
    if (solution) {
      solution = arrayOfIndexes.map(checkForSolution).filter((v, indx) => {
        if (v !== false) {
          boardWinner = boards[indx];
          return v !== false;
        }
      })[0];
      lastNumberCalled = instruction;
      break;
    }
  }
  let inst = instructions.slice(0, instructions.indexOf(lastNumberCalled) + 1);
  boardWinner = boardWinner.filter((v) => !inst.includes(v));
  const result = boardWinner.reduce((p, c) => p + c, 0) * lastNumberCalled;
  return result;
}

function partTwo(input) {
  const { instructions, boards } = parseInput(input);
  let arrayOfIndexes = Array(boards.length)
    .fill()
    .map((v) => Array(1));
  let solution, boardWinner, lastNumberCalled, lastBoardStates;

  let i = 1;
  for (let instruction of instructions) {
    arrayOfIndexes = arrayOfIndexes.map((v, i) => {
      if (boards[i].includes(instruction))
        v.push(boards[i].indexOf(instruction));
      return v;
    });
    if (i <= 5) {
      i++;
      continue;
    }
    solution = arrayOfIndexes.every(checkForSolution);
    if (solution) {
      solution = arrayOfIndexes.map(checkForSolution).filter((v, indx) => {
        if (v !== false) {
          boardWinner = boards[indx];
          return v !== false;
        }
      })[0];
      lastNumberCalled = instruction;
      break;
    }
    lastBoardStates = arrayOfIndexes.map(checkForSolution);
  }

  let inst = instructions.slice(0, instructions.indexOf(lastNumberCalled) + 1);
  boardWinner = boards[lastBoardStates.indexOf(false)].filter(
    (v) => !inst.includes(v)
  );
  const result = boardWinner.reduce((p, c) => p + c, 0) * lastNumberCalled;
  return result;
}

const partOneAnswer = checkPerformance(() => partOne(testInput.input));
console.assert(
  partOneAnswer === testInput.firstPartExpected,
  `Expected ${testInput.firstPartExpected}, got instead ${partOneAnswer}`
);

const partTwoAnswer = checkPerformance(() => partTwo(testInput.input));
console.assert(
  partTwoAnswer === testInput.secondPartExpected,
  `Expected ${testInput.secondPartExpected}, got instead ${partTwoAnswer}`
);
