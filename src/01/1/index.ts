import { readFile } from 'node:fs/promises';

// path to calibration document from the elves
// const filename = './src/01/1/example.txt';
const filename = './src/01/1/calibration-document.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the lines into an array and remove any empty lines
const lines = file.split('\n').filter(Boolean);

// extract the calibration value from each line
const calibrationValues = lines.map((line) => {
  // remove any non-numerical digits from the string
  const numbers = line.replace(/\D+/g, '').trim();

  // split the numbers into an array
  const numbersArray = numbers.split('');

  // concatenate the first and last array elements, then parse as a base-10 integer
  return parseInt(`${numbersArray.at(0)}${numbersArray.at(-1)}`, 10);
});

// sum the array
const sumOfCalibrationValues = calibrationValues.reduce((a, b) => a + b, 0);

// print the answer
console.log(
  `What is the sum of all of the calibration values? ${sumOfCalibrationValues}`
);
