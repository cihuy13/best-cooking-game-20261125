// Little Planet Lunch — config: palette, layout, ingredients.
// Original game by the builder session. Palette discipline: midnight navy,
// butter kitchen light, coral tomato, emerald broccoli, golden curry.

export const W = 1440;
export const H = 900;

export const PAL = {
  navy: '#0d1830',
  navy2: '#12224a',
  wall: '#1b2c52',
  floor: '#2a1e16',
  floorLine: '#3a2a1c',
  wood: '#8a5a33',
  woodLight: '#a9743f',
  woodDark: '#6b4423',
  counter: '#f3e3c2',
  counterEdge: '#d9bd8a',
  butter: '#ffd98a',
  butterSoft: '#ffe9b8',
  cream: '#fff6e0',
  rice: '#fff3d6',
  tomato: '#ff6b57',
  tomatoDark: '#d94a38',
  broccoli: '#2fae6b',
  broccoliLight: '#4ccf8a',
  cheese: '#ffd23e',
  curry: '#f5a623',
  curryDeep: '#e08a00',
  sesame: '#e8d8a8',
  ink: '#241a12',
  inkSoft: '#5a4a38',
  white: '#ffffff',
  red: '#ff5252',
  green: '#37d67a',
  gold: '#ffc93c',
};

export const LAYOUT = {
  // order board (right-top)
  board: { x: 1030, y: 24, w: 370, h: 306 },
  // kitchen clock (top-center)
  clock: { x: 720, y: 82, r: 54 },
  // score panel (top, left of clock)
  score: { x: 520, y: 30, w: 130, h: 100 },
  // steps board (top, right of clock)
  steps: { x: 800, y: 34, w: 196, h: 96 },
  // starry window (top-left)
  window: { x: 40, y: 24, w: 460, h: 150 },
  // guest panel (right, under board)
  guest: { x: 1030, y: 344, w: 370, h: 126 },
  // stations (left column)
  chop: { x: 40, y: 300, w: 300, h: 150 },
  sear: { x: 40, y: 466, w: 300, h: 150 },
  simmer: { x: 40, y: 632, w: 300, h: 150 },
  // build plate (center)
  plate: { x: 720, y: 480, rx: 215, ry: 150 },
  // serving bay (right-bottom)
  bay: { x: 1030, y: 486, w: 370, h: 296 },
  // ingredient bowls (bottom row)
  bowls: { x: 380, y: 700, w: 680, h: 150 },
  // hint bar
  hint: { x: 40, y: 862, w: 1360, h: 28 },
};

// Six ingredients. prep: 'ready' | 'chop' | 'sear' | 'simmer'.
export const INGREDIENTS = [
  { id: 'rice', name: 'Nasi', color: PAL.rice, prep: 'ready', key: '1', blurb: 'gunung' },
  { id: 'broccoli', name: 'Brokoli', color: PAL.broccoli, prep: 'chop', key: '2', blurb: 'hutan' },
  { id: 'tomato', name: 'Tomat', color: PAL.tomato, prep: 'sear', key: '3', blurb: 'pondok' },
  { id: 'cheese', name: 'Keju', color: PAL.cheese, prep: 'ready', key: '4', blurb: 'atap' },
  { id: 'curry', name: 'Kari', color: PAL.curry, prep: 'simmer', key: '5', blurb: 'sungai' },
  { id: 'sesame', name: 'Wijen', color: PAL.sesame, prep: 'ready', key: '6', blurb: 'jalan' },
];

export const ING = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]));

// Plate sockets: where each ingredient lands on the planet plate.
export const SOCKETS = {
  rice: { dx: 0, dy: -58, r: 62, label: 'gunung nasi' },
  broccoli: { dx: -118, dy: 18, r: 52, label: 'hutan brokoli' },
  tomato: { dx: 118, dy: 8, r: 52, label: 'pondok tomat' },
  cheese: { dx: 118, dy: -52, r: 34, label: 'atap keju' },
  curry: { dx: 0, dy: 62, r: 66, label: 'sungai kari' },
  sesame: { dx: -40, dy: 88, r: 40, label: 'jalan wijen' },
};

export const SHIFT_SECONDS = 180;
export const ORDER_SECONDS = 75;
