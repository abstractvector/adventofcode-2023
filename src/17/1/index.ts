import { readFile } from 'node:fs/promises';

import AStar from './AStar.js';

// path to puzzle input from the elves
// const filename = './src/17/1/example.txt';
const filename = './src/17/1/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

const astar = new AStar(file);

astar.search('0,0', astar.maxBounds.join(','));
