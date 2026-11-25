// Little Planet Lunch — recipes and orders.
// Three tiny edible planets, each built from the same six ingredients.

import { INGREDIENTS } from './config.js';

export const RECIPES = [
  {
    id: 'kari',
    name: 'Planet Kari',
    sub: 'Sungai Emas',
    parts: ['rice', 'broccoli', 'tomato', 'curry'],
    base: 200,
    color: '#f5a623',
    desc: 'Gunung nasi, hutan brokoli, pondok tomat, sungai kari emas.',
  },
  {
    id: 'tomat',
    name: 'Planet Tomat',
    sub: 'Kebun Korall',
    parts: ['rice', 'tomato', 'cheese', 'sesame'],
    base: 180,
    color: '#ff6b57',
    desc: 'Gunung nasi, pondok tomat beratap keju, jalan wijen.',
  },
  {
    id: 'zamrud',
    name: 'Planet Zamrud',
    sub: 'Hutan Hijau',
    parts: ['rice', 'broccoli', 'cheese', 'curry'],
    base: 190,
    color: '#2fae6b',
    desc: 'Gunung nasi, hutan zamrud, atap keju, sungai kari.',
  },
];

export const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

// The set of parts on a plate decides which planet it is (or none).
export function planetOf(parts) {
  const have = new Set(parts);
  for (const r of RECIPES) {
    if (r.parts.length === have.size && r.parts.every((p) => have.has(p))) return r;
  }
  return null;
}

export function missingParts(recipe, parts) {
  const have = new Set(parts);
  return recipe.parts.filter((p) => !have.has(p));
}

let orderSeq = 0;

export function makeOrder(recipe, seconds) {
  orderSeq += 1;
  return {
    id: orderSeq,
    recipe,
    remaining: seconds,
    total: seconds,
    // mini-planet seed so each card's illustration differs slightly
    seed: (orderSeq * 7919) % 97,
  };
}

// Pick a recipe different from the last one when possible.
export function pickRecipe(rng, avoidId) {
  const pool = RECIPES.filter((r) => r.id !== avoidId);
  return pool[Math.floor(rng() * pool.length)];
}

export function ingredientNames(parts) {
  const byId = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i.name]));
  return parts.map((p) => byId[p]);
}
