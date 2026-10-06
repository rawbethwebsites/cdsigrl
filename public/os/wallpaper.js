/* CDS IGRL OS — animated wallpaper engine (GSAP-driven scenes on one canvas) */
(() => {
const C = { navy:'#16130C', green:'#F5C518', mint:'#FBE38A', cream:'#FFF8E6', forest:'#C99A00' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})`; };
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.random() * a.length | 0];
const cv = document.getElementById('wallcv'), ctx = cv.getContext('2d');
cv.classList.add('live');
const label = document.getElementById('wpLabel');
const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
const mobile = () => innerWidth <= 760;
let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0;

const LOGO = new Image(); LOGO.src = 'os/logo-white.svg';

/* Scene backgrounds are photos (public/os/wallpapers), darkened so the animation reads on top. */
const PHOTO_SRC = ['global', 'identity', 'systems', 'delivery', 'momentum'];
const PHOTOS = PHOTO_SRC.map(() => new Image());
PHOTOS[0].src = `os/wallpapers/${PHOTO_SRC[0]}.jpg`;
setTimeout(() => PHOTOS.forEach((im, i) => { if (!im.src) im.src = `os/wallpapers/${PHOTO_SRC[i]}.jpg`; }), 2500);
function photoBg(i, t, dim = .58) {
  ctx.fillStyle = '#000'; ctx.fillRect(-W, -H, W * 3, H * 3);
  const im = PHOTOS[i];
  if (im.complete && im.naturalWidth) {
    const k = Math.max(W / im.naturalWidth, H / im.naturalHeight) * (1.04 + .04 * Math.sin(t * .06));
    const w = im.naturalWidth * k, h = im.naturalHeight * k;
    ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
  }
  ctx.fillStyle = `rgba(0,0,0,${dim})`; ctx.fillRect(-W, -H, W * 3, H * 3);
}

/* ---------------- 1. Globe: spinning wireframe + data arcs ---------------- */
function Globe() {
  const N = 120, P = [], E = [], arcs = [];
  for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = i * 2.39996; P.push([Math.cos(t) * r, y, Math.sin(t) * r]); }
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if (Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1], P[i][2] - P[j][2]) < .36) E.push([i, j]);
  const ct = Math.cos(.38), st = Math.sin(.38);
  let rot = 0, timer = null;
  const proj = ([x, y, z], cr, sr) => { const x1 = x * cr + z * sr, z1 = -x * sr + z * cr; return [cx + x1 * R, cy + (y * ct - z1 * st) * R, y * st + z1 * ct]; };
  const spawn = () => {
    if (arcs.length > 14) return;
    const a = pick(P), b = pick(P); if (a === b) return;
    const arc = { a, b, p: 0, o: 1 }; arcs.push(arc);
    gsap.to(arc, { p: 1, duration: rand(1.4, 2.4), ease: 'power2.inOut' });
    gsap.to(arc, { o: 0, duration: .8, delay: 2.3, onComplete: () => arcs.splice(arcs.indexOf(arc), 1) });
  };
  return {
    name: 'Global Perspective',
    enter() { spawn(); timer = setInterval(spawn, 320); },
    leave() { clearInterval(timer); },
    draw(t, dt) {
      rot += dt * .12;
      photoBg(0, t);
      const cr = Math.cos(rot), sr = Math.sin(rot), Q = P.map(v => proj(v, cr, sr));
      const base = ctx.globalAlpha;
      ctx.lineWidth = 1; ctx.strokeStyle = C.mint;
      for (const [i, j] of E) {
        ctx.globalAlpha = base * (.07 + .33 * ((Q[i][2] + Q[j][2]) / 2 + 1) / 2);
        ctx.beginPath(); ctx.moveTo(Q[i][0], Q[i][1]); ctx.lineTo(Q[j][0], Q[j][1]); ctx.stroke();
      }
      ctx.fillStyle = C.cream;
      for (const q of Q) { ctx.globalAlpha = base * (.2 + .8 * (q[2] + 1) / 2); ctx.fillRect(q[0] - 1.2, q[1] - 1.2, 2.4, 2.4); }
      for (const arc of arcs) {
        const n = 40, m = Math.max(1, Math.round(n * arc.p)), pts = [];
        for (let k = 0; k <= m; k++) {
          const s = k / n, v = [0, 1, 2].map(d => arc.a[d] + (arc.b[d] - arc.a[d]) * s);
          const L = Math.hypot(...v) || 1, lift = 1 + .35 * Math.sin(Math.PI * s);
          pts.push(proj(v.map(c => c / L * lift), cr, sr));
        }
        ctx.globalAlpha = base * arc.o * .9; ctx.strokeStyle = C.green; ctx.lineWidth = 1.6;
        ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
        const h = pts[pts.length - 1];
        ctx.globalAlpha = base * arc.o; ctx.fillStyle = C.mint; ctx.beginPath(); ctx.arc(h[0], h[1], 2.6, 0, 7); ctx.fill();
        const o = pts[0]; ctx.globalAlpha = base * arc.o * (1 - arc.p); ctx.strokeStyle = C.mint; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(o[0], o[1], 3 + arc.p * 16, 0, 7); ctx.stroke();
      }
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.35);
      ctx.globalAlpha = base * .35; ctx.strokeStyle = C.mint; ctx.setLineDash([2, 6]);
      ctx.beginPath(); ctx.ellipse(0, 0, R * 1.45, R * .42, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      for (let k = 0; k < 3; k++) {
        const a = t * .5 + k * 2.1;
        ctx.globalAlpha = base * (Math.sin(a) > 0 ? 1 : .3); ctx.fillStyle = k ? C.mint : C.cream;
        ctx.beginPath(); ctx.arc(Math.cos(a) * R * 1.45, Math.sin(a) * R * .42, 3, 0, 7); ctx.fill();
      }
      ctx.restore(); ctx.globalAlpha = base;
    }
  };
}

/* ---------------- 2. Identity: particles assemble the CDS IGRL mark ---------------- */
function Identity() {
  const parts = [], hud = { o: 0, r: .6 }, st = { loose: 1 };
  let tl = null;
  const build = () => {
    const s = 150, c = document.createElement('canvas'); c.width = c.height = s;
    const x = c.getContext('2d'); x.drawImage(LOGO, 0, 0, s, s);
    let d; try { d = x.getImageData(0, 0, s, s).data; } catch { return; }
    for (let yy = 0; yy < s; yy += 2) for (let xx = 0; xx < s; xx += 2) if (d[(yy * s + xx) * 4 + 3] > 128) {
      const ang = rand(0, 6.283), rad = rand(.75, 1.7);
      const sx = Math.cos(ang) * rad, sy = Math.sin(ang) * rad;
      parts.push({ tx: xx / s - .5, ty: yy / s - .5, sx, sy, x: sx, y: sy, ph: rand(0, 6.28), c: Math.random() < .15 ? C.cream : Math.random() < .5 ? C.mint : C.green });
    }
    parts.sort((a, b) => a.c < b.c ? -1 : 1);
    tl = gsap.timeline({ repeat: -1, paused: true })
      .to(parts, { x: (i, p) => p.tx, y: (i, p) => p.ty, duration: 2.4, ease: 'expo.inOut', stagger: { amount: 1.4, from: 'random' } }, 0)
      .to(st, { loose: 0, duration: 1.4, ease: 'power2.out' }, 1.8)
      .to(hud, { o: 1, r: 1, duration: 1.4, ease: 'power3.out' }, 2.4)
      .to({}, { duration: 3.2 })
      .to(hud, { o: 0, r: 1.25, duration: .7, ease: 'power2.in' })
      .to(st, { loose: 1, duration: .4 }, '<')
      .to(parts, { x: (i, p) => p.sx, y: (i, p) => p.sy, duration: 1.8, ease: 'power4.out', stagger: { amount: .5, from: 'center' } }, '<.2')
      .to({}, { duration: .8 });
  };
  LOGO.complete ? build() : LOGO.addEventListener('load', build);
  return {
    name: 'Institutional Identity',
    enter() { tl && tl.play(); },
    leave() { tl && tl.pause(); },
    draw(t) {
      photoBg(1, t, .64);
      const S = Math.min(W, H) * (mobile() ? .62 : .5), base = ctx.globalAlpha;
      ctx.save(); ctx.translate(cx, cy); ctx.lineWidth = 1; ctx.strokeStyle = C.mint;
      ctx.globalAlpha = base * hud.o * .55; ctx.rotate(t * .2); ctx.setLineDash([3, 9]);
      ctx.beginPath(); ctx.arc(0, 0, S * .78 * hud.r, 0, 7); ctx.stroke();
      ctx.rotate(-t * .5); ctx.setLineDash([60, 24, 4, 24]);
      ctx.beginPath(); ctx.arc(0, 0, S * .9 * hud.r, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      for (let k = 0; k < 4; k++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(S * .95 * hud.r, 0); ctx.lineTo(S * 1.02 * hud.r, 0); ctx.stroke(); }
      ctx.restore();
      ctx.globalAlpha = base * hud.o * .8; ctx.fillStyle = C.cream; ctx.font = '700 11px "JetBrains Mono",monospace'; ctx.textAlign = 'center';
      ctx.fillText('A S T U D I T Y   L I M I T E D', cx, cy + S * .62);
      let col = null;
      for (const p of parts) {
        if (p.c !== col) { col = p.c; ctx.fillStyle = col; }
        const j = st.loose * .025 + .002;
        ctx.globalAlpha = base * (.7 + .3 * Math.sin(t * 2 + p.ph));
        ctx.fillRect(cx + (p.x + Math.sin(t * 1.3 + p.ph) * j) * S, cy + (p.y + Math.cos(t * 1.1 + p.ph) * j) * S, 2.4, 2.4);
      }
      ctx.globalAlpha = base;
    }
  };
}

/* ---------------- 3. Systems: circuit board with data pulses ---------------- */
function Systems() {
  let traces = [], g = 24, chip = 0, timer = null;
  const pulses = [];
  const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const finish = tr => { tr.len = 0; tr.cum = [0]; for (let i = 1; i < tr.pts.length; i++) { tr.len += Math.hypot(tr.pts[i][0] - tr.pts[i - 1][0], tr.pts[i][1] - tr.pts[i - 1][1]); tr.cum.push(tr.len); } tr.flash = 0; return tr; };
  const walk = (x, y, di, nx, ny, maxSteps) => {
    const pts = [[x, y]];
    for (let s = 0; s < maxSteps; s++) {
      const [dx, dy] = DIRS[di], len = g * (2 + (Math.random() * 5 | 0)) / (dx && dy ? Math.SQRT2 : 1) * (dx && dy ? 1 : 1);
      x += dx * len; y += dy * len; pts.push([x, y]);
      if (x < -40 || y < -40 || x > W + 40 || y > H + 40) break;
      if (Math.random() < .6) { const nd = (di + (Math.random() < .5 ? 1 : 7)) % 8; const [ex, ey] = DIRS[nd]; if (ex * nx + ey * ny >= 0) di = nd; }
    }
    return finish({ pts });
  };
  const build = () => {
    g = mobile() ? 18 : 24; chip = g * 6; traces = [];
    [[1, 0, 0], [0, 1, 2], [-1, 0, 4], [0, -1, 6]].forEach(([nx, ny, di]) => {
      for (let k = -2.5; k <= 2.5; k++) traces.push(walk(cx + nx * chip / 2 - ny * k * g * .9, cy + ny * chip / 2 + nx * k * g * .9, di, nx, ny, 40));
    });
    for (let i = 0; i < 26; i++) {
      const di = Math.random() * 8 | 0, [nx, ny] = DIRS[di];
      traces.push(walk(Math.round(rand(0, W) / g) * g, Math.round(rand(0, H) / g) * g, di, nx, ny, 3 + (Math.random() * 4 | 0)));
    }
  };
  const at = (tr, d) => {
    d = Math.max(0, Math.min(tr.len, d)); let i = 1; while (i < tr.cum.length - 1 && tr.cum[i] < d) i++;
    const a = tr.pts[i - 1], b = tr.pts[i], f = (d - tr.cum[i - 1]) / ((tr.cum[i] - tr.cum[i - 1]) || 1);
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  };
  const spawn = () => {
    if (!traces.length || pulses.length > 40) return;
    const tr = pick(traces), p = { tr, d: 0, col: Math.random() < .2 ? C.cream : C.green };
    pulses.push(p);
    gsap.to(p, { d: tr.len, duration: tr.len / rand(240, 520), ease: 'none', onComplete: () => { pulses.splice(pulses.indexOf(p), 1); gsap.fromTo(tr, { flash: 1 }, { flash: 0, duration: .9 }); } });
  };
  return {
    name: 'Integrated Systems',
    resize: build,
    enter() { timer = setInterval(spawn, 90); },
    leave() { clearInterval(timer); },
    draw(t) {
      const base = ctx.globalAlpha;
      photoBg(2, t, .6);
      ctx.fillStyle = C.mint; ctx.globalAlpha = base * .08;
      for (let x = g; x < W; x += g * 2) for (let y = g; y < H; y += g * 2) ctx.fillRect(x, y, 1.5, 1.5);
      ctx.globalAlpha = base * .16; ctx.strokeStyle = C.mint; ctx.lineWidth = 1.2; ctx.beginPath();
      for (const tr of traces) tr.pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
      ctx.stroke();
      for (const tr of traces) {
        const e = tr.pts[tr.pts.length - 1];
        ctx.globalAlpha = base * (.3 + .7 * tr.flash); ctx.strokeStyle = tr.flash > .05 ? C.green : C.mint;
        ctx.beginPath(); ctx.arc(e[0], e[1], 3 + tr.flash * 3, 0, 7); ctx.stroke();
        if (tr.flash > .05) { ctx.globalAlpha = base * tr.flash * .5; ctx.fillStyle = C.green; ctx.fill(); }
      }
      ctx.lineCap = 'round';
      for (const p of pulses) {
        const tail = 70, pts = [at(p.tr, p.d - tail)];
        for (let i = 1; i < p.tr.pts.length - 1; i++) if (p.tr.cum[i] > p.d - tail && p.tr.cum[i] < p.d) pts.push(p.tr.pts[i]);
        pts.push(at(p.tr, p.d));
        for (const [w, a] of [[7, .14], [2.4, .95]]) {
          ctx.globalAlpha = base * a; ctx.strokeStyle = p.col; ctx.lineWidth = w;
          ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke();
        }
        const h = pts[pts.length - 1]; ctx.globalAlpha = base; ctx.fillStyle = C.cream; ctx.fillRect(h[0] - 1.5, h[1] - 1.5, 3, 3);
      }
      ctx.lineCap = 'butt';
      const half = chip / 2, glow = .5 + .5 * Math.sin(t * 2.2);
      ctx.fillStyle = '#0d0b07'; ctx.strokeStyle = rgba(C.mint, .7); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - half, cy - half, chip, chip, 10) : ctx.rect(cx - half, cy - half, chip, chip); ctx.fill(); ctx.stroke();
      if (LOGO.complete) { ctx.globalAlpha = base * (.75 + .25 * glow); ctx.drawImage(LOGO, cx - chip * .28, cy - chip * .28, chip * .56, chip * .56); }
      ctx.globalAlpha = base;
    }
  };
}

/* ---------------- 4. Data: flowing dot terrain with scan line ---------------- */
function Data() {
  const scan = { z: -.1 }, stars = [...Array(90)].map(() => [Math.random(), Math.random(), Math.random()]);
  let tw = null;
  const h = (x, z, t) => .18 * Math.sin(x * 1.6 + t * .8) * Math.cos(z * 6 - t * .6) + .1 * Math.sin(x * 3.1 - z * 9 + t * 1.2) + .06 * Math.sin((x + z * 4) * 5 + t);
  return {
    name: 'Measured Delivery',
    enter() { tw = gsap.fromTo(scan, { z: -.1 }, { z: 1.1, duration: 4.2, ease: 'power1.inOut', repeat: -1, repeatDelay: .6 }); },
    leave() { tw && tw.kill(); },
    draw(t) {
      const base = ctx.globalAlpha, hy = H * .42, mx = W / 2;
      photoBg(3, t, .66);
      ctx.fillStyle = C.cream;
      for (const [x, y, a] of stars) { ctx.globalAlpha = base * a * (.5 + .5 * Math.sin(t * 2 + a * 9)); ctx.fillRect(x * W, y * hy * .95, 1.4, 1.4); }
      const cols = mobile() ? 40 : 72, rows = 44;
      for (let r = rows - 1; r >= 0; r--) {
        const zz = r / (rows - 1), d = .6 + zz * 5, near = Math.max(0, 1 - Math.abs(zz - scan.z) / .05);
        const fade = (1 - zz) * .9 + .1;
        ctx.beginPath();
        const row = [];
        for (let c = 0; c < cols; c++) {
          const x = (c / (cols - 1) - .5) * 4, y = h(x, zz, t);
          const sx = mx + x * W * .35 / d, sy = hy + (.9 - y) * H * .35 / d;
          row.push([sx, sy, y]); c ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
        }
        ctx.globalAlpha = base * (fade * .22 + near * .6); ctx.strokeStyle = near > .1 ? C.cream : C.mint; ctx.lineWidth = .8; ctx.stroke();
        const sz = Math.max(.8, 2.6 / d);
        for (const [sx, sy, y] of row) {
          ctx.globalAlpha = base * Math.min(1, fade * (.45 + y * 2.2) + near);
          ctx.fillStyle = near > .3 ? C.cream : y > .08 ? C.mint : C.green;
          ctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
        }
      }
      ctx.globalAlpha = base;
    }
  };
}

/* ---------------- 5. Momentum: warp-speed hyperdrive ---------------- */
function Momentum() {
  const S = [...Array(560)].map(() => ({ x: rand(-1, 1), y: rand(-1, 1), z: rand(.05, 1), c: pick([C.mint, C.mint, C.green, C.cream]) }));
  const st = { v: .12, glow: 0 }, rings = [];
  const ring = () => { const r = { r: .05, o: .9 }; rings.push(r); gsap.to(r, { r: 1.8, o: 0, duration: 1.8, ease: 'power2.out', onComplete: () => rings.splice(rings.indexOf(r), 1) }); };
  const tl = gsap.timeline({ repeat: -1, paused: true })
    .to(st, { v: .12, duration: 1.6 })
    .to(st, { v: 2.4, duration: 2.6, ease: 'power4.in' })
    .to(st, { glow: 1, duration: .5, ease: 'power2.out' }, '-=.5')
    .call(ring).call(ring, null, '+=.28').call(ring, null, '+=.28')
    .to({}, { duration: 1.4 })
    .to(st, { v: .12, glow: 0, duration: 3, ease: 'power3.out' })
    .to({}, { duration: 1 });
  return {
    name: 'Momentum',
    enter() { tl.play(); },
    leave() { tl.pause(); },
    draw(t, dt) {
      const base = ctx.globalAlpha, f = Math.max(W, H) * .25;
      photoBg(4, t, .5 - .15 * st.glow);
      ctx.lineCap = 'round';
      for (const s of S) {
        s.z -= st.v * dt * .45;
        if (s.z <= .02) { s.z = 1; s.x = rand(-1, 1); s.y = rand(-1, 1); }
        const zt = Math.min(1, s.z + st.v * .07 + .003);
        const x1 = cx + s.x / s.z * f, y1 = cy + s.y / s.z * f, x0 = cx + s.x / zt * f, y0 = cy + s.y / zt * f;
        ctx.globalAlpha = base * Math.min(1, (1 - s.z) * 1.3); ctx.strokeStyle = s.c; ctx.lineWidth = (1 - s.z) * 2.2 + .3;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }
      ctx.lineCap = 'butt'; ctx.strokeStyle = C.mint; ctx.lineWidth = 2;
      for (const r of rings) { ctx.globalAlpha = base * r.o; ctx.beginPath(); ctx.arc(cx, cy, r.r * f * 2, 0, 7); ctx.stroke(); }
      ctx.globalAlpha = base * (.4 + .6 * st.glow); ctx.fillStyle = C.cream; ctx.font = '700 10px "JetBrains Mono",monospace'; ctx.textAlign = 'center';
      ctx.fillText(`PERFORMANCE ${(st.v * 20).toFixed(1)}x`, cx, cy + f * .9);
      ctx.globalAlpha = base;
    }
  };
}

/* ---------------- Engine ---------------- */
const scenes = [Globe(), Identity(), Systems(), Data(), Momentum()];
const DUR = 16, FADE = 3.2;
let cur = 0, next = null, playing = !still, delay = null, barTw = null;
const mix = { v: 0 };

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  cx = W * (mobile() ? .5 : .6); cy = H * (mobile() ? .6 : .54); R = Math.min(W, H) * (mobile() ? .4 : .3);
  scenes.forEach(s => s.resize && s.resize());
  if (still) render(0, 0);
}
function drawScene(s, alpha, scale, t, dt) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.translate(cx, cy); ctx.scale(scale, scale); ctx.translate(-cx, -cy);
  s.draw(t, dt); ctx.restore();
}
function render(t, dt) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawScene(scenes[cur], 1, 1 + .06 * mix.v, t, dt);
  if (next !== null) drawScene(scenes[next], mix.v, 1 + .12 * (1 - mix.v), t, dt);
}
function setLabel(i) {
  label.querySelector('b').textContent = `${String(i + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`;
  label.querySelector('span').textContent = scenes[i].name.toUpperCase();
  gsap.fromTo(label, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
}
function schedule() {
  delay && delay.kill(); barTw && barTw.kill();
  const bar = label.querySelector('i');
  if (!playing) { gsap.set(bar, { scaleX: 0 }); return; }
  barTw = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: DUR, ease: 'none' });
  delay = gsap.delayedCall(DUR, () => go((cur + 1) % scenes.length));
}
function go(i) {
  if (next !== null || i === cur) return;
  next = i; scenes[i].enter && scenes[i].enter(); setLabel(i);
  delay && delay.kill(); barTw && barTw.kill();
  gsap.fromTo(mix, { v: 0 }, { v: 1, duration: FADE, ease: 'sine.inOut', onComplete: () => { scenes[cur].leave && scenes[cur].leave(); cur = next; next = null; mix.v = 0; schedule(); } });
}

addEventListener('resize', resize); resize();
setLabel(0);
if (still) { render(0, 0); }
else {
  scenes[0].enter();
  gsap.ticker.add((time, dms) => render(time, Math.min(dms / 1000, .05)));
  schedule();
}

window.OSWall = {
  next() { go((cur + 1) % scenes.length); },
  go,
  toggle() { playing = !playing; schedule(); return playing; },
  get playing() { return playing; },
};
})();
