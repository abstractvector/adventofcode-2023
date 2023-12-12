import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/12/1/example.txt';
const filename = './src/12/1/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the file into lines
const lines = file.split('\n').filter(Boolean);

const records = lines.map((line) => {
  const [record, entries] = line.split(/\s+/);
  return { record, entries: entries.split(',').map((n) => +n) };
});

const findArrangements = (arrangement, offset, record, entries) => {
  // console.log('findArrangements', { arrangement, offset, record, entries });

  const entry = entries.shift();
  let firstBrokenIndex = record.indexOf('#');
  if (firstBrokenIndex === -1) firstBrokenIndex = record.length - entry;
  const stringToWorkOn = record.slice(0, firstBrokenIndex + entry);

  let candidates = [];

  for (let i = 0; i < stringToWorkOn.length - entry + 1; i++) {
    const start = i;
    const end = i + entry;
    const test = stringToWorkOn.slice(start, end);
    const couldInsertHere = /^[#\?]+$/.test(test);
    if (!couldInsertHere) continue;

    const candidate =
      stringToWorkOn.slice(0, start) +
      '#'.repeat(entry) +
      stringToWorkOn.slice(end) +
      record.slice(firstBrokenIndex + entry);

    if (candidate.match(/#+/)[0].length !== entry) continue;

    const newOffset = candidate.indexOf('#') + entry + 1;
    const newRecord = candidate.slice(newOffset);
    candidates.push([
      arrangement.slice(0, offset) +
        candidate.slice(0, newOffset).replace(/\?/g, '.') +
        newRecord,
      offset + newOffset,
      newRecord,
      [...entries],
    ]);
  }

  return candidates;
};

const countArrangements = (record: string, entries: number[]) => {
  // console.log({ record, entries });

  let candidates: [string, number, string, number[]][] = [
    [record, 0, record, [...entries]],
  ];

  let validArrangements = [];

  // let i = 0;
  while (candidates.length > 0) {
    // if (i++ > 1e2) break;
    const candidate = candidates.shift();

    if (candidate[3].length == 0 && candidate[2].indexOf('#') === -1) {
      validArrangements.push(candidate[0]);
    }

    const newCandidates = findArrangements(
      candidate[0],
      candidate[1],
      candidate[2],
      candidate[3]
    );
    candidates.push(...newCandidates);
    // console.log(newCandidates, candidates.length);
    // console.log('----------');
  }

  return validArrangements.map((a) => a.replace(/\?/g, '.'));

  // if (entries.length > 0) return countArrangements(newRecord, entries, record);
  // return
};

const isValid = (sample: string, record: string, entries: number[]) => {
  if (record.length !== sample.length)
    throw new Error(`Sample length is incorrect`);

  const match = [...sample.matchAll(/(\#+)/g)].map((m) => m[0].length);

  if (entries.length !== match.length)
    throw new Error(`Incorrect number of groups`);

  if (entries.every((e, i) => match[i] !== e))
    throw new Error(`Group sizes don't match`);
};

let sum = 0;
for (let record of records) {
  const arrangements = countArrangements(record.record, record.entries);
  // console.log(record.record, arrangements.length, record.entries);
  // console.log(arrangements);
  arrangements.forEach((a) => isValid(a, record.record, record.entries));
  sum += arrangements.length;
}

console.log(`What is the sum of those counts? ${sum}`);

// const foo = countArrangements(records[5].record, records[5].entries);
// console.log(foo.length);
