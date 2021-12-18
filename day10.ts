// -------------- Day 10: Syntax Scoring ---------------

const { testAnswer } = require("./utils");

const testInput = {
  input: `[({(<(())[]>[[{[]{<()<>>
  [(()[<>])]({[<{<<[]>>(
  {([(<{}[<>[]}>{[]{[(<()>
  (((({<>}<{<{<>}{[]{[]{}
  [[<[([]))<([[{}[[()]]]
  [{[{({}]{}}([{[{{{}}([]
  {<[[]]>}<{[{[{[]{()[[[]
  [<(<(<(<{}))><([]([]()
  <{([([[(<>()){}]>(<<{{
  <{([{{}}[<[[[<>{}]]]>[]]`,
  partOneExpected: 26397,
  partTwoExpected: 288957,
};

enum CharacterPoints {
  ")" = 3,
  "]" = 57,
  "}" = 1197,
  ">" = 25137,
}

enum PartTwoPoints {
  ")" = 1,
  "]" = 2,
  "}" = 3,
  ">" = 4,
}

const BRACKETS = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

const OPENING_BRACKETS = Object.keys(BRACKETS);

function parseInput(input: string): string[] {
  return input.split("\n").map((str) => str.trim());
}

function checkCloses(line: string): number {
  const stack = [];
  for (let char of line) {
    if (OPENING_BRACKETS.includes(char)) {
      stack.push(char);
      continue;
    }
    if (!stack.length || BRACKETS[stack.pop()] !== char)
      return CharacterPoints[char];
  }
  return 0;
}

function completeLines(line: string): string {
  const stack = [];
  for (let char of line) {
    if (OPENING_BRACKETS.includes(char)) {
      stack.push(char);
      continue;
    }
    if (!stack.length || BRACKETS[stack.pop()] !== char)
      throw new Error("This shouldn't be happening");
  }
  return stack
    .reverse()
    .map<string>((char) => BRACKETS[char])
    .join("");
}

function partOne(input: string | string[]): number {
  if (typeof input === "string") input = parseInput(input);
  const score = input.reduce<number>((p, c) => p + checkCloses(c), 0);
  return score;
}

function partTwo(input: string | string[]): number {
  if (typeof input === "string") input = parseInput(input);
  const incompletedLines = input.filter((line) => checkCloses(line) === 0);
  const filledLines = incompletedLines.map<string>(completeLines);
  const filledLinesScores = filledLines
    .map<number>((line) =>
      line
        .split("")
        .map<number>((char) => PartTwoPoints[char])
        .reduce<number>((p, c) => p * 5 + c, 0)
    )
    .sort((a, b) => a - b);
  return filledLinesScores[Math.floor(filledLinesScores.length / 2)];
}

testAnswer(testInput.input, partOne, testInput.partOneExpected);
testAnswer(testInput.input, partTwo, testInput.partTwoExpected);
