import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/09/1/example.txt';
const filename = './src/09/1/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the file into lines
const lines = file.split('\n').filter(Boolean);

const sequences = lines.map((line) => line.split(/\s+/).map((n) => +n));

const alg = (sequence: number[], result = []) => {
  const newSequence = sequence.slice(1).map((n, ix) => n - sequence[ix]);
  result.push(sequence[sequence.length - 1]);
  return newSequence.every((n) => n === 0) ? result : alg(newSequence, result);
};

const predictions: number[] = sequences.map((sequence) => {
  const lastDigits = alg(sequence);
  return lastDigits.reduce((a, b) => a + b, 0);
});

const solution = predictions.reduce((a, b) => a + b, 0);

console.log(`What is the sum of these extrapolated values? ${solution}`);
