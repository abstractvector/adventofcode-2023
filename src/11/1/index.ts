import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/11/1/example.txt';
const filename = './src/11/1/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the file into lines
const lines = file.split('\n').filter(Boolean);

let galaxyNumber = 0;

let map = lines
  .map((line) => {
    const newLine = line.split('').map((char) => {
      if (char === '#') return (galaxyNumber += 1);
      return 0;
    });

    return newLine.every((c) => c === 0) ? [newLine, newLine] : [newLine];
  })
  .flat();

const emptyColumns = [];
for (let i = 0; i < map[0].length; i += 1) {
  const isEmpty = map.every((line) => line[i] === 0);
  if (isEmpty) emptyColumns.push(i);
}

map = map.map((line) =>
  line
    .map((char, ix) => (emptyColumns.includes(ix) ? [char, char] : [char]))
    .flat()
);

console.log(
  map.map((l) => l.map((c) => (c === 0 ? '.' : c)).join('')).join('\n')
);

const galaxies = map
  .map((l, y) => l.map((c, x) => (c === 0 ? undefined : [x, y])))
  .flat()
  .filter(Boolean);

const paths = galaxies
  .map((g1, i1) => {
    return galaxies.map((g2, i2) => {
      return Math.abs(g2[0] - g1[0]) + Math.abs(g2[1] - g1[1]);
    });
  })
  .flat();

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

console.log(sum(paths) / 2);
