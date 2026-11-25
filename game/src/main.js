// Little Planet Lunch — bootstrap + game loop.
// Open game/index.html in desktop Chrome. Add ?shot=hero|cook|served|rush
// for the deterministic staged screenshots used in screenshots/.

import { Game } from './engine.js';
import { Input } from './input.js';
import { render } from './render.js';
import { applyShot } from './shots.js';
import { makeOrder, RECIPE_BY_ID } from './recipes.js';
import { H, W } from './config.js';

const canvas = document.getElementById('game');
canvas.width = W;
canvas.height = H;
const ctx = canvas.getContext('2d');

const game = new Game();
const input = new Input(canvas);

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) {
  // Exact 1440x900 canvas for the staged screenshots (bypasses the
  // responsive CSS width so the capture is pixel-true).
  canvas.style.width = '1440px';
  canvas.style.height = '900px';
  applyShot(game, shot);
}

window.__game = game;

if (params.get('selftest')) {
  // Drive the real handlers end to end (pick -> prep -> build -> serve)
  // and report the result in the document title + a #selftest div, so a
  // headless run can verify the game plays with no console errors.
  setTimeout(() => {
    const log = [];
    const step = (name, fn) => {
      try { fn(); log.push(name + ':ok'); } catch (e) { log.push(name + ':FAIL:' + e.message); }
    };
    game.start();
    game.orders = [makeOrder(RECIPE_BY_ID.kari, 75), makeOrder(RECIPE_BY_ID.tomat, 75), makeOrder(RECIPE_BY_ID.zamrud, 75)];
    step('pick-rice', () => game.pickIngredient('rice'));
    step('place-rice', () => game.socketClick('rice'));
    step('pick-broccoli', () => game.pickIngredient('broccoli'));
    step('chop1', () => game.stationClick('chop'));
    step('chop2', () => game.stationClick('chop'));
    step('place-broccoli', () => game.socketClick('broccoli'));
    step('pick-tomato', () => game.pickIngredient('tomato'));
    game.stations.sear.meter = 70;
    step('sear', () => game.stationClick('sear'));
    step('place-tomato', () => game.socketClick('tomato'));
    step('pick-curry', () => game.pickIngredient('curry'));
    game.stations.simmer.meter = 60;
    step('simmer', () => game.stationClick('simmer'));
    step('place-curry', () => game.socketClick('curry'));
    step('serve', () => game.serve());
    log.push('score=' + game.score + ' served=' + game.served);
    const ok = game.served === 1 && game.score > 0 && !log.some((l) => l.includes('FAIL'));
    document.title = (ok ? 'SELFTEST OK ' : 'SELFTEST FAIL ') + log.join(' | ');
    const div = document.createElement('div');
    div.id = 'selftest';
    div.textContent = document.title;
    document.body.appendChild(div);
  }, 300);
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  game.update(dt, input);
  render(ctx, game, input);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
