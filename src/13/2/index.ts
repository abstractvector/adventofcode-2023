import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/13/2/example.txt';
const filename = './src/13/2/puzzle-input.txt';

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

const findHorizontalReflection = (mirror, ignore = undefined) => {
  const mirrorString = mirror.map((m) => m.join(''));
  for (let i = mirror.length - 1; i > 0; i--) {
    if (ignore !== undefined && ignore === i) continue;
    if (testForHorizontalReflection(mirrorString, i)) return i;
  }
};

const testForVerticalReflection = (
  mirror: number[][],
  testColNumber: number
) => {
  return mirror.every((row) => {
    return row.every((colA, iA) => {
      const iB = 2 * testColNumber - iA - 1;
      const colB = row[iB];
      return colA === colB || colB === undefined;
    });
  });
};

const findVerticalReflection = (mirror, ignore = undefined) => {
  for (let i = mirror[0].length - 1; i > 0; i--) {
    if (ignore !== undefined && ignore === i) continue;
    if (testForVerticalReflection(mirror, i)) return i;
  }
};

const getMirrorCombinations = (mirror) => {
  const combinations = [];
  const str = mirror.map((line) => line.join('')).join('|');

  let ix = str.indexOf('#', 0);
  while (ix !== -1) {
    combinations.push(str.slice(0, ix) + '.' + str.slice(ix + 1));
    ix = str.indexOf('#', ix + 1);
  }

  ix = str.indexOf('.', 0);
  while (ix !== -1) {
    combinations.push(str.slice(0, ix) + '#' + str.slice(ix + 1));
    ix = str.indexOf('.', ix + 1);
  }
  return combinations.map((combination) =>
    combination.split('|').map((line) => line.split(''))
  );
};

const answers = mirrors.map((mirror) => {
  const origVer = findVerticalReflection(mirror);
  const origHor = findHorizontalReflection(mirror);

  const combinations = getMirrorCombinations(mirror);
  for (let combination of combinations) {
    const horizontal = findHorizontalReflection(combination, origHor);

    if (horizontal && horizontal !== origHor) return [0, horizontal];

    const vertical = findVerticalReflection(combination, origVer);
    if (vertical && vertical !== origVer) return [vertical, 0];
  }
  return [0, 0];
});

const numbers = answers.map(([a, b]) => (a ?? 0) + 100 * (b ?? 0));

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

console.log(
  `What number do you get after summarizing all of your notes? ${sum(numbers)}`
);
