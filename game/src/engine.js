// Little Planet Lunch — engine: state, timers, cooking, serving, streaks.
// One 3-minute shift. Click a bowl to take an ingredient, prep it at its
// station (chop / sear meter / simmer meter), click a plate socket to build,
// Space (or the serving bay) to serve a finished planet.

import { ING, LAYOUT, ORDER_SECONDS, SHIFT_SECONDS, SOCKETS } from './config.js';
import { makeOrder, pickRecipe, planetOf, RECIPE_BY_ID } from './recipes.js';
import { pointInEllipse, pointInRect } from './input.js';

export const PHASE = { TITLE: 'title', PLAY: 'play', OVER: 'over' };

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Game {
  constructor() {
    this.rng = mulberry32((Date.now() % 2147483647) || 7);
    this.phase = PHASE.TITLE;
    this.time = 0; // seconds since shift start (play phase)
    this.shiftLeft = SHIFT_SECONDS;
    this.score = 0;
    this.served = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.burnt = 0;
    this.orders = [];
    this.plate = []; // ingredient ids placed on the build plate
    this.hand = null; // ingredient id carried
    this.stations = {
      chop: { job: null, clicks: 0, need: 2 },
      sear: { job: null, meter: 0, dir: 1, green: [55, 85] },
      simmer: { job: null, meter: 0, dir: 1, green: [40, 80] },
    };
    this.chef = { x: 720, y: 660, tx: 720, ty: 660, dir: 1, walk: 0 };
    this.particles = [];
    this.floaters = []; // {x,y,text,color,life}
    this.serveAnim = 0; // 0..1 progress of the serve swoosh
    this.servedPlanets = []; // recipe ids served (guest planet grows)
    this.tutorial = 0; // seconds of tutorial banner shown
    this.shot = null; // staged screenshot name, set by shots.js
    this.paused = false;
    this.spawnTimer = 0;
    this.lastRecipe = null;
    this.shake = 0;
  }

  start() {
    this.phase = PHASE.PLAY;
    this.time = 0;
    this.shiftLeft = SHIFT_SECONDS;
    this.score = 0;
    this.served = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.burnt = 0;
    this.orders = [];
    this.plate = [];
    this.hand = null;
    this.stations.chop.job = null;
    this.stations.sear.job = null;
    this.stations.simmer.job = null;
    this.particles = [];
    this.floaters = [];
    this.servedPlanets = [];
    this.tutorial = 10;
    this.spawnTimer = 0;
    this.lastRecipe = null;
    for (let i = 0; i < 3; i++) this.spawnOrder();
  }

  spawnOrder() {
    const recipe = pickRecipe(this.rng, this.lastRecipe);
    this.lastRecipe = recipe.id;
    this.orders.push(makeOrder(recipe, ORDER_SECONDS));
  }

  // --- actions -----------------------------------------------------------

  pickIngredient(id) {
    if (this.phase !== PHASE.PLAY || this.paused) return;
    const ing = ING[id];
    if (!ing) return;
    if (this.hand) {
      this.floater(this.chef.x, this.chef.y - 60, 'Tangan penuh!', '#ff8a7a');
      return;
    }
    if (ing.prep === 'chop') {
      if (this.stations.chop.job) return;
      this.stations.chop.job = id;
      this.stations.chop.clicks = 0;
      this.burst(190, 375, '#4ccf8a', 6);
    } else if (ing.prep === 'sear') {
      if (this.stations.sear.job) return;
      this.stations.sear.job = id;
      this.stations.sear.meter = 0;
      this.stations.sear.dir = 1;
    } else if (ing.prep === 'simmer') {
      if (this.stations.simmer.job) return;
      this.stations.simmer.job = id;
      this.stations.simmer.meter = 0;
      this.stations.simmer.dir = 1;
    } else {
      this.hand = id;
    }
  }

  stationClick(kind) {
    if (this.phase !== PHASE.PLAY || this.paused) return;
    const st = this.stations[kind];
    if (!st.job) return;
    if (kind === 'chop') {
      st.clicks += 1;
      this.burst(190, 375, '#ffffff', 4);
      if (st.clicks >= st.need) {
        this.hand = st.job;
        st.job = null;
        this.floater(190, 300, 'Tercincang!', '#4ccf8a');
      }
      return;
    }
    // sear / simmer: stop the meter, green zone wins.
    const [lo, hi] = st.green;
    const ok = st.meter >= lo && st.meter <= hi;
    const id = st.job;
    st.job = null;
    if (ok) {
      this.hand = id;
      this.floater(kind === 'sear' ? 190 : 190, 466, kind === 'sear' ? 'Sear pas!' : 'Kari mendidih!', '#ffd23e');
    } else if (kind === 'sear') {
      this.score = Math.max(0, this.score - 15);
      this.burnt += 1;
      this.shake = 0.35;
      this.floater(190, 466, 'GOSONG! -15', '#ff5252');
      this.burst(190, 540, '#5a4a38', 10);
    } else {
      this.floater(190, 632, 'Belum mendidih — coba lagi', '#ffb020');
      this.stations.simmer.job = id; // retry, no penalty
      this.stations.simmer.meter = 0;
    }
  }

  socketClick(id) {
    if (this.phase !== PHASE.PLAY || this.paused) return;
    if (!this.hand) return;
    if (this.hand !== id) {
      this.floater(LAYOUT.plate.x, LAYOUT.plate.y - 180, 'Bukan di sini', '#ff8a7a');
      return;
    }
    if (this.plate.includes(id)) return;
    this.plate.push(id);
    this.hand = null;
    const s = SOCKETS[id];
    this.burst(LAYOUT.plate.x + s.dx, LAYOUT.plate.y + s.dy, ING[id].color, 10);
    const planet = planetOf(this.plate);
    if (planet) {
      this.floater(LAYOUT.plate.x, LAYOUT.plate.y - 185, `${planet.name.toUpperCase()} SIAP!`, '#ffd23e');
    }
  }

  clearPlate() {
    if (this.phase !== PHASE.PLAY || this.paused) return;
    if (this.plate.length === 0 && !this.hand) return;
    this.plate = [];
    this.hand = null;
  }

  serve() {
    if (this.phase !== PHASE.PLAY || this.paused) return;
    const planet = planetOf(this.plate);
    if (!planet) {
      this.floater(LAYOUT.bay.x + 185, LAYOUT.bay.y + 40, 'Piring belum jadi planet!', '#ff8a7a');
      return;
    }
    const idx = this.orders.findIndex((o) => o.recipe.id === planet.id);
    if (idx === -1) {
      this.floater(LAYOUT.bay.x + 185, LAYOUT.bay.y + 40, 'Tak ada yang pesan planet ini (C = buang)', '#ff8a7a');
      return;
    }
    const order = this.orders[idx];
    this.orders.splice(idx, 1);
    const timeBonus = Math.round(order.remaining);
    const perfect = order.remaining > 35;
    const pts = planet.base + timeBonus + this.streak * 20;
    this.score += pts;
    this.served += 1;
    this.streak += 1;
    this.bestStreak = Math.max(this.bestStreak, this.streak);
    this.servedPlanets.push(planet.id);
    this.serveAnim = 1;
    this.plate = [];
    this.hand = null;
    const bx = LAYOUT.bay.x + 185;
    const by = LAYOUT.bay.y + 120;
    this.burst(bx, by, '#ffd23e', 18);
    this.burst(bx, by, '#4ccf8a', 10);
    this.floaters.push({
      x: bx, y: by - 40,
      text: `${perfect ? 'PERFECT PLANET' : 'PLANET TERKIRIM'} · +${pts}`,
      color: perfect ? '#ffd23e' : '#ffffff', life: 2.2,
    });
    this.spawnOrder();
  }

  // --- per-frame ---------------------------------------------------------

  update(dt, input) {
    this.time += dt;
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt);
    if (this.serveAnim > 0) this.serveAnim = Math.max(0, this.serveAnim - dt * 1.4);
    for (const f of this.floaters) { f.y -= 26 * dt; f.life -= dt; }
    this.floaters = this.floaters.filter((f) => f.life > 0);
    for (const p of this.particles) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy -= 12 * dt; p.life -= dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
    if (Math.random() < dt * 2) {
      this.particles.push({
        x: 190 + (Math.random() - 0.5) * 120, y: 520,
        vx: (Math.random() - 0.5) * 8, vy: -14 - Math.random() * 10,
        r: 2 + Math.random() * 3, color: 'rgba(255,233,184,0.7)', life: 1.4,
      });
    }
    if (this.phase === PHASE.TITLE) {
      if (input.pressed(' ') || input.pressed('enter') || input.clicks.length > 0) this.start();
      input.endFrame();
      return;
    }
    if (this.phase === PHASE.OVER) {
      if (input.pressed('r') || input.clicks.length > 0) this.start();
      input.endFrame();
      return;
    }
    if (this.paused) { input.endFrame(); return; }

    // timers
    this.shiftLeft -= dt;
    if (this.tutorial > 0) this.tutorial -= dt;
    if (this.shiftLeft <= 0) {
      this.shiftLeft = 0;
      this.phase = PHASE.OVER;
      input.endFrame();
      return;
    }
    for (const o of this.orders) o.remaining -= dt;
    const expired = this.orders.filter((o) => o.remaining <= 0);
    if (expired.length > 0) {
      this.orders = this.orders.filter((o) => o.remaining > 0);
      this.streak = 0;
      this.score = Math.max(0, this.score - 25 * expired.length);
      this.floater(LAYOUT.board.x + 185, LAYOUT.board.y + 20, `Order hangus -${25 * expired.length}`, '#ff5252');
      for (let i = 0; i < expired.length; i++) this.spawnOrder();
    }
    // station meters sweep
    for (const kind of ['sear', 'simmer']) {
      const st = this.stations[kind];
      if (!st.job) continue;
      st.meter += st.dir * dt * (kind === 'sear' ? 95 : 70);
      if (st.meter >= 100) { st.meter = 100; st.dir = -1; }
      if (st.meter <= 0) { st.meter = 0; st.dir = 1; }
    }

    // chef movement (WASD / arrows), clamped to the kitchen floor
    const ax = input.axis();
    const speed = 260;
    if (ax.x !== 0 || ax.y !== 0) {
      this.chef.tx = clamp(this.chef.tx + ax.x * speed * dt, 90, 1350);
      this.chef.ty = clamp(this.chef.ty + ax.y * speed * dt, 250, 830);
      this.chef.dir = ax.x !== 0 ? Math.sign(ax.x) : this.chef.dir;
      this.chef.walk += dt * 10;
    }
    this.chef.x += (this.chef.tx - this.chef.x) * Math.min(1, dt * 10);
    this.chef.y += (this.chef.ty - this.chef.y) * Math.min(1, dt * 10);

    // mouse clicks
    for (const c of input.clicks) this.handleClick(c);
    // keyboard shortcuts
    for (const ing of Object.values(ING)) {
      if (input.pressed(ing.key)) this.pickIngredient(ing.id);
    }
    if (input.pressed(' ') || input.pressed('enter')) this.serve();
    if (input.pressed('e')) this.interactNear();
    if (input.pressed('c')) this.clearPlate();
    if (input.pressed('r')) this.start();
    input.endFrame();
  }

  interactNear() {
    // E: use the nearest interactive thing to the chef.
    const { x, y } = this.chef;
    let best = null;
    let bestD = 170;
    const cands = [];
    const bowls = this.bowlRects();
    for (const b of bowls) {
      cands.push({ d: dist(x, y, b.x + b.w / 2, b.y + b.h / 2), fn: () => this.pickIngredient(b.id) });
    }
    cands.push({ d: dist(x, y, 190, 375), fn: () => this.stationClick('chop') });
    cands.push({ d: dist(x, y, 190, 541), fn: () => this.stationClick('sear') });
    cands.push({ d: dist(x, y, 190, 707), fn: () => this.stationClick('simmer') });
    for (const id of Object.keys(SOCKETS)) {
      const s = SOCKETS[id];
      cands.push({ d: dist(x, y, LAYOUT.plate.x + s.dx, LAYOUT.plate.y + s.dy), fn: () => this.socketClick(id) });
    }
    cands.push({ d: dist(x, y, LAYOUT.bay.x + 185, LAYOUT.bay.y + 150), fn: () => this.serve() });
    for (const c of cands) if (c.d < bestD) { bestD = c.d; best = c; }
    if (best) best.fn();
  }

  handleClick(c) {
    // chef walks toward the click
    this.chef.tx = clamp(c.x, 90, 1350);
    this.chef.ty = clamp(c.y, 250, 830);
    // bowls
    for (const b of this.bowlRects()) {
      if (pointInRect(c, b)) { this.pickIngredient(b.id); return; }
    }
    // stations
    if (pointInRect(c, LAYOUT.chop)) { this.stationClick('chop'); return; }
    if (pointInRect(c, LAYOUT.sear)) { this.stationClick('sear'); return; }
    if (pointInRect(c, LAYOUT.simmer)) { this.stationClick('simmer'); return; }
    // plate sockets
    for (const id of Object.keys(SOCKETS)) {
      const s = SOCKETS[id];
      if (pointInEllipse(c, LAYOUT.plate.x + s.dx, LAYOUT.plate.y + s.dy, s.r, s.r * 0.72)) {
        this.socketClick(id);
        return;
      }
    }
    // serving bay
    if (pointInRect(c, LAYOUT.bay)) { this.serve(); return; }
  }

  bowlRects() {
    const { x, y, w, h } = LAYOUT.bowls;
    const bw = w / 6;
    return Object.values(ING).map((ing, i) => ({
      id: ing.id, x: x + i * bw + 6, y, w: bw - 12, h,
    }));
  }

  burst(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * 90;
      this.particles.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 30,
        r: 2 + Math.random() * 3.5, color, life: 0.7 + Math.random() * 0.6,
      });
    }
  }

  floater(x, y, text, color) {
    this.floaters.push({ x, y, text, color, life: 1.8 });
  }

  grade() {
    if (this.score >= 1500) return 'S';
    if (this.score >= 1000) return 'A';
    if (this.score >= 600) return 'B';
    return 'C';
  }
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function dist(x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); }
export { RECIPE_BY_ID };
