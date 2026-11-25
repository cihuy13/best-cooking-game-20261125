// Little Planet Lunch — render: every pixel is drawn in code, no assets.
// Palette discipline: midnight navy, butter light, coral tomato, emerald
// broccoli, golden curry. Signature silhouette: round planet plate + thin
// orbit ring, readable even as a thumbnail.

import { ING, LAYOUT, PAL, SOCKETS, W } from './config.js';
import { planetOf } from './recipes.js';
import { PHASE } from './engine.js';

export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

function text(ctx, s, x, y, size, color, weight = 700, align = 'center') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "Trebuchet MS", Verdana, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

function star(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.lineTo(x + Math.cos(a + Math.PI / 4) * r * 0.32, y + Math.sin(a + Math.PI / 4) * r * 0.32);
  }
  ctx.closePath();
  ctx.fill();
}

// --- the signature: a tiny edible planet on a plate ----------------------

export function drawPlanet(ctx, cx, cy, r, parts, opts = {}) {
  const has = (p) => parts.includes(p);
  const shine = opts.shine !== false;
  // plate
  ellipse(ctx, cx, cy + r * 0.12, r * 1.12, r * 0.78);
  ctx.fillStyle = opts.plateColor || '#f7ead0';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#d9bd8a';
  ctx.stroke();
  // orbit ring — the silhouette that reads at thumbnail size
  ctx.beginPath();
  ctx.ellipse(cx, cy, r * 1.42, r * 0.5, -0.22, 0, Math.PI * 2);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = opts.orbitColor || 'rgba(255,217,138,0.9)';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + r * 1.28, cy - r * 0.34, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd98a';
  ctx.fill();

  if (has('curry')) {
    // golden river, glossy
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.95, cy + r * 0.28);
    ctx.bezierCurveTo(cx - r * 0.4, cy + r * 0.02, cx + r * 0.1, cy + r * 0.52, cx + r * 0.95, cy + r * 0.22);
    ctx.bezierCurveTo(cx + r * 0.5, cy + r * 0.62, cx - r * 0.4, cy + r * 0.66, cx - r * 0.95, cy + r * 0.28);
    ctx.closePath();
    ctx.fillStyle = '#f5a623';
    ctx.fill();
    if (shine) {
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.7, cy + r * 0.3);
      ctx.bezierCurveTo(cx - r * 0.3, cy + r * 0.18, cx + r * 0.2, cy + r * 0.44, cx + r * 0.6, cy + r * 0.3);
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.stroke();
    }
  }
  if (has('sesame')) {
    // sesame stone path
    ctx.fillStyle = '#e8d8a8';
    const path = [[-0.62, 0.52], [-0.34, 0.62], [-0.05, 0.55], [0.24, 0.64], [0.5, 0.56]];
    for (const [px, py] of path) {
      ellipse(ctx, cx + px * r, cy + py * r, r * 0.09, r * 0.055);
      ctx.fill();
    }
  }
  if (has('rice')) {
    // fluffy rice mountain
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.52, cy + r * 0.1);
    ctx.quadraticCurveTo(cx - r * 0.3, cy - r * 0.85, cx, cy - r * 0.92);
    ctx.quadraticCurveTo(cx + r * 0.3, cy - r * 0.85, cx + r * 0.52, cy + r * 0.1);
    ctx.closePath();
    ctx.fillStyle = '#fff3d6';
    ctx.fill();
    ctx.fillStyle = 'rgba(190,160,110,0.55)';
    for (let i = 0; i < 9; i++) {
      const a = -0.9 + i * 0.22;
      ellipse(ctx, cx + Math.sin(a) * r * 0.3, cy - r * 0.62 + Math.abs(Math.cos(a)) * r * 0.28, 2.4, 2.4);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.92, r * 0.09, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd23e';
    ctx.fill();
  }
  if (has('broccoli')) {
    // emerald forest: three broccoli puffs
    const trees = [[-0.68, 0.05, 0.3], [-0.42, 0.22, 0.24], [-0.78, 0.3, 0.2]];
    for (const [tx, ty, tr] of trees) {
      const bx = cx + tx * r;
      const by = cy + ty * r;
      ctx.strokeStyle = '#1e7a45';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(bx, by + tr * r * 0.9);
      ctx.lineTo(bx, by + tr * r * 0.2);
      ctx.stroke();
      for (const [ox, oy, orr] of [[0, -0.1, 0.62], [-0.5, 0.12, 0.45], [0.5, 0.12, 0.45]]) {
        ctx.beginPath();
        ctx.arc(bx + ox * tr * r, by + oy * tr * r, orr * tr * r, 0, Math.PI * 2);
        ctx.fillStyle = '#2fae6b';
        ctx.fill();
      }
      ctx.fillStyle = '#4ccf8a';
      ctx.beginPath();
      ctx.arc(bx - tr * r * 0.25, by - tr * r * 0.28, tr * r * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (has('tomato')) {
    // tomato cottage with cheese roof
    const tx = cx + r * 0.62;
    const ty = cy + r * 0.08;
    ctx.beginPath();
    ctx.arc(tx, ty, r * 0.3, Math.PI, 0);
    ctx.closePath();
    ctx.fillStyle = '#ff6b57';
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ellipse(ctx, tx - r * 0.1, ty - r * 0.16, r * 0.07, r * 0.1);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(tx - r * 0.36, ty - r * 0.02);
    ctx.lineTo(tx, ty - r * 0.42);
    ctx.lineTo(tx + r * 0.36, ty - r * 0.02);
    ctx.closePath();
    ctx.fillStyle = '#ffd23e';
    ctx.fill();
    rr(ctx, tx - r * 0.06, ty + r * 0.06, r * 0.12, r * 0.16, 2);
    ctx.fillStyle = '#6b4423';
    ctx.fill();
  }
  if (has('cheese') && !has('tomato')) {
    // cheese wedge when there is no cottage to roof
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.55, cy + r * 0.3);
    ctx.lineTo(cx + r * 0.95, cy - r * 0.05);
    ctx.lineTo(cx + r * 0.95, cy + r * 0.3);
    ctx.closePath();
    ctx.fillStyle = '#ffd23e';
    ctx.fill();
    ctx.fillStyle = '#e8a800';
    for (const [hx, hy] of [[0.72, 0.16], [0.84, 0.05], [0.8, 0.22]]) {
      ctx.beginPath();
      ctx.arc(cx + hx * r, cy + hy * r, r * 0.045, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// --- scene pieces ----------------------------------------------------------

function drawWindow(ctx, t) {
  const { x, y, w, h } = LAYOUT.window;
  rr(ctx, x, y, w, h, 14);
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, '#0a1230');
  g.addColorStop(1, '#1d3a6e');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = PAL.woodDark;
  ctx.stroke();
  // stars
  const stars = [[60, 40, 3], [150, 30, 2], [240, 55, 3], [330, 28, 2], [410, 60, 3], [110, 90, 2], [290, 100, 2], [380, 110, 2], [200, 120, 2]];
  for (const [sx, sy, sr] of stars) star(ctx, x + sx, y + sy, sr + Math.sin(t * 2 + sx) * 0.7, '#ffe9b8');
  // moon
  ctx.beginPath();
  ctx.arc(x + 400, y + 42, 24, 0, Math.PI * 2);
  ctx.fillStyle = '#fff3d6';
  ctx.fill();
  ctx.fillStyle = 'rgba(200,180,140,0.6)';
  ctx.beginPath();
  ctx.arc(x + 392, y + 36, 5, 0, Math.PI * 2);
  ctx.arc(x + 408, y + 50, 4, 0, Math.PI * 2);
  ctx.fill();
  // hills
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.quadraticCurveTo(x + w * 0.3, y + h - 46, x + w * 0.6, y + h - 18);
  ctx.quadraticCurveTo(x + w * 0.85, y + h - 34, x + w, y + h - 8);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fillStyle = '#0e1f42';
  ctx.fill();
  text(ctx, 'LITTLE PLANET LUNCH', x + 8, y + h + 22, 21, PAL.butter, 800, 'left');
  text(ctx, 'dapur planet kecil · masak, rakit, sajikan', x + 8, y + h + 44, 12, 'rgba(255,233,184,0.75)', 400, 'left');
}

function drawClock(ctx, game) {
  const { x, y, r } = LAYOUT.clock;
  // physical kitchen clock
  ctx.beginPath();
  ctx.arc(x, y, r + 8, 0, Math.PI * 2);
  ctx.fillStyle = '#f7ead0';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = PAL.woodDark;
  ctx.stroke();
  const frac = game.shiftLeft / 180;
  ctx.beginPath();
  ctx.arc(x, y, r - 6, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
  ctx.lineWidth = 7;
  ctx.strokeStyle = game.shiftLeft <= 20 ? PAL.red : PAL.curry;
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (r - 12), y + Math.sin(a) * (r - 12));
    ctx.lineTo(x + Math.cos(a) * (r - 4), y + Math.sin(a) * (r - 4));
    ctx.lineWidth = i % 3 === 0 ? 3 : 1.5;
    ctx.strokeStyle = PAL.ink;
    ctx.stroke();
  }
  const handA = -Math.PI / 2 + frac * Math.PI * 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(handA) * (r - 16), y + Math.sin(handA) * (r - 16));
  ctx.lineWidth = 3;
  ctx.strokeStyle = PAL.tomato;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fillStyle = PAL.ink;
  ctx.fill();
  const mm = String(Math.floor(game.shiftLeft / 60)).padStart(2, '0');
  const ss = String(Math.floor(game.shiftLeft % 60)).padStart(2, '0');
  text(ctx, `${mm}:${ss}`, x, y + r + 24, 22, game.shiftLeft <= 20 ? '#ff8a7a' : PAL.butter, 800);
}

function drawScore(ctx, game) {
  const { x, y, w, h } = LAYOUT.score;
  rr(ctx, x, y, w, h, 12);
  ctx.fillStyle = 'rgba(255,246,224,0.08)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,217,138,0.35)';
  ctx.stroke();
  text(ctx, 'SKOR', x + w / 2, y + 18, 12, PAL.butter, 700);
  text(ctx, String(game.score).padStart(4, '0'), x + w / 2, y + 46, 26, '#ffffff', 800);
  text(ctx, `TERSAJI ${game.served} · STREAK ${game.streak}×`, x + w / 2, y + 78, 12, '#ffe9b8', 600);
}

function drawSteps(ctx) {
  const { x, y, w, h } = LAYOUT.steps;
  rr(ctx, x, y, w, h, 12);
  ctx.fillStyle = 'rgba(255,246,224,0.08)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,217,138,0.35)';
  ctx.stroke();
  text(ctx, 'SEAR → BUILD → SERVE', x + w / 2, y + 26, 15, PAL.butter, 800);
  text(ctx, 'cincang · sear · rakit', x + w / 2, y + 52, 12, '#ffe9b8', 400);
  text(ctx, 'Spasi = sajikan · C = buang', x + w / 2, y + 74, 11, 'rgba(255,233,184,0.65)', 400);
}

function drawOrders(ctx, game) {
  const { x, y, w } = LAYOUT.board;
  text(ctx, 'PAPAN ORDER', x + 8, y - 2, 13, PAL.butter, 800, 'left');
  game.orders.slice(0, 3).forEach((o, i) => {
    const cy = y + 14 + i * 98;
    const ch = 90;
    rr(ctx, x, cy, w, ch, 12);
    const urgent = o.remaining <= 15;
    ctx.fillStyle = urgent ? 'rgba(255,82,82,0.16)' : 'rgba(255,246,224,0.08)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = urgent ? 'rgba(255,82,82,0.7)' : 'rgba(255,217,138,0.35)';
    ctx.stroke();
    drawPlanet(ctx, x + 48, cy + 48, 26, o.recipe.parts, { orbitColor: 'rgba(255,217,138,0.6)' });
    text(ctx, o.recipe.name.toUpperCase(), x + 96, cy + 20, 16, '#ffffff', 800, 'left');
    text(ctx, o.recipe.sub, x + 96, cy + 40, 11, '#ffe9b8', 400, 'left');
    const names = { rice: 'Nasi', broccoli: 'Brokoli', tomato: 'Tomat', cheese: 'Keju', curry: 'Kari', sesame: 'Wijen' };
    o.recipe.parts.forEach((p, j) => {
      const done = game.plate.includes(p);
      const px = x + 100 + j * 60;
      text(ctx, `${done ? '✓' : '○'} ${names[p]}`, px, cy + 66, 11, done ? '#4ccf8a' : '#ffe9b8', done ? 800 : 400, 'left');
    });
    // timer ring on the card
    const rx = x + w - 34;
    const ry = cy + 28;
    ctx.beginPath();
    ctx.arc(rx, ry, 20, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(rx, ry, 20, -Math.PI / 2, -Math.PI / 2 + (o.remaining / o.total) * Math.PI * 2);
    ctx.strokeStyle = urgent ? PAL.red : PAL.gold;
    ctx.stroke();
    text(ctx, String(Math.ceil(o.remaining)), rx, ry, 14, '#ffffff', 800);
  });
}

function drawGuest(ctx, game) {
  const { x, y, w, h } = LAYOUT.guest;
  rr(ctx, x, y, w, h, 12);
  ctx.fillStyle = 'rgba(255,246,224,0.08)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,217,138,0.35)';
  ctx.stroke();
  text(ctx, 'TAMU: BULAN TANDUS → PLANET MAKANAN', x + 14, y + 18, 12, PAL.butter, 800, 'left');
  // barren moon
  ctx.beginPath();
  ctx.arc(x + 52, y + 74, 30, 0, Math.PI * 2);
  ctx.fillStyle = '#8d97ad';
  ctx.fill();
  ctx.fillStyle = '#6d7689';
  ctx.beginPath();
  ctx.arc(x + 42, y + 66, 6, 0, Math.PI * 2);
  ctx.arc(x + 62, y + 82, 5, 0, Math.PI * 2);
  ctx.fill();
  text(ctx, 'sebelum', x + 52, y + h - 12, 10, '#ffe9b8', 400);
  text(ctx, '→', x + 118, y + 74, 26, PAL.butter, 800);
  // the guest's planet grows with every served dish
  const n = Math.min(game.servedPlanets.length, 3);
  const parts = n === 0 ? ['rice'] : n === 1 ? ['rice', 'broccoli'] : n === 2 ? ['rice', 'broccoli', 'tomato'] : ['rice', 'broccoli', 'tomato', 'curry'];
  drawPlanet(ctx, x + 200, y + 74, 34, parts);
  text(ctx, n === 0 ? 'belum ada' : `${n} planet terkirim`, x + 200, y + h - 12, 10, '#ffe9b8', 400);
  text(ctx, 'Tamu Luna', x + 310, y + 52, 14, '#ffffff', 700, 'left');
  text(ctx, '“Buatkan aku', x + 310, y + 72, 11, '#ffe9b8', 400, 'left');
  text(ctx, 'dunia yang bisa', x + 310, y + 88, 11, '#ffe9b8', 400, 'left');
  text(ctx, 'dimakan!”', x + 310, y + 104, 11, '#ffe9b8', 400, 'left');
}

function drawStation(ctx, game, kind, rect, title, sub) {
  rr(ctx, rect.x, rect.y, rect.w, rect.h, 12);
  ctx.fillStyle = 'rgba(255,246,224,0.07)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,217,138,0.3)';
  ctx.stroke();
  text(ctx, title, rect.x + 16, rect.y + 18, 13, PAL.butter, 800, 'left');
  text(ctx, sub, rect.x + 16, rect.y + 38, 11, '#ffe9b8', 400, 'left');
  const st = game.stations[kind];
  if (kind === 'chop') {
    // cutting board + knife + chopped bits
    rr(ctx, rect.x + 30, rect.y + 56, 150, 76, 8);
    ctx.fillStyle = PAL.woodLight;
    ctx.fill();
    ctx.strokeStyle = PAL.woodDark;
    ctx.lineWidth = 2;
    ctx.stroke();
    if (st.job) {
      const ing = ING[st.job];
      ctx.fillStyle = ing.color;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(rect.x + 70 + i * 36, rect.y + 96, 12, 0, Math.PI * 2);
        ctx.fill();
      }
      text(ctx, `Cincang! ${st.clicks}/${st.need} klik`, rect.x + 200, rect.y + 96, 13, '#ffffff', 700, 'left');
    } else {
      text(ctx, 'Brokoli ke sini', rect.x + 200, rect.y + 96, 13, 'rgba(255,233,184,0.7)', 400, 'left');
    }
  } else {
    // pan / pot with meter
    const cx = rect.x + 105;
    const cy = rect.y + 96;
    if (kind === 'sear') {
      // flames
      ctx.fillStyle = '#ff7a1a';
      ctx.beginPath();
      ctx.moveTo(cx - 52, cy + 22);
      ctx.quadraticCurveTo(cx - 30, cy - 26, cx, cy + 8);
      ctx.quadraticCurveTo(cx + 30, cy - 26, cx + 52, cy + 22);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffc93c';
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy + 22);
      ctx.quadraticCurveTo(cx - 12, cy - 8, cx, cy + 14);
      ctx.quadraticCurveTo(cx + 12, cy - 8, cx + 30, cy + 22);
      ctx.closePath();
      ctx.fill();
    }
    ellipse(ctx, cx, cy, 62, 20);
    ctx.fillStyle = kind === 'sear' ? '#3a3f4a' : '#8a5a33';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1c1f26';
    ctx.stroke();
    if (st.job) {
      const ing = ING[st.job];
      ctx.fillStyle = ing.color;
      ctx.beginPath();
      ctx.arc(cx - 18, cy - 6, 12, 0, Math.PI * 2);
      ctx.arc(cx + 18, cy - 6, 12, 0, Math.PI * 2);
      ctx.fill();
    }
    // meter bar with green zone
    const mx = rect.x + 190;
    const mw = 92;
    const my = rect.y + 66;
    rr(ctx, mx, my, mw, 16, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fill();
    const [lo, hi] = st.green;
    rr(ctx, mx + (lo / 100) * mw, my, ((hi - lo) / 100) * mw, 16, 4);
    ctx.fillStyle = '#37d67a';
    ctx.fill();
    if (st.job) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(mx + (st.meter / 100) * mw - 2, my - 4, 4, 24);
    }
    text(ctx, st.job ? 'KLIK saat di hijau!' : kind === 'sear' ? 'Tomat ke sini' : 'Kari ke sini', mx + mw / 2, my + 40, 12, '#ffffff', 700);
  }
}

function drawPlate(ctx, game, t) {
  const { x, y, rx, ry } = LAYOUT.plate;
  // table shadow + orbit ring
  ellipse(ctx, x, y + ry * 0.86, rx * 1.06, ry * 0.42);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x, y, rx * 1.3, ry * 0.92, -0.12, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,217,138,0.45)';
  ctx.stroke();
  // the plate itself: draw placed parts as a planet
  const planet = planetOf(game.plate);
  drawPlanet(ctx, x, y, 132, game.plate, {
    plateColor: planet ? '#f7ead0' : '#efe2c4',
    orbitColor: planet ? '#ffd98a' : 'rgba(255,217,138,0.4)',
  });
  // empty sockets (dashed) for missing parts of the oldest order
  const target = game.orders[0];
  const want = target ? target.recipe.parts : [];
  for (const id of Object.keys(SOCKETS)) {
    if (game.plate.includes(id)) continue;
    const s = SOCKETS[id];
    const sx = x + s.dx;
    const sy = y + s.dy;
    ctx.beginPath();
    ctx.ellipse(sx, sy, s.r * 0.62, s.r * 0.44, 0, 0, Math.PI * 2);
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = want.includes(id) ? 'rgba(255,217,138,0.85)' : 'rgba(255,255,255,0.3)';
    ctx.stroke();
    ctx.setLineDash([]);
    if (want.includes(id)) {
      text(ctx, ING[id].name, sx, sy, 12, '#ffe9b8', 700);
    }
  }
  // river channel hint when curry is missing but the rest is there
  if (game.plate.includes('rice') && !game.plate.includes('curry') && want.includes('curry')) {
    ctx.beginPath();
    ctx.moveTo(x - 120, y + 42);
    ctx.bezierCurveTo(x - 50, y + 18, x + 40, y + 66, x + 120, y + 34);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(245,166,35,0.8)';
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
    text(ctx, 'sungai kari kosong — tuang Kari!', x, y + 108, 13, '#ffb020', 700);
  }
  if (planet) {
    const pulse = 1 + Math.sin(t * 5) * 0.03;
    ctx.save();
    ctx.translate(x, y - 168);
    ctx.scale(pulse, pulse);
    rr(ctx, -118, -20, 236, 40, 20);
    ctx.fillStyle = 'rgba(13,24,48,0.85)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffd23e';
    ctx.stroke();
    text(ctx, `✦ ${planet.name.toUpperCase()} SIAP — SPASI! ✦`, 0, 0, 15, '#ffd23e', 800);
    ctx.restore();
  }
  if (game.hand) {
    text(ctx, `Di tangan: ${ING[game.hand].name} → klik socket ${ING[game.hand].blurb}`, W / 2, 222, 13, '#ffffff', 700);
  }
}

function drawBowls(ctx, game, input) {
  const { x, y, w, h } = LAYOUT.bowls;
  text(ctx, 'COUNTER BAHAN — klik mangkuk atau tekan 1–6', x, y - 12, 12, PAL.butter, 800, 'left');
  rr(ctx, x - 14, y, w + 28, h, 14);
  ctx.fillStyle = PAL.wood;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = PAL.woodDark;
  ctx.stroke();
  const bw = w / 6;
  Object.values(ING).forEach((ing, i) => {
    const bx = x + i * bw + bw / 2;
    const by = y + 62;
    const hover = input.mouse.inside && Math.hypot(input.mouse.x - bx, input.mouse.y - by) < 46;
    // bowl
    ctx.beginPath();
    ctx.arc(bx, by, hover ? 46 : 42, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#f7ead0';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = hover ? '#ffd23e' : '#d9bd8a';
    ctx.stroke();
    // ingredient visual
    ctx.fillStyle = ing.color;
    if (ing.id === 'rice') {
      ctx.beginPath();
      ctx.arc(bx, by - 8, 26, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(190,160,110,0.6)';
      for (let d = 0; d < 6; d++) {
        ctx.beginPath();
        ctx.arc(bx - 16 + d * 6, by - 14 - (d % 2) * 6, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (ing.id === 'broccoli') {
      for (const [ox, oy] of [[-14, -6], [0, -14], [14, -6]]) {
        ctx.beginPath();
        ctx.arc(bx + ox, by + oy, 12, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (ing.id === 'tomato') {
      ctx.beginPath();
      ctx.arc(bx - 10, by - 8, 13, 0, Math.PI * 2);
      ctx.arc(bx + 12, by - 6, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2fae6b';
      ctx.beginPath();
      ctx.arc(bx, by - 22, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (ing.id === 'cheese') {
      ctx.beginPath();
      ctx.moveTo(bx - 22, by + 2);
      ctx.lineTo(bx + 22, by - 16);
      ctx.lineTo(bx + 22, by + 2);
      ctx.closePath();
      ctx.fill();
    } else if (ing.id === 'curry') {
      ctx.beginPath();
      ctx.ellipse(bx, by - 6, 26, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.ellipse(bx - 8, by - 8, 10, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#e8d8a8';
      for (let d = 0; d < 7; d++) {
        ellipse(ctx, bx - 18 + (d % 4) * 12, by - 16 + Math.floor(d / 4) * 10, 4, 2.6);
        ctx.fill();
      }
    }
    text(ctx, ing.name, bx, y + 108, 14, '#ffffff', 800);
    text(ctx, `${ing.blurb} · [${ing.key}]`, bx, y + 128, 11, '#ffe9b8', 400);
    const prepLabel = { ready: 'siap', chop: 'cincang', sear: 'sear', simmer: 'didih' }[ing.prep];
    text(ctx, prepLabel, bx, y + h - 12, 10, 'rgba(255,233,184,0.6)', 400);
  });
}

function drawBay(ctx, game, t) {
  const { x, y, w, h } = LAYOUT.bay;
  rr(ctx, x, y, w, h, 14);
  ctx.fillStyle = 'rgba(255,246,224,0.07)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,217,138,0.4)';
  ctx.stroke();
  // orbit lamp cone
  const lampX = x + w / 2;
  const g = ctx.createLinearGradient(lampX, y, lampX, y + 190);
  g.addColorStop(0, 'rgba(255,217,138,0.35)');
  g.addColorStop(1, 'rgba(255,217,138,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(lampX - 26, y + 8);
  ctx.lineTo(lampX + 26, y + 8);
  ctx.lineTo(lampX + 120, y + 190);
  ctx.lineTo(lampX - 120, y + 190);
  ctx.closePath();
  ctx.fill();
  // lamp
  rr(ctx, lampX - 34, y + 2, 68, 16, 8);
  ctx.fillStyle = '#ffd98a';
  ctx.fill();
  text(ctx, 'SERVING BAY', lampX, y + 34, 13, PAL.butter, 800);
  // last served planet on display, or the ready plate preview
  const planet = planetOf(game.plate);
  const showId = game.servedPlanets[game.servedPlanets.length - 1];
  if (planet) {
    drawPlanet(ctx, lampX, y + 128, 62, game.plate);
    text(ctx, 'SIAP DISAJIKAN!', lampX, y + 208, 15, '#4ccf8a', 800);
  } else if (showId) {
    const r = { kari: ['rice', 'broccoli', 'tomato', 'curry'], tomat: ['rice', 'tomato', 'cheese', 'sesame'], zamrud: ['rice', 'broccoli', 'cheese', 'curry'] }[showId];
    drawPlanet(ctx, lampX, y + 128, 62, r);
    text(ctx, 'Planet terakhir terkirim ✓', lampX, y + 208, 13, '#ffe9b8', 400);
  } else {
    ellipse(ctx, lampX, y + 128, 70, 26);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();
    text(ctx, 'Sajikan planet pertamamu!', lampX, y + 128, 13, '#ffe9b8', 400);
  }
  // serve button
  const ready = !!planet;
  rr(ctx, x + 40, y + h - 66, w - 80, 44, 22);
  ctx.fillStyle = ready ? '#2fae6b' : 'rgba(255,255,255,0.12)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = ready ? '#4ccf8a' : 'rgba(255,255,255,0.25)';
  ctx.stroke();
  text(ctx, ready ? '🍽  SAJIKAN — SPASI / KLIK' : 'SAJIKAN — SPASI / KLIK', lampX, y + h - 44, 15, ready ? '#ffffff' : 'rgba(255,255,255,0.5)', 800);
  if (game.streak >= 2) {
    rr(ctx, x + w - 150, y + 44, 132, 30, 15);
    ctx.fillStyle = '#ff7a1a';
    ctx.fill();
    text(ctx, `${game.streak}× SERVICE STREAK`, x + w - 84, y + 59, 12, '#ffffff', 800);
  }
}

function drawChef(ctx, game, input) {
  const { x, y, dir, walk } = game.chef;
  const bob = Math.sin(walk) * 2;
  // shadow
  ellipse(ctx, x, y + 26, 26, 8);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fill();
  // body (apron)
  rr(ctx, x - 16, y - 6 + bob, 32, 30, 10);
  ctx.fillStyle = '#f7ead0';
  ctx.fill();
  ctx.strokeStyle = PAL.woodDark;
  ctx.lineWidth = 2;
  ctx.stroke();
  // head
  ctx.beginPath();
  ctx.arc(x, y - 18 + bob, 13, 0, Math.PI * 2);
  ctx.fillStyle = '#ffcf9e';
  ctx.fill();
  // chef hat
  ctx.beginPath();
  ctx.arc(x, y - 30 + bob, 12, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  rr(ctx, x - 13, y - 32 + bob, 26, 6, 3);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  // eyes
  ctx.fillStyle = PAL.ink;
  ctx.beginPath();
  ctx.arc(x - 5 + dir * 2, y - 18 + bob, 1.8, 0, Math.PI * 2);
  ctx.arc(x + 5 + dir * 2, y - 18 + bob, 1.8, 0, Math.PI * 2);
  ctx.fill();
  // carried ingredient
  if (game.hand) {
    ctx.beginPath();
    ctx.arc(x + dir * 24, y - 2 + bob, 11, 0, Math.PI * 2);
    ctx.fillStyle = ING[game.hand].color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }
}

function drawParticles(ctx, game) {
  for (const p of game.particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawFloaters(ctx, game) {
  for (const f of game.floaters) {
    ctx.globalAlpha = Math.max(0, Math.min(1, f.life));
    text(ctx, f.text, f.x, f.y, 20, f.color, 800);
    ctx.globalAlpha = 1;
  }
}

function drawHint(ctx, game) {
  const { x, y, w, h } = LAYOUT.hint;
  rr(ctx, x, y, w, h, 10);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();
  text(ctx, 'WASD / panah gerak · klik mangkuk, stasiun & socket · 1–6 ambil bahan · E pakai yang dekat · Spasi sajikan · C buang piring · R restart', x + w / 2, y + h / 2, 13, '#ffe9b8', 400);
}

// --- overlays ----------------------------------------------------------------

function drawTitle(ctx, game) {
  ctx.fillStyle = 'rgba(13,24,48,0.72)';
  ctx.fillRect(0, 0, W, 900);
  text(ctx, 'LITTLE PLANET LUNCH', W / 2, 300, 64, PAL.butter, 800);
  text(ctx, 'Dapur yang memasak dunia mini yang bisa dimakan', W / 2, 350, 22, '#ffffff', 400);
  text(ctx, 'Gunung nasi · hutan brokoli · pondok tomat · sungai kari emas', W / 2, 382, 17, '#ffe9b8', 400);
  drawPlanet(ctx, W / 2, 520, 110, ['rice', 'broccoli', 'tomato', 'curry']);
  text(ctx, 'Shift 3 menit · 3 resep · 6 bahan · 3 stasiun', W / 2, 668, 17, '#ffffff', 600);
  text(ctx, 'Klik mangkuk → cincang / sear / didihkan → klik socket piring → Spasi untuk sajikan', W / 2, 698, 15, '#ffe9b8', 400);
  const blink = 0.6 + Math.sin(game.time * 4) * 0.4;
  ctx.globalAlpha = blink;
  rr(ctx, W / 2 - 190, 740, 380, 52, 26);
  ctx.fillStyle = '#2fae6b';
  ctx.fill();
  text(ctx, '▶  MULAI MEMASAK', W / 2, 766, 20, '#ffffff', 800);
  ctx.globalAlpha = 1;
}

function drawOver(ctx, game) {
  ctx.fillStyle = 'rgba(13,24,48,0.78)';
  ctx.fillRect(0, 0, W, 900);
  text(ctx, 'SHIFT SELESAI!', W / 2, 250, 54, PAL.butter, 800);
  text(ctx, `Skor akhir  ${game.score}`, W / 2, 330, 30, '#ffffff', 800);
  text(ctx, `Planet tersaji ${game.served} · streak terbaik ${game.bestStreak}× · gosong ${game.burnt}`, W / 2, 380, 18, '#ffe9b8', 400);
  const g = game.grade();
  text(ctx, `GRADE ${g}`, W / 2, 470, 64, g === 'S' ? '#ffd23e' : '#ffffff', 800);
  text(ctx, g === 'S' ? 'Koki Planet Legendaris!' : g === 'A' ? 'Dapurmu bersinar!' : 'Tamu masih lapar — coba lagi!', W / 2, 520, 17, '#ffe9b8', 400);
  drawPlanet(ctx, W / 2, 640, 80, ['rice', 'broccoli', 'tomato', 'curry']);
  const blink = 0.6 + Math.sin(game.time * 4) * 0.4;
  ctx.globalAlpha = blink;
  text(ctx, 'Tekan R atau klik untuk main lagi', W / 2, 790, 18, '#ffffff', 700);
  ctx.globalAlpha = 1;
}

function drawTutorial(ctx, game) {
  if (game.tutorial <= 0 || game.phase !== PHASE.PLAY) return;
  const a = Math.min(1, game.tutorial);
  ctx.globalAlpha = a;
  rr(ctx, W / 2 - 330, 150, 660, 54, 16);
  ctx.fillStyle = 'rgba(13,24,48,0.9)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffd23e';
  ctx.stroke();
  text(ctx, 'TUTORIAL — klik mangkuk Nasi, lalu klik socket “gunung nasi” di piring!', W / 2, 178, 16, '#ffffff', 700);
  ctx.globalAlpha = 1;
}

// --- main render -------------------------------------------------------------

export function render(ctx, game, input) {
  ctx.save();
  if (game.shake > 0) {
    ctx.translate((Math.random() - 0.5) * game.shake * 22, (Math.random() - 0.5) * game.shake * 22);
  }
  // kitchen backdrop
  ctx.fillStyle = PAL.navy;
  ctx.fillRect(-20, -20, W + 40, 940);
  const wall = ctx.createLinearGradient(0, 0, 0, 300);
  wall.addColorStop(0, '#16264e');
  wall.addColorStop(1, '#0d1830');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, 300);
  // warm floor
  ctx.fillStyle = PAL.floor;
  ctx.fillRect(0, 640, W, 260);
  ctx.fillStyle = PAL.floorLine;
  for (let fx = 0; fx < W; fx += 90) ctx.fillRect(fx, 640, 2, 260);
  for (let fy = 640; fy < 900; fy += 64) ctx.fillRect(0, fy, W, 2);
  // butter light wash from the top
  const light = ctx.createRadialGradient(720, 60, 40, 720, 60, 900);
  light.addColorStop(0, 'rgba(255,217,138,0.14)');
  light.addColorStop(1, 'rgba(255,217,138,0)');
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, W, 900);

  drawWindow(ctx, game.time);
  drawScore(ctx, game);
  drawClock(ctx, game);
  drawSteps(ctx);
  drawOrders(ctx, game);
  drawGuest(ctx, game);
  drawStation(ctx, game, 'chop', LAYOUT.chop, '1 · CHOP — TALENAN', 'Brokoli: klik 2× sampai tercincang');
  drawStation(ctx, game, 'sear', LAYOUT.sear, '2 · SEAR — WAJAN API', 'Tomat: klik saat meter di zona hijau');
  drawStation(ctx, game, 'simmer', LAYOUT.simmer, '3 · SIMMER — PANCi KARI', 'Kari: klik saat mendidih di zona hijau');
  drawPlate(ctx, game, game.time);
  drawBowls(ctx, game, input);
  drawBay(ctx, game, game.time);
  drawChef(ctx, game, input);
  drawParticles(ctx, game);
  drawFloaters(ctx, game);
  drawHint(ctx, game);
  drawTutorial(ctx, game);

  if (game.phase === PHASE.TITLE) drawTitle(ctx, game);
  if (game.phase === PHASE.OVER) drawOver(ctx, game);
  ctx.restore();
}
