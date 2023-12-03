import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/03/1/example.txt';
const filename = './src/03/1/puzzle-input.txt';

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
      for (let i = 0; i < number.length; i += 1) {
        if (isAdjacentToSymbol([row, match.index + i]))
          return parseInt(number, 10);
      }
      return undefined;
    })
  )
  .flat()
  .filter(Boolean);

// sum up all the engine part numbers
const sumOfPartNumbers = engineParts.reduce((a, b) => a + b, 0);

console.log(
  `What is the sum of all of the part numbers in the engine schematic? ${sumOfPartNumbers}`
);
