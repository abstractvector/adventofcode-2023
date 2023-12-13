import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/13/1/example.txt';
const filename = './src/13/1/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the file into lines
const mirrors = file
  .split('\n\n')
  .map((m) => m.trim())
  .filter(Boolean)
  .map((mirror) => {
    return mirror
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean)
      .map((line) => {
        const chars = line.trim().split('');
        return chars;
      });
  });

const testForHorizontalReflection = (
  mirror: string[],
  testRowNumber: number
) => {
  return mirror.every((rowA, iA) => {
    const iB = 2 * testRowNumber - iA - 1;
    const rowB = mirror[iB];
    return rowA === rowB || rowB === undefined;
  });
};

const findHorizontalReflection = (mirror) => {
  const mirrorString = mirror.map((m) => m.join(''));
  for (let i = 1; i < mirror.length; i++) {
    if (testForHorizontalReflection(mirrorString, i)) return i;
  }
};

const testForVerticalReflection = (
  mirror: number[][],
  testColNumber: number
) => {
  // console.log(mirror, testColNumber);
  return mirror.every((row) => {
    return row.every((colA, iA) => {
      const iB = 2 * testColNumber - iA - 1;
      const colB = row[iB];
      return colA === colB || colB === undefined;
    });
  });
};

const findVerticalReflection = (mirror) => {
  for (let i = 1; i < mirror[0].length; i++) {
    if (testForVerticalReflection(mirror, i)) return i;
  }
};

const answers = mirrors.map((mirror) => {
  console.log([
    findVerticalReflection(mirror),
    findHorizontalReflection(mirror),
  ]);

  return (
    (findVerticalReflection(mirror) ?? 0) +
    100 * (findHorizontalReflection(mirror) ?? 0)
  );
});

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

console.log(
  `What number do you get after summarizing all of your notes? ${sum(answers)}`
);
