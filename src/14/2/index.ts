import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/14/2/example.txt';
const filename = './src/14/2/puzzle-input.txt';

// read the file into a string
let matrix = await readFile(filename, 'utf-8');

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

const rotationClockwiseCache = new Map<string, string>();

const rotateClockwise = (stringMatrix) => {
  if (rotationClockwiseCache.has(stringMatrix))
    return rotationClockwiseCache.get(stringMatrix);

  const matrix = stringMatrix.split('\n').map((line) => line.split(''));
  const result = matrix[0]
    .map((val, index) =>
      matrix
        .map((row) => row[index])
        .reverse()
        .join('')
    )
    .join('\n');

  rotationClockwiseCache.set(stringMatrix, result);
  return result;
};

const rotateCounterClockwise = (stringMatrix) => {
  const matrix = stringMatrix.split('\n').map((line) => line.split(''));
  const result = matrix[0]
    .map((v, ix) => matrix.map((row) => row[row.length - 1 - ix]).join(''))
    .join('\n');
  return result;
};

const tilt = (stringMatrix) => {
  return stringMatrix
    .split('\n')
    .map((row, r) => {
      while (row !== (row = row.replace(/\.O/g, 'O.'))) {}
      return row;
    })
    .join('\n');
};

matrix = rotateCounterClockwise(matrix);

const cycleCache = new Map<string, string>();
const cycle = (matrix) => {
  if (cycleCache.has(matrix)) return cycleCache.get(matrix);

  let newMatrix = matrix;
  newMatrix = rotateClockwise(tilt(newMatrix));
  newMatrix = rotateClockwise(tilt(newMatrix));
  newMatrix = rotateClockwise(tilt(newMatrix));
  newMatrix = rotateClockwise(tilt(newMatrix));

  cycleCache.set(matrix, newMatrix);
  return newMatrix;
};

// cycles
for (let i = 0; i < 1e9; i++) {
  if (i % 1e6 === 0) console.log(i, cycleCache.size);
  // compass directions
  matrix = cycle(matrix);
}

matrix = rotateClockwise(matrix);

const loads = rotateCounterClockwise(matrix)
  .split('\n')
  .map((row, r) => {
    return row
      .split('')
      .map((s, i) => (s === 'O' ? row.length - i : 0))
      .filter((n) => n > 0);
  })
  .flat();

console.log(`What is the total load on the north support beams?`, sum(loads));
