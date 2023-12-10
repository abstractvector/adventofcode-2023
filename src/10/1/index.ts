import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/10/1/example1.txt';
// const filename = './src/10/1/example2.txt';
const filename = './src/10/1/puzzle-input.txt';

const compass: Record<string, [number, number]> = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
};

const { N, S, E, W } = compass;

const directions = {
  '|': [N, S],
  '-': [E, W],
  L: [N, E],
  J: [N, W],
  '7': [S, W],
  F: [S, E],
};

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the file into lines
const lines = file.split('\n').filter(Boolean);

let start: { row: number; col: number } = undefined;

const map = lines.map((line, row) => {
  return line.split('').map((char, col) => {
    if (char === 'S') start = { row, col };

    const nodes = directions[char];
    if (!nodes) return undefined;

    const [a, b] = nodes;
    return {
      location: { row, col },
      nodes: [
        { row: row + a[1], col: col + a[0] },
        { row: row + b[1], col: col + b[0] },
      ],
    };
  });
});

const nodesPointingToStart = map
  .flat()
  .filter((node) =>
    node?.nodes.some((n) => n.row === start.row && n.col === start.col)
  );

if (nodesPointingToStart.length !== 2)
  throw new Error(`More than 2 nodes point to the start`);

let next = nodesPointingToStart[0];
let path: { row: number; col: number }[] = [start];

const haveVisited = ({ row, col }: { row: number; col: number }) =>
  path.some((p) => p.row === row && p.col === col);

while (!haveVisited(next.location)) {
  path.push(next.location);
  const location = next.nodes.find((n) => !haveVisited(n));
  if (!location) break;
  next = map[location.row][location.col];
}

const weightedMap = lines.map((line, row) =>
  line.split('').map((char, col) => {
    const weight = path.findIndex((p) => p.row === row && p.col === col);
    return weight !== -1 ? Math.min(weight, path.length - weight) : -1;
  })
);

// console.log(
//   weightedMap
//     .map((row) => row.map((n) => (n === -1 ? '.' : '#')).join(''))
//     .join('\n')
// );

const distances = weightedMap.flat().filter((d) => d !== -1);

const maxDistance = Math.max(...distances);

console.log(
  `How many steps along the loop does it take to get from the starting position to the point farthest from the starting position?`,
  maxDistance
);
