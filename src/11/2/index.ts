import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/11/1/example.txt';
const filename = './src/11/1/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the file into lines
const lines = file.split('\n').filter(Boolean);

let galaxyNumber = 0;
const expansionRate = 1e6;

const emptyRows = [];

let map = lines.map((line, i) => {
  const newLine = line
    .split('')
    .map((char) => (char === '#' ? (galaxyNumber += 1) : 0));
  if (newLine.every((c) => c === 0)) emptyRows.push(i);

  return newLine;
});

const emptyColumns = [];
for (let i = 0; i < map[0].length; i += 1) {
  const isEmpty = map.every((line) => line[i] === 0);
  if (isEmpty) emptyColumns.push(i);
}

// console.log(
//   map.map((l) => l.map((c) => (c === 0 ? '.' : c)).join('')).join('\n'),
//   emptyRows,
//   emptyColumns
// );

const galaxies = map
  .map((l, y) => l.map((c, x) => (c === 0 ? undefined : [x, y])))
  .flat()
  .filter(Boolean);

const paths = galaxies
  .map((g1, i1) => {
    return galaxies.map((g2, i2) => {
      const delta = Math.abs(g2[0] - g1[0]) + Math.abs(g2[1] - g1[1]);

      const extraRows = emptyRows.filter(
        (r) => r > Math.min(g1[1], g2[1]) && r < Math.max(g1[1], g2[1])
      ).length;

      const extraCols = emptyColumns.filter(
        (c) => c > Math.min(g1[0], g2[0]) && c < Math.max(g1[0], g2[0])
      ).length;

      const multiplier = expansionRate - 1;

      const path = delta + extraRows * multiplier + extraCols * multiplier;
      // console.log(`${i1 + 1} => ${i2 + 1} = ${path}`);
      return path;
    });
  })
  .flat();

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

console.log(sum(paths) / 2);
