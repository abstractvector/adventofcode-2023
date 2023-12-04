import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/04/2/example.txt';
const filename = './src/04/2/puzzle-input.txt';

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

// iterate over each line and process each card
const cards = lines.map((line) => {
  // parse the line into its constituent parts
  const match = line.match(/^Card\s+([0-9]+):([0-9\s]+)\|([0-9\s]+)/);
  if (!match) throw new Error(`Could not match line: ${line}`);

  // extract the winning numbers
  const winningNumbers = extractNumbersFromString(match[2]);

  // extract my winning numbers
  const myWinningNumbers = extractNumbersFromString(match[3]).filter((n) =>
    winningNumbers.includes(n)
  );

  return {
    id: parseInt(match[1].trim()),
    winningNumbers: myWinningNumbers.length,
    copies: 1,
  };
});

// check each card to see how many more scratchcards it has won
for (let card of cards) {
  const { id, winningNumbers, copies } = card;
  cards
    .filter((c) => c.id > id && c.id <= id + winningNumbers)
    .forEach((c) => (c.copies += copies));
}

// count all the cards
const numberOfCards = cards.reduce((a, b) => a + b.copies, 0);

console.log(`How many total scratchcards do you end up with? ${numberOfCards}`);
