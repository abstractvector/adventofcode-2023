import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/10/2/example1.txt';
// const filename = './src/10/2/example2.txt';
const filename = './src/10/2/puzzle-input.txt';

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

    const vectors = directions[char];
    if (!vectors) return undefined;

    const [a, b] = vectors;
    return {
      char,
      location: { row, col },
      vectors,
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

let next = nodesPointingToStart[1];
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

console.log(
  weightedMap
    .map((row) => row.map((n) => (n === -1 ? '.' : '#')).join(''))
    .join('\n')
);

const insideLoop = new Set<string>();

const leftHandSearch = Object.fromEntries(
  path.map(({ row, col }, ix) => {
    const point = { row, col };
    const prevPoint = path?.[ix - 1] ?? path[path.length - 1];
    const nextPoint = path?.[ix + 1] ?? path[0];

    let left: string[] = [];
    // [prevPoint, nextPoint].map((p) => {
    //   const vector = `${p.row - row},${p.col - col}`;
    [
      `${row - prevPoint.row},${col - prevPoint.col}`,
      `${nextPoint.row - row},${nextPoint.col - col}`,
    ].map((vector) => {
      if (vector === '-1,0') left.push(`0,-1`); // north
      if (vector === '0,1') left.push(`-1,0`); // east
      if (vector === '1,0') left.push(`0,1`); // south
      if (vector === '0,-1') left.push(`1,0`); // west
    });

    left.sort();

    if (prevPoint.row !== nextPoint.row && prevPoint.col !== nextPoint.col) {
      // diagonal
      const vector = `${nextPoint.row - prevPoint.row},${
        nextPoint.col - prevPoint.col
      }`;
      if (vector === '-1,1') left.push(`-1,-1`); // north east
      if (vector === '1,1') left.push(`-1,1`); // south east
      if (vector === '1,-1') left.push(`1,1`); // south west
      if (vector === '-1,-1') left.push(`1,-1`); // north west
    }

    return [
      `${row},${col}`,
      {
        left: [...new Set(left)].map((l) => {
          const [y, x] = l.split(',').map((n) => +n);
          return `${row + y},${col + x}`;
        }),
        distance: ix,
      },
    ];
  })
);

Object.entries(leftHandSearch).forEach(([key, { left }]) => {
  left.forEach((l) => {
    const [row, col] = l.split(',');
    const v = weightedMap[row][col];
    if (v === -1) insideLoop.add(l);
  });
});

const hasEscaped = ({ row, col }: { row: number; col: number }) =>
  [0, map.length - 1].includes(row) || [0, map[0].length - 1].includes(col);

const isPathPoint = haveVisited;

const isInLoop = ({ row, col }: { row: number; col: number }) =>
  insideLoop.has(`${row},${col}`);

const outOfBounds = ({ row, col }: { row: number; col: number }) =>
  row < 0 || row > map.length || col < 0 || col > map[0].length;

let escapees = new Set<string>();
let trapped = new Set<string>();

const canEscape = (current: { row: number; col: number }) => {
  if (hasEscaped(current)) return true;
  if (escapees.has(`${current.row},${current.col}`)) return true;

  if (isInLoop(current)) {
    return false;
  }

  if (isPathPoint(current)) {
    return false;
  }

  let candidateSet = new Set<string>();
  candidateSet.add(`${current.row},${current.col}`);

  let walk = new Set<string>();

  while (candidateSet.size > 0) {
    const first = candidateSet.values().next().value;
    candidateSet.delete(first);
    walk.add(first);

    if (isInLoop(current)) {
      walk.forEach((p) => insideLoop.add(p));
      insideLoop.add(first);
      return false;
    }

    const [row, col] = first.split(',').map((n) => +n);
    if (hasEscaped({ row, col }) || escapees.has(first)) {
      walk.forEach((p) => escapees.add(p));
      escapees.add(first);
      // console.log(`Considered path length: `, [...path].length);
      return true;
    }

    [row - 1, row, row + 1]
      .map((y) =>
        [col - 1, col, col + 1]
          .map((x) => {
            if (x === col && y === row) return undefined;
            if (outOfBounds({ row: y, col: x })) return undefined;
            return { row: y, col: x };
          })
          .filter(Boolean)
      )
      .flat()
      .filter((n) => !walk.has(`${n.row},${n.col}`))
      .filter((n) => !isPathPoint(n))
      .map(({ row, col }) => `${row},${col}`)
      .forEach((n) => candidateSet.add(n));
  }

  walk.forEach((p) => trapped.add(p));
  trapped.add(`${current.row},${current.col}`);

  return false;
};

// for (let y = 0; y < map.length; y += 1) {
//   for (let x = 0; x < map[0].length; x += 1) {
//     const esc = canEscape({ row: y, col: x });
//     if (isPathPoint) continue;

//     if (!canEscape({ row: y, col: x })) {
//       trapped.add(`${y},${x}`);
//     }
//   }
// }

// console.log(`Some points are trapped!`, trapped.size);

const foo = new Set<string>();

const findNeighbors = (current: string) => {
  let candidateSet = new Set<string>();
  candidateSet.add(current);

  let walk = new Set<string>();

  while (candidateSet.size > 0) {
    const first = candidateSet.values().next().value;
    candidateSet.delete(first);
    walk.add(first);

    const [row, col] = first.split(',').map((n) => +n);

    const f = [row - 1, row, row + 1]
      .map((y) =>
        [col - 1, col, col + 1]
          .map((x) => {
            if (x === col && y === row) return undefined;
            return weightedMap[y][x] === -1 ? `${y},${x}` : undefined;
          })
          .filter(Boolean)
      )
      .flat()
      .filter((p) => !walk.has(p));

    f.forEach((p) => candidateSet.add(p));
  }

  return [...walk];
};

[...insideLoop].forEach((p) => {
  const neighbors = findNeighbors(p);
  neighbors.forEach((n) => insideLoop.add(n));
});

console.log(`How many tiles are enclosed by the loop?`, insideLoop.size);
