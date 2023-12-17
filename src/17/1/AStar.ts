import { Heap } from 'heap-js';

enum Dir {
  Up,
  Down,
  Left,
  Right,
}

export default class AStar {
  graph: Map<string, number>;

  maxBounds: [number, number]; // rows, cols

  average: number;

  constructor(graph: string) {
    this.graph = new Map(
      graph
        .split('\n')
        .map((line, row) =>
          line
            .split('')
            .map((n, col) => [`${row},${col}`, +n] as [string, number])
        )
        .flat()
    );
    this.maxBounds = [
      graph.split('\n').length - 1,
      graph.split('\n')?.[0].length - 1,
    ];

    this.average =
      graph
        .split('\n')
        .flatMap((line) => line.split('').map((n) => +n))
        .reduce((a, b) => a + b, 0) /
      (this.maxBounds[0] * this.maxBounds[1]);
  }

  search(start: string, goal: string) {
    const cameFrom = new Map<string, string>();

    const startKey = start + '|';

    const scores = new Map<string, number>();
    scores.set(startKey, 0);

    const fScores = new Map<string, number>();
    fScores.set(startKey, this.heuristic(start));

    // let openSet = new Set<string>(); // row,col|arrivalDirection
    // openSet.add(startKey);

    const openSetComparator = (a, b) => fScores.get(a) - fScores.get(b);
    const openSet = new Heap(openSetComparator);
    openSet.init([startKey]);

    const visited = new Map<string, number>();

    let i = 0;
    for (const candidate of openSet) {
      if (i++ % 1e4 === 0) {
        console.log();
        this.heatmap(visited);
        console.log();
        console.log(`Score set size: ${scores.size}`);
        console.log(`fScore set size: ${fScores.size}`);
        console.log(`Candidate set size: ${openSet.length}`);
      }
      const item = candidate.split('|');

      const current = item[0];
      const arrivalDirections = item[1]
        .split(',')
        .filter((n) => n !== '')
        .map((n) => +n);

      if (current === undefined) return;

      visited.set(current, (visited.get(current) ?? 0) + 1);

      const currentKey = `${current}|${arrivalDirections.join(',')}`;

      if (current === goal) {
        const path = this.reconstructPath(cameFrom, currentKey);
        this.printPath(path);
        console.log(`Goal achieved: ${scores.get(currentKey)}`);
        // return;
      }

      // console.log(`Evaluating ${current} (${arrivalDirections.join(', ')})`);

      const neighbors = this.getNeighbors(current);

      // console.log({ current, arrivalDirections, neighbors });

      for (let neighbor of neighbors) {
        const [location, direction] = neighbor;

        if (
          arrivalDirections.length === 3 &&
          arrivalDirections.every((d) => d === direction)
        ) {
          continue;
        }

        if (this.directionsAreOpposite(arrivalDirections[0], direction))
          continue;

        const newDirections = [
          direction,
          arrivalDirections[0],
          arrivalDirections[1],
        ].filter((d) => d !== undefined);

        const locationKey = `${location}|${newDirections.join(',')}`;
        // console.log(`Found eligible neighbor: ${locationKey}`);

        const tentativeScore =
          (scores.get(currentKey) ?? Infinity) + this.getWeight(location);

        if (tentativeScore < (scores.get(locationKey) ?? Infinity)) {
          cameFrom.set(
            locationKey,
            `${current}|${arrivalDirections.join(',')}`
          );

          scores.set(locationKey, tentativeScore);
          fScores.set(locationKey, tentativeScore + this.heuristic(location));

          if (!openSet.contains(locationKey)) openSet.add(locationKey);
        }
      }
    }

    const finalScores = Object.fromEntries(
      [...scores]
        .filter(([s]) => s.startsWith(goal))
        .sort(([, a], [, b]) => a - b)
    );

    if (Object.keys(finalScores).length > 0) {
      const path = this.reconstructPath(cameFrom, Object.keys(finalScores)[0]);

      console.log();
      this.printPath(path);
      console.log();

      const weight = this.getPathWeight(path);
      console.log(`Total heat loss along path: ${weight}`);
    }
    console.log(`End of the road`);
  }

  heuristic(node) {
    const [r, c] = node.split(',').map((n) => +n);
    return (
      this.average *
      Math.sqrt((this.maxBounds[0] - r) ** 2 + (this.maxBounds[1] - c) ** 2)
    );
  }

  directionsAreOpposite(dir1: Dir, dir2: Dir) {
    if (dir1 === Dir.Up && dir2 === Dir.Down) return true;
    if (dir1 === Dir.Down && dir2 === Dir.Up) return true;
    if (dir1 === Dir.Left && dir2 === Dir.Right) return true;
    if (dir1 === Dir.Right && dir2 === Dir.Left) return true;

    return false;
  }

  direction(from: string | undefined, to: string) {
    if (from === undefined) return;

    const [r1, c1] = from.split(',').map((n) => +n);
    const [r2, c2] = to.split(',').map((n) => +n);

    if (r1 > r2 && c1 === c2) return Dir.Up;
    if (r1 < r2 && c1 === c2) return Dir.Down;
    if (r1 === r2 && c1 > c2) return Dir.Left;
    if (r1 === r2 && c1 < c2) return Dir.Right;

    throw new Error(`Could not calculate the direction from ${from} to ${to}`);
  }

  reconstructPath(cameFrom: Map<string, string>, current: string) {
    const path: string[] = [current];
    let node: string = current;
    while ((node = cameFrom.get(node))) {
      path.unshift(node);
    }

    return path.map((p) => p.split('|')[0]);
  }

  printPath(path: string[]) {
    const map = Array.from({ length: this.maxBounds[0] + 1 })
      .map((v1, r) =>
        Array.from({ length: this.maxBounds[1] + 1 })
          .map((v2, c) => (path.includes(`${r},${c}`) ? '#' : '.'))
          .join('')
      )
      .join('\n');

    console.log(map);
  }

  heatmap(visited: Map<string, number>) {
    const max = Math.max(...visited.values());

    const map = Array.from({ length: this.maxBounds[0] + 1 })
      .map((v1, r) =>
        Array.from({ length: this.maxBounds[1] + 1 })
          .map((v2, c) =>
            Math.round((9 * (visited.get(`${r},${c}`) ?? 0)) / max)
          )
          .join('')
      )
      .join('\n');

    console.log(map);
  }

  followPath(path: string[]) {
    let heatLoss = 0;
    path.forEach((node) => {
      console.log({ node, heatLoss: (heatLoss += this.getWeight(node)) });
    });
  }

  getPathWeight(path: string[]) {
    path.shift();
    return path.map((p) => this.getWeight(p)).reduce((a, b) => a + b, 0);
  }

  getWeight(node) {
    return this.graph.get(node);
  }

  getNeighbors(node: string): [string, Dir][] {
    const [row, col] = node.split(',').map((n) => +n);

    return (
      [
        [[row - 1, col], Dir.Up], // up
        [[row + 1, col], Dir.Down], // down
        [[row, col - 1], Dir.Left], // left
        [[row, col + 1], Dir.Right], // right
      ] as [[number, number], Dir][]
    )
      .filter(
        ([[r, c]]) =>
          r >= 0 && r <= this.maxBounds[0] && c >= 0 && c <= this.maxBounds[1]
      )
      .map(([[r, c], dir]) => [`${r},${c}`, dir] as [string, Dir]);
  }
}
