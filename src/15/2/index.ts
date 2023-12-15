import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/15/2/example.txt';
const filename = './src/15/2/puzzle-input.txt';

// read the file into a string
let file = await readFile(filename, 'utf-8');

const steps = file.split(',');

const hash = (string: string) =>
  string.split('').reduce((a, b) => ((a + b.charCodeAt(0)) * 17) % 256, 0);

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

const lenses = new Map<string, number>(); // maps a lens to a focal length
const boxes = Array.from({ length: 256 }).map((a) => new Set<string>());

const print = () => {
  boxes.forEach((b, i) => {
    if (b.size > 0)
      console.log(
        `Box ${i}: ${[...b].map((l) => `[${l} ${lenses.get(l)}]`).join(' ')}`
      );
  });
  console.log('\n');
};

steps.forEach((step) => {
  const {
    groups: { label, operation, focalLength },
  } = step.match(/^(?<label>[^=-]+)(?<operation>[-=])(?<focalLength>[0-9]*?)$/);

  const box = boxes[hash(label)];

  if (operation === '=') {
    if (!box.has(label)) box.add(label);
    lenses.set(label, +focalLength);
  } else if (operation === '-') {
    box.delete(label);
  }
});

const focusingPower = boxes.flatMap((boxSet, boxNumber) =>
  [...boxSet].map(
    (label, slot) => (1 + boxNumber) * (1 + slot) * lenses.get(label)
  )
);

print();

console.log(
  `What is the focusing power of the resulting lens configuration?`,
  sum(focusingPower)
);
