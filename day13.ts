// -------------- Day 13: Transparent Origami ---------------

type Paper = Array<number[]>;

interface Coordinate {
  x: number;
  y: number;
}

interface ExpectedInput {
  dots: Coordinate[];
  folds: Fold[];
}

interface Fold {
  x?: number;
  y?: number;
}

const testInput = {
  input: `6,10
  0,14
  9,10
  0,3
  10,4
  4,11
  6,0
  6,12
  4,1
  0,13
  10,12
  3,4
  3,0
  8,4
  1,10
  2,14
  8,10
  9,0
  
  fold along y=7
  fold along x=5`,
  partOneExpected: 17,
};

function countAllDots(paper: Paper): number {
  let count = 0;
  for (let row of paper) {
    for (let value of row) {
      if (value > 0) count++;
    }
  }
  return count;
}

function getPaperSize(coordinates: Coordinate[]): Coordinate {
  let x = -1,
    y = -1;
  for (let coordinate of coordinates) {
    x = Math.max(coordinate.x, x);
    y = Math.max(coordinate.y, y);
  }
  return {
    x,
    y,
  };
}

function getPaperMatrix(coordinates: Coordinate[]): Paper {
  const { x: maxX, y: maxY } = getPaperSize(coordinates);
  return Array(maxY + 1)
    .fill(0)
    .map((_) => Array(maxX + 1).fill(0));
}

function getPaperFilled(coordinates: Coordinate[]): Paper {
  const paperMatrix = getPaperMatrix(coordinates);
  for (let { x, y } of coordinates) {
    paperMatrix[y][x] = 1;
  }
  return paperMatrix;
}

function foldX(paper: Paper, fold: Fold): Paper | undefined {
  if (fold.x === undefined) return;
  const { x } = fold;
  paper = paper.map<number[]>((line) => {
    const secondPart = line.slice(x);
    return line
      .slice(0, x + 1)
      .reverse()
      .map<number>((value, index) => {
        if (!secondPart[index]) return value;
        return value + secondPart[index];
      })
      .reverse();
  });
  return paper;
}

function foldY(paper: Paper, fold: Fold): Paper | undefined {
  if (!fold.y) return;
  const { y } = fold;
  const secondPart = paper.slice(y + 1);
  let firstPart = paper.slice(0, y).reverse();

  firstPart = firstPart
    .map<number[]>((line) => {
      const nextLine = secondPart.shift();
      if (!nextLine) return line;
      return line.map<number>((value, index) => value + nextLine[index]);
    })
    .reverse();
  return firstPart;
}

function foldPaper(paper: Paper, fold: Fold): Paper {
  return fold.x !== undefined ? foldX(paper, fold) : foldY(paper, fold);
}

function parseInput(input: string): ExpectedInput {
  const newInput = input.split("\n").map((str) => str.trim());
  const dots = newInput
    .slice(0, newInput.indexOf(""))
    .map<Coordinate>((str) => {
      let [x, y] = str.split(",");
      return {
        x: parseInt(x),
        y: parseInt(y),
      };
    });
  const folds = newInput
    .slice(newInput.indexOf("") + 1)
    .map<Fold>((instr, _, a) => {
      let [foldDirection, foldQty] = instr.split(" ")[2].split("=");
      return foldDirection === "x"
        ? {
            x: parseInt(foldQty),
          }
        : {
            y: parseInt(foldQty),
          };
    });
  return {
    dots,
    folds,
  };
}

function partOne(input: string | ExpectedInput): number {
  if (typeof input === "string") input = parseInput(input);
  const { dots, folds } = input;
  let paper = getPaperFilled(dots);
  const fold = folds.shift();
  paper = foldPaper(paper, fold);
  return countAllDots(paper);
}

function partTwo(input: string | ExpectedInput) {
  if (typeof input === "string") input = parseInput(input);
  const { dots, folds } = input;
  let paper = getPaperFilled(dots);
  for (let fold of folds) {
    paper = foldPaper(paper, fold);
  }
  console.log(
    paper
      .map((row) => row.map((v) => (v === 0 ? "." : "*")).join(" "))
      .join("\n")
  );
}

const partOneAnswer = partOne(testInput.input);
console.assert(
  partOneAnswer === testInput.partOneExpected,
  `Expected ${testInput.partOneExpected}, got ${partOneAnswer} instead.`
);

partTwo(input);
