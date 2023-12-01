import { readFile } from 'node:fs/promises';

// path to calibration document from the elves
// const filename = './src/01/2/example.txt';
const filename = './src/01/2/calibration-document.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the lines into an array and remove any empty lines
const lines = file.split('\n').filter(Boolean);

// hash of the digits that could be spelled out as words
const digitWords = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

// define a regular expression to match any digit word or digit
const digitRegExp = new RegExp(`(${Object.keys(digitWords).join('|')}|\\d)`);

// extract the calibration value from each line
const calibrationValues = lines.map((line) => {
  let first, last;

  // search for the first digit
  for (let i = 1; i <= line.length; i += 1) {
    const match = line.slice(0, i).match(digitRegExp);
    if (match?.[0]) {
      first = /^\d$/.test(match[0])
        ? parseInt(match[0], 10)
        : digitWords[match[0]];
      break;
    }
  }

  // search for the last digit
  for (let i = line.length - 1; i >= 0; i -= 1) {
    const match = line.slice(i, line.length).match(digitRegExp);
    if (match?.[0]) {
      last = /^\d$/.test(match[0])
        ? parseInt(match[0], 10)
        : digitWords[match[0]];
      break;
    }
  }

  if (!first || !last) throw new Error(line);

  // concatenate the first and last digits, then parse as a base-10 integer
  return parseInt(`${first}${last}`, 10);
});

// sum the array
const sumOfCalibrationValues = calibrationValues.reduce((a, b) => a + b, 0);

// print the answer
console.log(
  `What is the sum of all of the calibration values? ${sumOfCalibrationValues}`
);
