import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/08/2/example.txt';
const filename = './src/08/2/puzzle-input.txt';

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
    const match = line.match(/([A-Z0-9]+)\s=\s+\(([A-Z0-9]+),\s+([A-Z0-9]+)\)/);
    return [match[1], [match[2], match[3]]];
  })
);

const starts = Object.entries(nodes)
  .filter(([key]) => /A$/.test(key))
  .map(([key]) => key);

const findPath = (current: string | number) => {
  let first;

  for (let step = 0; step < 1e6; step += 1) {
    const instruction = instructions[step % instructions.length];
    current = nodes[current][instruction];
    if (/Z$/.test(current)) {
      if (first === undefined) {
        first = step;
      } else {
        return { end: current, finish: first + 1, repeat: step - first };
      }
    }
  }
};

const paths = starts
  .map((start) => findPath(start))
  .sort((a, b) => a.finish - b.finish)
  .map(({ finish }) => finish);

let gcd;
for (let i = 1; i <= Math.min(...paths); i += 1) {
  if (paths.every((n) => n % i === 0)) {
    gcd = i;
  }
}

const solution = gcd * paths.map((n) => n / gcd).reduce((a, b) => a * b, 1);

console.log(
  `How many steps does it take before you're only on nodes that end with Z? ${solution}`
);
