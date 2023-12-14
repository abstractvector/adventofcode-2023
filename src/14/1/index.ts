import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/14/1/example.txt';
const filename = './src/14/1/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

const lines = file.split('\n').map((line) => line.split(''));

const rotateCounterClockwise = (matrix) => {
  return matrix[0].map((v, ix) =>
    matrix.map((row) => row[row.length - 1 - ix])
  );
};

const stones = rotateCounterClockwise(lines);

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

const loads = stones
  .map((row, r) => {
    console.log(`Rolling row #${r + 1}`);
    let rolledRow = row.join('');
    while (rolledRow !== (rolledRow = rolledRow.replace(/\.O/g, 'O.'))) {}

    return rolledRow
      .split('')
      .map((s, i) => {
        if (s === 'O') return rolledRow.length - i;
        return 0;
      })
      .filter((n) => n > 0);
  })
  .flat();

console.log(`What is the total load on the north support beams?`, sum(loads));
