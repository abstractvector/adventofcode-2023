import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/08/1/example1.txt';
// const filename = './src/08/1/example2.txt';
const filename = './src/08/1/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the file into lines
const lines = file.split('\n').filter(Boolean);

const mapping = { L: 0, R: 1 };

const instructions = lines
  .shift()
  .split('')
  .map((i) => mapping[i]);

const nodes = Object.fromEntries(
  lines.map((line) => {
    const match = line.match(/([A-Z]+)\s=\s+\(([A-Z]+),\s+([A-Z]+)\)/);
    return [match[1], [match[2], match[3]]];
  })
);

let step = 0;
let current = 'AAA';

while (current !== 'ZZZ') {
  const instruction = instructions[step % instructions.length];
  current = nodes[current][instruction];
  step += 1;
}

console.log(`How many steps are required to reach ZZZ? ${step}`);
