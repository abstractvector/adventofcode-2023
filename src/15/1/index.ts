import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/15/1/example.txt';
const filename = './src/15/1/puzzle-input.txt';

// read the file into a string
let file = await readFile(filename, 'utf-8');

const steps = file.split(',');

const hash = (string: string) =>
  string.split('').reduce((a, b) => ((a + b.charCodeAt(0)) * 17) % 256, 0);

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

const answer = sum(steps.map(hash));

console.log(`What is the sum of the results?`, answer);
