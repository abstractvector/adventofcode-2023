import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/02/1/example.txt';
const filename = './src/02/1/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the lines into an array and remove any empty lines
const lines = file.split('\n').filter(Boolean);

// define the limits for the different colors
const limits = {
  red: 12,
  green: 13,
  blue: 14,
};

// iterate through the puzzle input and find game IDs that are possible given the limits
const gameIds = lines
  .map((line) => {
    // we don't care about individual subsets, so just check for numbers and colors
    const match = line.matchAll(/(?<number>[0-9]+) (?<color>red|green|blue)/gm);

    // check each one to see if we have exceeded the limit
    const exceedsLimit = [...match].some(
      ({ groups: { number, color } }) => number > limits[color]
    );

    // if we exceeded the limit, ignore this game ID
    if (exceedsLimit) return undefined;

    // extract the game ID from the line
    const [, gameId] = line.match(/^Game ([0-9]+):/);

    // cast the string to a number for cleanliness
    return parseInt(gameId, 10);
  })
  .filter(Boolean);

// sum the array
const sumOfGameIds = gameIds.reduce((a, b) => a + b, 0);

// print the answer
console.log(`What is the sum of the IDs of those games? ${sumOfGameIds}`);
