// -------------- Day 8: Seven Segment Search ---------------

interface WantedSingleInput {
  signalPatterns: string[];
  outputProduced: string[];
}

type OnlySegments = string;

interface ExchangedCode {
  a: OnlySegments;
  b: OnlySegments;
  c: OnlySegments;
  d: OnlySegments;
  e: OnlySegments;
  f: OnlySegments;
  g: OnlySegments;
}

type WantedInput = WantedSingleInput[];

const testInput = {
  input: `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`,
  partOneExpected: 26,
  partTwoExpected: 61229,
};
const SEGMENTS_FOR_DIGITS = [
  "abcefg".split(""),
  "cf".split(""),
  "acdeg".split(""),
  "acdfg".split(""),
  "bcdf".split(""),
  "abdfg".split(""),
  "abdefg".split(""),
  "acf".split(""),
  "abcdefg".split(""),
  "abcdfg".split(""),
];

function parseInput(input: string): WantedInput {
  const parsedInput: WantedInput = input
    .split("\n")
    .map<WantedSingleInput>((signal) => {
      const [signalEntry, signalOutput] = signal.split(" | ");
      return {
        signalPatterns: signalEntry.split(" "),
        outputProduced: signalOutput.split(" "),
      };
    });
  return parsedInput;
}

function partOne(input: string | WantedInput): number {
  if (typeof input === "string") input = parseInput(input);
  const outputValues: Array<string[]> = input.map((v) => v.outputProduced);
  const uniquesLengths = Object.values(SEGMENTS_FOR_DIGITS)
    .map<number>((digit) => digit.length)
    .filter(
      (value, _, array) =>
        array.filter((nestedValue) => nestedValue === value).length === 1
    );
  return outputValues.reduce<number>(
    (p, c, a) =>
      p + c.filter((output) => uniquesLengths.includes(output.length)).length,
    0
  );
}

function findPotentialCandF(signalReceived: string[]): {
  c: string;
  f: string;
} {
  const c_f = signalReceived.find((signal) => signal.length === 2);
  return {
    c: c_f[0],
    f: c_f[1],
  };
}

function findA(
  signalReceived: string[],
  c_f: { c: string; f: string }
): { a: string } {
  const a = signalReceived
    .find((signal) => signal.length === 3)
    .split("")
    .find((char) => ![c_f.c, c_f.f].includes(char));
  return {
    a,
  };
}

/**
 * Substract elements from B to A. Returning elements of A that doesn't exist on B
 * @param a Element to substract elements
 * @param b Elements to substract
 */
function restBtoA(a: string, b: string): string[] {
  return a.split("").filter((char) => !b.includes(char));
}

function findDandB(
  signalReceived: string[],
  c_f: { c: string; f: string }
): { d: string; b: string } {
  const four = signalReceived.find((signal) => signal.length === 4);
  const eight = signalReceived.find((signal) => signal.length === 7);
  const potentialD_B = four.replace(c_f.c, "").replace(c_f.f, "");
  const zeroSixNine = signalReceived.filter((signal) => signal.length === 6);
  const d = zeroSixNine
    .map((value) => restBtoA(eight, value).join(""))
    .find((value) => potentialD_B.includes(value));
  const b = potentialD_B.replace(d[0], "");
  return {
    b,
    d,
  };
}

function findG(
  signalReceived: string[],
  c_f: { c: string; f: string },
  a: { a: string },
  b_d: { b: string; d: string }
): { g: string } {
  const superFour = Object.values({
    ...c_f,
    ...a,
    ...b_d,
  }).join("");

  const g = signalReceived
    .filter((signal) => signal.length === 6)
    .map((value) => restBtoA(value, superFour).join(""))
    .find((value) => value.length === 1);

  return {
    g,
  };
}

function findE(
  signalReceived: string[],
  allLetters: {
    a: string;
    b: string;
    c: string;
    d: string;
    f: string;
    g: string;
  }
): { e: string } {
  const eight = signalReceived.find((signal) => signal.length === 7);
  const e = restBtoA(eight, Object.values(allLetters).join(""))[0];
  return {
    e,
  };
}

function definedCandF(signalReceived: string[], allLetters: ExchangedCode) {
  const twoThreeFour = signalReceived.filter((signal) => signal.length === 5);
  const two = twoThreeFour.find(
    (value) =>
      restBtoA(
        value,
        `${allLetters.a}${allLetters.d}${allLetters.e}${allLetters.g}`
      ).length === 1
  );
  const c = restBtoA(
    two,
    `${allLetters.a}${allLetters.d}${allLetters.e}${allLetters.g}`
  )[0];
  return {
    c,
    f: c === allLetters.c ? allLetters.f : allLetters.c,
  };
}

function parseSignal(signalReceived: string[]): string[] {
  const numbers = Array<string>(9).fill("");
  const c_f = findPotentialCandF(signalReceived);
  const a = findA(signalReceived, c_f);
  const b_d = findDandB(signalReceived, c_f);
  const g = findG(signalReceived, c_f, a, b_d);
  const e = findE(signalReceived, {
    ...c_f,
    ...a,
    ...b_d,
    ...g,
  });
  const trueC_F = definedCandF(signalReceived, {
    ...a,
    ...b_d,
    ...c_f,
    ...g,
    ...e,
  });
  const allLetters: ExchangedCode = {
    ...a,
    ...b_d,
    ...e,
    ...trueC_F,
    ...g,
  };
  for (let i = 0; i <= 9; i++) {
    const number = SEGMENTS_FOR_DIGITS[i].map((char) => allLetters[char]);
    const numberRegEx = new RegExp(`[${number.join("")}]{${number.length}}`);
    numbers[i] = signalReceived.find(
      (signal) => signal.match(numberRegEx) && signal.length === number.length
    );
  }
  return numbers;
}

function createRegex(str: string): RegExp {
  return new RegExp(`[${str}]{${str.length}}`);
}

function parseNumber(outputSingleSignal: string, numbers: string[]): number {
  for (let i = 0; i < numbers.length; i++) {
    const regIguess = createRegex(numbers[i]);
    const idk = outputSingleSignal.match(regIguess);
    if (
      outputSingleSignal.match(createRegex(numbers[i])) &&
      outputSingleSignal.length === numbers[i].length
    )
      return i;
  }
}

function parseOutputSignal(outputSignal: string[], numbers: string[]): number {
  return parseInt(outputSignal.map((v) => parseNumber(v, numbers)).join(""));
}

function partTwo(input: string | WantedInput): number {
  if (typeof input === "string") input = parseInput(input);
  let sum = 0;
  for (let signal of input) {
    const numbers = parseSignal(signal.signalPatterns);
    sum += parseOutputSignal(signal.outputProduced, numbers);
  }
  return sum;
}

const partOneAnswer = partOne(testInput.input);
console.assert(
  partOneAnswer === testInput.partOneExpected,
  `Expected ${testInput.partOneExpected}, got ${partOneAnswer} instead.`
);

const partTwoAnswer = partTwo(testInput.input);
console.assert(
  partTwoAnswer === testInput.partTwoExpected,
  `Expected ${testInput.partTwoExpected}, got ${partTwoAnswer} instead.`
);
