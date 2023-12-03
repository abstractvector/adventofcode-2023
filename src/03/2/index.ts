import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/03/2/example.txt';
const filename = './src/03/2/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the lines into an array and remove any empty lines
const lines = file.split('\n').filter(Boolean);

// locate the symbols using coordinates [row,column] (0-indexed)
const symbols = lines
  .map((line, row) =>
    [...line.matchAll(/([^0-9.])/g)].map(({ index }) => [row, index])
  )
  .flat() as [number, number][];

// function to check if a particular coordinate is adjacent to a symbol
const isAdjacentToSymbol = (coordinate: [number, number]) => {
  const [row, column] = coordinate;

  return symbols.some((symbol) => {
    if (row === symbol[0] && column === symbol[1])
      throw new Error(`Coordinate is a symbol`);

    // if the coordinate row & column are both adjacent then it's adjacent
    return (
      row >= symbol[0] - 1 &&
      row <= symbol[0] + 1 &&
      column >= symbol[1] - 1 &&
      column <= symbol[1] + 1
    );
  });
};

// iterate over each line, find the engine part numbers, and find ones adjacent to symbols
const engineParts = lines
  .map((line, row) =>
    [...line.matchAll(/([0-9]+)/g)].map((match) => {
      const number = match[1];
      const coordinates = Array.from(number, (k, v) => [row, match.index + v]);

      return coordinates.some(isAdjacentToSymbol)
        ? {
            partNumber: parseInt(number, 10),
            start: coordinates[0],
            length: coordinates.length,
          }
        : undefined;
    })
  )
  .flat()
  .filter(Boolean);

// find engine parts adjacent to a specified coordinate
const findAdjacentEngineParts = (coordinate: [number, number]) => {
  const [row, column] = coordinate;
  return engineParts
    .filter(
      ({ start, length }) =>
        row >= start[0] - 1 &&
        row <= start[0] + 1 &&
        column >= start[1] - 1 &&
        column <= start[1] + length
    )
    .map(({ partNumber }) => partNumber);
};

// iterate over each line, find the engine part numbers, and find ones adjacent to symbols
const gears = lines
  .map((line, row) =>
    // find gear symbols and check for adjacent engine parts
    [...line.matchAll(/\*/g)].map((match) => {
      const adjacentEngineParts = findAdjacentEngineParts([row, match.index]);

      // it's only a gear if it's adjacent to exactly 2 engine parts
      return adjacentEngineParts.length === 2 ? adjacentEngineParts : undefined;
    })
  )
  .flat()
  .filter(Boolean);

// calculate the gear ratios by multiplying
const gearRatios = gears.map(([part1, part2]) => part1 * part2);

// sum up all the gear ratios
const sumOfGearRatios = gearRatios.reduce((a, b) => a + b, 0);

console.log(
  `What is the sum of all of the gear ratios in your engine schematic? ${sumOfGearRatios}`
);
