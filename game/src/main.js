// Little Planet Lunch — bootstrap + game loop.
// Open game/index.html in desktop Chrome. Add ?shot=hero|cook|served|rush
// for the deterministic staged screenshots used in screenshots/.

import { Game } from './engine.js';
import { Input } from './input.js';
import { render } from './render.js';
import { applyShot } from './shots.js';
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

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  game.update(dt, input);
  render(ctx, game, input);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
