import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/05/1/example.txt';
const filename = './src/05/1/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the file into sections
const sections = file.split('\n\n').filter(Boolean);

// parse out the seeds
const seeds = sections
  .shift()
  .split(':')[1]
  .split(' ')
  .filter(Boolean)
  .map((n) => parseInt(n, 10));

// initialize the IDs we're going to track
let ids = seeds;

// go through the remaining sections
for (let section of sections) {
  // parse out the mappings
  const mappings = section.split(':')[1].trim().split('\n');

  // map each ID according to the mapping table
  ids = ids.map((id) => {
    let newId = id;

    // check if the mapping applies, and if so, apply it
    mappings.forEach((mapping) => {
      const [destination, source, length] = mapping
        .split(' ')
        .filter(Boolean)
        .map((n) => parseInt(n, 10));

      if (id >= source && id < source + length) {
        newId = destination + id - source;
      }
    });

    return newId;
  });
}

console.log(
  `What is the lowest location number that corresponds to any of the initial seed numbers? ${Math.min(
    ...ids
  )}`
);
