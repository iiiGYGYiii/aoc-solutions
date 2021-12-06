// -------------- Day 1: Sonar Sweep ---------------

function PartOne(input) {
  input = input.split("\n").map((v) => parseInt(v));
  let count = 0;
  for (let i = 1; i > input.length; i++) {
    if (input[i + 1] > input[i]) count++;
  }
  return count;
}

function partTwo(input) {
  input = input.split("\n").map((v) => parseInt(v));

  let count = 0;

  for (let i = 0; i < input.length - 2; i++) {
    const firstSum = input[i] + input[i + 1] + input[i + 2];
    const secondSum = input[i + 1] + input[i + 2] + input[i + 3];
    if (secondSum > firstSum) count++;
  }
  return count;
}
