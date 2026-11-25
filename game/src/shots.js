// Little Planet Lunch — staged screenshots (?shot=hero|cook|served|rush).
// Deterministic scenes: fixed orders, timers and plate state, gameplay
// paused so the frame is identical on every render.

import { LAYOUT } from './config.js';
import { makeOrder, RECIPE_BY_ID } from './recipes.js';
import { PHASE } from './engine.js';

function base(game) {
  game.start();
  game.phase = PHASE.PLAY;
  game.tutorial = 0;
  game.paused = true;
  game.shot = true;
}

function setOrders(game, specs) {
  game.orders = specs.map(([id, remaining]) => makeOrder(RECIPE_BY_ID[id], 75));
  game.orders.forEach((o, i) => { o.remaining = specs[i][1]; });
}

function arcParticles(game, cx, cy, rx, ry, color, n, life) {
  for (let i = 0; i < n; i++) {
    const a = Math.PI + (i / Math.max(1, n - 1)) * Math.PI;
    game.particles.push({
      x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry,
      vx: 0, vy: 0, r: 5 + Math.random() * 5, color, life,
    });
  }
}

export function applyShot(game, name) {
  base(game);
  if (name === 'hero') {
    game.shiftLeft = 102; // 01:42 on the kitchen clock
    game.score = 480;
    game.served = 2;
    game.streak = 1;
    game.servedPlanets = ['kari'];
    setOrders(game, [['kari', 48], ['tomat', 62], ['zamrud', 30]]);
    game.plate = ['rice', 'broccoli']; // mountain + forest, river channel empty
    game.hand = 'curry'; // sauce in hand, about to pour the river
    game.chef.tx = 640;
    game.chef.ty = 660;
    game.chef.x = 640;
    game.chef.y = 660;
  } else if (name === 'cook') {
    game.shiftLeft = 88;
    game.score = 320;
    game.served = 1;
    game.streak = 0;
    game.servedPlanets = ['tomat'];
    setOrders(game, [['kari', 40], ['tomat', 55], ['zamrud', 70]]);
    game.plate = ['rice']; // mountain only, river channel clearly empty
    game.hand = 'tomato';
    game.stations.sear.job = 'tomato';
    game.stations.sear.meter = 68; // inside the green zone
    // three tomato halves tossing through an orange flame arc
    arcParticles(game, 190, 560, 90, 70, '#ff7a1a', 12, 30);
    arcParticles(game, 190, 560, 70, 52, '#ff6b57', 8, 30);
    arcParticles(game, 190, 560, 46, 34, '#ffc93c', 6, 30);
    game.floaters.push({ x: 190, y: 282, text: 'SEAR! lepas di hijau', color: '#ffd23e', life: 999 });
  } else if (name === 'served') {
    game.shiftLeft = 74;
    game.score = 960;
    game.served = 4;
    game.streak = 3;
    game.bestStreak = 3;
    game.servedPlanets = ['tomat', 'kari'];
    setOrders(game, [['zamrud', 58], ['tomat', 44], ['kari', 66]]);
    game.plate = ['rice', 'broccoli', 'tomato']; // one plate still unfinished
    game.hand = null;
    game.floaters.push({
      x: LAYOUT.bay.x + 185, y: LAYOUT.bay.y + 205,
      text: 'PERFECT PLANET · +240', color: '#ffd23e', life: 999,
    });
  } else if (name === 'rush') {
    game.shiftLeft = 18; // 00:18 — controlled rush
    game.score = 1240;
    game.served = 6;
    game.streak = 3;
    game.bestStreak = 4;
    game.servedPlanets = ['kari', 'tomat', 'zamrud'];
    setOrders(game, [['kari', 12], ['tomat', 45]]);
    game.plate = ['rice', 'broccoli', 'tomato']; // one pour away from done
    game.hand = 'curry';
    // golden sauce pouring in an arc toward the plate
    arcParticles(game, 720, 480, 150, 60, '#f5a623', 12, 30);
    game.floaters.push({
      x: LAYOUT.bay.x + 185, y: LAYOUT.bay.y + 205,
      text: '3× SERVICE STREAK', color: '#ff7a1a', life: 999,
    });
  } else {
    // unknown shot name: plain live kitchen
    game.paused = false;
    game.shot = null;
  }
  return game;
}
