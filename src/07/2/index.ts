import { readFile } from 'node:fs/promises';

// path to puzzle input from the elves
// const filename = './src/07/2/example.txt';
const filename = './src/07/2/puzzle-input.txt';

// read the file into a string
const file = await readFile(filename, 'utf-8');

// split the file into lines
const lines = file.split('\n').filter(Boolean);

const cardScores = [
  'J',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'Q',
  'K',
  'A',
];

const getHandType = (cards: string[]) => {
  const cardCount: Record<string, number> = {};
  cards.forEach((card) => {
    if (!cardCount[card]) {
      cardCount[card] = 1;
    } else {
      cardCount[card] += 1;
    }
  });

  const uniqueCards = Object.values(cardCount).sort().reverse().join('');

  if (uniqueCards === '5') return 7; // five of a kind
  if (uniqueCards === '41') return 6; // four of a kind
  if (uniqueCards === '32') return 5; // full house
  if (uniqueCards === '311') return 4; // three of a kind
  if (uniqueCards === '221') return 3; // two pair
  if (uniqueCards === '2111') return 2; // one pair
  if (uniqueCards === '11111') return 1; // high card

  throw new Error(`Unrecognized hand`);
};

const scoreHand = (cards: string[]) => {
  if (!cards.includes('J')) return getHandType(cards);

  const candidates = cardScores.filter((card) => card !== 'J');

  const scores = candidates.map((card) => {
    const newCards = [...cards];
    newCards[cards.indexOf('J')] = card;
    return scoreHand(newCards);
  });

  return Math.max(...scores);
};

const hands = lines
  .map((line) => {
    const match = line.match(/(.+?)\s+(.+)/);

    return {
      cards: match[1].split(''),
      cardStrength: match[1].split('').map((card) => cardScores.indexOf(card)),
      type: scoreHand(match[1].split('')),
      bid: +match[2],
    };
  })
  .sort((a, b) => {
    if (a.type !== b.type) return a.type - b.type;
    for (let i = 0; i < 5; i += 1) {
      if (a.cardStrength[i] !== b.cardStrength[i])
        return a.cardStrength[i] - b.cardStrength[i];
    }
    return 0;
  })
  .map((card, ix) => ({
    ...card,
    rank: ix + 1,
    winnings: card.bid * (ix + 1),
  }));

const winnings = hands.reduce((a, b) => a + b.winnings, 0);

console.log(`What are the new total winnings? ${winnings}`);
