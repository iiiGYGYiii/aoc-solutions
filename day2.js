// -------------- Day 2: Dive ---------------

let testInput = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

function partOne(input) {
  input = input.split("\n").map((v) => v.split(" "));
  const instructions = {
    down: 0,
    up: 0,
    forward: 0,
  };

  for (let [direction, qty] of input) {
    instructions[direction] = instructions[direction] + parseInt(qty);
  }
  return instructions.forward * (instructions.down - instructions.up);
}

function partTwo(input) {
  input = input.split("\n").map((v) => v.split(" "));
  let aim = 0,
    depth = 0,
    forward = 0;
  for (let [value, qty] of input) {
    qty = parseInt(qty);
    switch (value) {
      case "forward":
        depth += aim * qty;
        forward += qty;
        break;
      case "up":
        aim -= qty;
        break;
      case "down":
        aim += qty;
        break;
      default:
        break;
    }
  }
  return depth * forward;
}

const partOneAnswer = partOne(testInput);
console.assert(
  partOneAnswer === 150,
  `Expected 150, instead got ${partOneAnswer}`
);

const partTwoAnswer = partTwo(testInput);
console.assert(
  partTwoAnswer === 900,
  `Expected 900, instead got ${partTwoAnswer}`
);
