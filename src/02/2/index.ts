import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/02/2/example.txt';
const filename = './src/02/2/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the lines into an array and remove any empty lines
const lines = file.split('\n').filter(Boolean);

// iterate through the puzzle input and find game IDs that are possible given the limits
const powers = lines
  .map((line) => {
    // we don't care about individual subsets, so just check for numbers and colors
    const match = line.matchAll(/(?<number>[0-9]+) (?<color>red|green|blue)/gm);

    // initialize all colors at zero
    const colors: Record<string, number> = {
      red: 0,
      green: 0,
      blue: 0,
    };

    // loop through our ball color matches and find the highest value for each
    [...match].forEach(({ groups: { number, color } }) => {
      const integerNumber = parseInt(number, 10);
      if (colors[color] < integerNumber) colors[color] = integerNumber;
    });

    // return the power of the numbers
    return Object.values(colors).reduce((a, b) => a * b, 1);
  })
  .filter(Boolean);

// sum the array
const sumOfPowers = powers.reduce((a, b) => a + b, 0);

// print the answer
console.log(`What is the sum of the power of these sets? ${sumOfPowers}`);
