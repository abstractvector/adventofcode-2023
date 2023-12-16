import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/16/2/example.txt';
const filename = './src/16/2/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

const tiles = file.split('\n');

type Beam = string;

let beams: Beam[] = []; // row,column,direction

enum Dir {
  Up,
  Down,
  Left,
  Right,
}

const energizedTiles = new Set<string>(); // row,column
const tracedBeams = new Set<Beam>(); // row,column,direction

const maxRow = tiles.length - 1;
const maxCol = tiles[0].length - 1;

const energizeTile = (row: number, col: number) => {
  if (row < 0 || col < 0 || row > maxRow || col > maxCol) return;
  energizedTiles.add(`${row},${col}`);
};

const traceBeam = (beam: Beam): Beam[] => {
  if (tracedBeams.has(beam)) return [];

  tracedBeams.add(beam);
  let [row, col, direction] = beam.split(',').map((n) => +n);

  let tile = tiles[row][col];
  energizeTile(row, col);

  switch (direction) {
    case Dir.Up:
      while (['.', '|'].includes((tile = tiles[--row]?.[col]))) {
        energizeTile(row, col);
      }
      energizeTile(row, col);

      if (tile === '-')
        return [`${row},${col},${Dir.Left}`, `${row},${col},${Dir.Right}`];
      if (tile === '\\') return [`${row},${col},${Dir.Left}`];
      if (tile === '/') return [`${row},${col},${Dir.Right}`];
      return [];

    case Dir.Down:
      while (['.', '|'].includes((tile = tiles[++row]?.[col]))) {
        energizeTile(row, col);
      }
      energizeTile(row, col);

      if (tile === '-')
        return [`${row},${col},${Dir.Left}`, `${row},${col},${Dir.Right}`];
      if (tile === '\\') return [`${row},${col},${Dir.Right}`];
      if (tile === '/') return [`${row},${col},${Dir.Left}`];
      return [];

    case Dir.Left:
      while (['.', '-'].includes((tile = tiles[row]?.[--col]))) {
        energizeTile(row, col);
      }
      energizeTile(row, col);

      if (tile === '|')
        return [`${row},${col},${Dir.Up}`, `${row},${col},${Dir.Down}`];
      if (tile === '\\') return [`${row},${col},${Dir.Up}`];
      if (tile === '/') return [`${row},${col},${Dir.Down}`];
      return [];

    case Dir.Right:
      while (['.', '-'].includes((tile = tiles[row]?.[++col]))) {
        energizeTile(row, col);
      }
      energizeTile(row, col);

      if (tile === '|')
        return [`${row},${col},${Dir.Up}`, `${row},${col},${Dir.Down}`];
      if (tile === '\\') return [`${row},${col},${Dir.Down}`];
      if (tile === '/') return [`${row},${col},${Dir.Up}`];
      return [];
  }
};

const printTiles = () => {
  const map = tiles
    .map((line, row) =>
      line
        .split('')
        .map((t, col) => (energizedTiles.has(`${row},${col}`) ? '#' : '.'))
        .join('')
    )
    .join('\n');

  console.log(map);
  console.log(
    `Number of energized tiles = `,
    map.split('').filter((c) => c === '#').length
  );
};

const startingPoints = [
  Array.from({ length: maxCol + 1 }).map((v, i) => [
    `0,${i},${Dir.Down}`,
    `${maxRow},${i},${Dir.Up}`,
  ]),
  Array.from({ length: maxRow + 1 }).map((v, i) => [
    `${i},0,${Dir.Right}`,
    `${i},${maxCol},${Dir.Left}`,
  ]),
].flat(2);

const result = startingPoints.map((startingPoint, num) => {
  console.log(
    `Checking starting point ${num + 1} of ${
      startingPoints.length
    }: ${startingPoint}`
  );
  energizedTiles.clear();
  tracedBeams.clear();
  beams = [startingPoint];

  let i = 0;
  while (beams.length > 0) {
    // if (i++ > 1e2) break;
    i++;

    const beam = beams.shift();
    const result = traceBeam(beam);
    beams.push(...result.filter((b) => !tracedBeams.has(b)));
  }
  return { startingPoint, energizedTiles: energizedTiles.size };
});

const maxEnergizedTiles = result
  .sort((a, b) => b.energizedTiles - a.energizedTiles)
  .shift();

const bestSP = maxEnergizedTiles.startingPoint.split(',').map((n) => +n);

console.log(
  `The most energized tiles are from starting point ${bestSP[0]},${
    bestSP[1]
  } heading ${Dir[bestSP[2]]}: ${maxEnergizedTiles.energizedTiles}`
);
