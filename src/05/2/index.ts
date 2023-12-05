import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/05/2/example.txt';
const filename = './src/05/2/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the file into sections
const sections = file.split('\n\n').filter(Boolean);

// parse out the seed ranges
let seedRanges = [
  ...sections
    .shift()
    .split(':')[1]
    .trim()
    .matchAll(/([0-9]+)\s([0-9]+)/g),
].map((s) => [parseInt(s[1], 10), parseInt(s[2], 10)] as [number, number]);

// parse out the maps
const maps = sections.map((section) =>
  section
    .split(':')[1]
    .trim()
    .split('\n')
    .map((map) =>
      map
        .split(' ')
        .filter(Boolean)
        .map((n) => parseInt(n, 10))
    )
);

const reverseMaps = [...maps].reverse();

// map a location back to a seed
const trackLocation = (id: number) => {
  for (let map of reverseMaps) {
    const range = map.find(
      ([source, , length]) => id >= source && id < source + length
    );
    if (range) id = range[1] + id - range[0];
  }
  return id;
};

// check if a seed is valid
const isSeedInRange = (id: number) =>
  seedRanges.some(([from, length]) => id >= from && id < from + length);

// @todo make sure it's a valid location
for (let location = 0; ; location += 1) {
  const seed = trackLocation(location);
  if (isSeedInRange(seed)) {
    console.log(`Found seed ${seed} which will give location ${location}`);
    break;
  }
}
