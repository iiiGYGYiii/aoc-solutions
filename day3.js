// -------------- Day 3: Binary Diagnostic ---------------

const testInput = {
  test: `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`,
  partOneExpectedValue: 198,
  partTwoExpectedValue: 230,
};

function getBigSum(array) {
  return array.reduce(
    (p, c) => p.map((v, i) => v + parseInt(c[i])),
    Array(array[0].length).fill(0)
  );
}

function partOne(input) {
  input = input.split("\n");
  const inputSize = input.length / 2;
  let bigSum = getBigSum(input);
  let gammaRate = bigSum.reduce(
    (p, c) => (c - inputSize > 0 ? p + "1" : p + "0"),
    ""
  );
  let epsilonRate = gammaRate
    .split("")
    .map((v) => (v === "1" ? "0" : "1"))
    .join("");
  gammaRate = parseInt(gammaRate, 2);
  epsilonRate = parseInt(epsilonRate, 2);
  return gammaRate * epsilonRate;
}

function partTwo(input) {
  input = input.split("\n");
  let oxygenArray = [...input];
  let carbonArray = [...input];
  for (let i = 0; i < input[0].length; i++) {
    if (oxygenArray.length !== 1) {
      let inputHalfSize = oxygenArray.length / 2;
      let bigSum = getBigSum(oxygenArray).map((v) =>
        v - inputHalfSize >= 0 ? 1 : 0
      );
      oxygenArray = oxygenArray.filter((v) => v.startsWith(bigSum[i], i));
    }
    if (carbonArray.length !== 1) {
      let inputHalfSize = carbonArray.length / 2;
      let bigSum = getBigSum(carbonArray).map((v) =>
        v - inputHalfSize >= 0 ? 0 : 1
      );
      carbonArray = carbonArray.filter((v) => v.startsWith(bigSum[i], i));
      if (carbonArray.length === 1) break;
    }
  }
  const oxygen = parseInt(oxygenArray[0], 2);
  const carbon = parseInt(carbonArray[0], 2);
  return oxygen * carbon;
}

const partOneAnswer = partOne(testInput.test);
console.assert(
  partOneAnswer === testInput.partOneExpectedValue,
  `Expected ${testInput.partOneExpectedValue} got instead ${partOneAnswer}`
);
const partTwoAnswer = partTwo(testInput.test);
console.assert(
  partTwoAnswer === testInput.partTwoExpectedValue,
  `Expected ${testInput.partTwoExpectedValue} got instead ${partTwoAnswer}`
);
