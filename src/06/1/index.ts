import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/06/1/example.txt';
const filename = './src/06/1/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the file into sections
const lines = file.split('\n').filter(Boolean);

const times = [...lines[0].matchAll(/([0-9]+)/g)].map((m) => +m[1]);
const distances = [...lines[1].matchAll(/([0-9]+)/g)].map((m) => +m[1]);

const races = times.map((t, i) => [t, distances[i]]) as [number, number][];

// ax^2 + bx + c = 0
const solveQuadratic = (a: number, b: number, c: number) => {
  // (-b±√(b²-4ac))/(2a)
  const sqrt = Math.sqrt(Math.pow(b, 2) - 4 * a * c);

  return [(-b + sqrt) / (2 * a), (-b - sqrt) / (2 * a)];
};

const calculateRaceOptions = (time: number, distance: number) => {
  const [min, max] = solveQuadratic(1, -time, distance).sort();

  // add 1 to find the number of integers in the range
  let waysToWin = Math.abs(Math.floor(max) - Math.ceil(min) + 1);

  // we need to _win_ the race, not match the winning time, so we need >= not =
  if (Number.isInteger(min)) waysToWin -= 1;
  if (Number.isInteger(max)) waysToWin -= 1;

  return waysToWin;
};

// calculate the number of winning times for each race
const solutions = races.map(([time, distance]) =>
  calculateRaceOptions(time, distance)
);

// sum them up to get the answer
const answer = solutions.reduce((a, b) => a * b, 1);

console.log(
  `What do you get if you multiply these numbers together? ${answer}`
);
