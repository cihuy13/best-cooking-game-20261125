// Little Planet Lunch — keyboard + mouse input (no network, no libraries).

export class Input {
  constructor(canvas) {
    this.keys = new Set();
    this.downKeys = new Set(); // edge-triggered, consumed each frame
    this.mouse = { x: -1, y: -1, inside: false };
    this.clicks = []; // {x, y} in canvas coords, consumed each frame
    this.holding = false;

    const toLocal = (e) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) / r.width) * canvas.width,
        y: ((e.clientY - r.top) / r.height) * canvas.height,
      };
    };

    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (!e.repeat) this.downKeys.add(k);
      this.keys.add(k);
    });
    window.addEventListener('keyup', (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      this.keys.delete(k);
    });
    canvas.addEventListener('mousemove', (e) => {
      const p = toLocal(e);
      this.mouse.x = p.x;
      this.mouse.y = p.y;
      this.mouse.inside = true;
    });
    canvas.addEventListener('mouseleave', () => {
      this.mouse.inside = false;
    });
    canvas.addEventListener('mousedown', (e) => {
      this.holding = true;
      const p = toLocal(e);
      this.mouse.x = p.x;
      this.mouse.y = p.y;
      this.clicks.push(p);
    });
    window.addEventListener('mouseup', () => {
      this.holding = false;
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  pressed(key) {
    return this.downKeys.has(key);
  }

  axis() {
    let x = 0;
    let y = 0;
    if (this.keys.has('a') || this.keys.has('ArrowLeft')) x -= 1;
    if (this.keys.has('d') || this.keys.has('ArrowRight')) x += 1;
    if (this.keys.has('w') || this.keys.has('ArrowUp')) y -= 1;
    if (this.keys.has('s') || this.keys.has('ArrowDown')) y += 1;
    return { x, y };
  }

  endFrame() {
    this.downKeys.clear();
    this.clicks.length = 0;
  }
}

export function pointInRect(p, r) {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}

export function pointInEllipse(p, cx, cy, rx, ry) {
  const dx = (p.x - cx) / rx;
  const dy = (p.y - cy) / ry;
  return dx * dx + dy * dy <= 1;
}
