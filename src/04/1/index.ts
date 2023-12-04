import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/04/1/example.txt';
const filename = './src/04/1/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the lines into an array and remove any empty lines
const lines = file.split('\n').filter(Boolean);

// extracts whitespace-separated numbers from a string
const extractNumbersFromString = (string: string) =>
  string
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((n) => parseInt(n, 10));

// iterate over each line, find the number of winning numbers and hence the score
const scores = lines.map((line) => {
  // parse the line into its constituent parts
  const match = line.match(/^Card\s+([0-9]+):([0-9\s]+)\|([0-9\s]+)/);
  if (!match) throw new Error(`Could not match line: ${line}`);

  // extract the winning numbers
  const winningNumbers = extractNumbersFromString(match[2]);

  // extract my winning numbers
  const myWinningNumbers = extractNumbersFromString(match[3]).filter((n) =>
    winningNumbers.includes(n)
  );

  // calculate the score
  const score =
    myWinningNumbers.length > 0 ? Math.pow(2, myWinningNumbers.length - 1) : 0;

  return score;
});

// sum up all the scores
const sumOfScores = scores.reduce((a, b) => a + b, 0);

console.log(`How many points are they worth in total? ${sumOfScores}`);
