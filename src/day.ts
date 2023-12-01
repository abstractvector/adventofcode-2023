import { resolve } from 'node:path';

const [, , dayChallenge] = process.argv;

const moduleFile = resolve(`src/${dayChallenge}/index.ts`);

await import(moduleFile);
