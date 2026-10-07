/* CDS IGRL OS — animated wallpaper engine (GSAP-driven measurement scenes on one canvas) */
(() => {
const C = { navy:'#16130C', green:'#F5C518', mint:'#FBE38A', cream:'#FFF8E6', forest:'#C99A00', ink:'#0B0A07' };
const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})`; };
const rand = (a, b) => a + Math.random() * (b - a);
const cv = document.getElementById('wallcv'), ctx = cv.getContext('2d');
cv.classList.add('live');
const label = document.getElementById('wpLabel');
const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
const mobile = () => innerWidth <= 760;
let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0, BA = 1;

/* Scene backgrounds are photos (public/os/wallpapers), darkened so the animation reads on top. */
const PHOTO_SRC = ['trade', 'flow', 'bulk', 'utility', 'calibration'];
const PHOTOS = PHOTO_SRC.map(() => new Image());
PHOTOS[0].src = `os/wallpapers/${PHOTO_SRC[0]}.jpg`;
setTimeout(() => PHOTOS.forEach((im, i) => { if (!im.src) im.src = `os/wallpapers/${PHOTO_SRC[i]}.jpg`; }), 2500);
function photoBg(i, t, dim = .6) {
  ctx.fillStyle = '#000'; ctx.fillRect(-W, -H, W * 3, H * 3);
  const im = PHOTOS[i];
  if (im.complete && im.naturalWidth) {
    const k = Math.max(W / im.naturalWidth, H / im.naturalHeight) * (1.04 + .04 * Math.sin(t * .06));
    const w = im.naturalWidth * k, h = im.naturalHeight * k;
    ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
  }
  ctx.fillStyle = `rgba(0,0,0,${dim})`; ctx.fillRect(-W, -H, W * 3, H * 3);
}

/* ---------------- shared drawing helpers ---------------- */
const al = a => { ctx.globalAlpha = BA * Math.max(0, Math.min(1, a)); };
const fs = k => Math.max(10, Math.min(R * k, 64));
function text(s, x, y, size, col, { align = 'center', weight = 600, mono = true, track = 0 } = {}) {
  ctx.font = `${weight} ${size}px ${mono ? '"JetBrains Mono",monospace' : 'Inter,system-ui,sans-serif'}`;
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = col;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${track}px`;
  ctx.fillText(s, x, y);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
}
function rrect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }
/* Glass instrument readout: small caption, big value, optional status line. */
function readout(x, y, cap, val, o, status = '', so = 0) {
  if (o <= 0) return;
  const w = Math.min(W - 32, fs(.15) * 8.6 + 48), h = fs(.13) * 2.2 + fs(.09) * 1.6;
  al(o * .9); ctx.fillStyle = 'rgba(11,10,7,.78)'; rrect(x - w / 2, y - h / 2, w, h, 12); ctx.fill();
  al(o * .55); ctx.strokeStyle = C.mint; ctx.lineWidth = 1; ctx.stroke();
  al(o * .7); text(cap, x, y - h / 2 + fs(.09) * .95, fs(.075), C.mint, { track: 2.5 });
  al(o); text(val, x, y + fs(.05), fs(.15), C.green, { weight: 600 });
  if (status && so > 0) { al(o * so); text(status, x, y + h / 2 + fs(.085), fs(.072), C.cream, { track: 2 }); }
}
const check = (x, y, s, col) => { ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.5, s * .18); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - s * .45, y); ctx.lineTo(x - s * .1, y + s * .35); ctx.lineTo(x + s * .5, y - s * .4); ctx.stroke(); ctx.lineCap = 'butt'; };

/* ---------------- 1. Fair Trade: a beam balance settles to true ---------------- */
function Trade() {
  const st = { ang: 0 }, goods = { o: 0, d: 1 }, rd = { v: 0, o: 0 }, ok = { o: 0 };
  const wts = [{ o: 0, d: 1, w: .5, h: .2, l: '1 kg' }, { o: 0, d: 1, w: .4, h: .17, l: '1 kg' }, { o: 0, d: 1, w: .28, h: .13, l: '500 g' }];
  const tl = gsap.timeline({ repeat: -1, paused: true })
    .to(rd, { o: 1, duration: .6 })
    .to(goods, { o: 1, duration: .25 }, .2).to(goods, { d: 0, duration: 1, ease: 'bounce.out' }, .2)
    .to(st, { ang: -.3, duration: 1.8, ease: 'elastic.out(1,.32)' }, .8);
  [-.16, -.055, 0].forEach((a, k) => {
    tl.to(wts[k], { o: 1, duration: .2 }, '+=.45').to(wts[k], { d: 0, duration: .85, ease: 'bounce.out' }, '<')
      .to(st, { ang: a, duration: 1.8, ease: 'elastic.out(1,.28)' }, '<.4')
      .to(rd, { v: [1, 2, 2.5][k], duration: 1, ease: 'power3.out' }, '<');
  });
  tl.to(ok, { o: 1, duration: .6 }, '-=.6').to({}, { duration: 2.8 })
    .to([goods, rd, ok, ...wts], { o: 0, duration: .7 })
    .set([goods, ...wts], { d: 1 }).set(st, { ang: 0 }).set(rd, { v: 0 }).to({}, { duration: .4 });
  return {
    name: 'Fair Trade',
    enter() { tl.play(); }, leave() { tl.pause(); },
    draw(t) {
      photoBg(0, t, .7);
      const L = R * (mobile() ? .78 : 1.05), py = cy - R * .55, S = R * .62, pw = R * .6, foot = cy + R * .55;
      /* column + base */
      al(.85); ctx.strokeStyle = C.mint; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, py); ctx.lineTo(cx, foot); ctx.stroke();
      ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - R * .38, foot); ctx.lineTo(cx + R * .38, foot); ctx.stroke(); ctx.lineCap = 'butt';
      /* indicator scale above pivot */
      const ir = R * .26;
      al(.5); ctx.lineWidth = 1.2;
      for (let k = -6; k <= 6; k++) { const a = -Math.PI / 2 + k * .06, l = k % 3 ? 5 : 10; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * ir, py + Math.sin(a) * ir); ctx.lineTo(cx + Math.cos(a) * (ir - l), py + Math.sin(a) * (ir - l)); ctx.stroke(); }
      al(1); ctx.strokeStyle = Math.abs(st.ang) < .004 ? C.green : C.cream; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, py); ctx.lineTo(cx + Math.cos(-Math.PI / 2 + st.ang) * (ir - 2), py + Math.sin(-Math.PI / 2 + st.ang) * (ir - 2)); ctx.stroke();
      /* beam */
      ctx.save(); ctx.translate(cx, py); ctx.rotate(st.ang);
      al(1); ctx.strokeStyle = C.green; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(L, 0); ctx.stroke(); ctx.lineCap = 'butt';
      al(.6); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2;
      for (let k = -9; k <= 9; k++) if (k) { ctx.beginPath(); ctx.moveTo(k * L / 10, -1.5); ctx.lineTo(k * L / 10, 1.5); ctx.stroke(); }
      ctx.restore();
      al(1); ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(cx, py, 6, 0, 7); ctx.fill();
      /* pans */
      [-1, 1].forEach(s => {
        const ex = cx + Math.cos(st.ang) * L * s, ey = py + Math.sin(st.ang) * L * s, pyy = ey + S;
        al(.55); ctx.strokeStyle = C.mint; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - pw / 2, pyy); ctx.moveTo(ex, ey); ctx.lineTo(ex + pw / 2, pyy); ctx.stroke();
        al(.95); ctx.fillStyle = 'rgba(11,10,7,.85)'; ctx.strokeStyle = C.green; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(ex, pyy, pw / 2, pw * .14, 0, 0, Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke();
        al(1); ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, 7); ctx.fill();
        if (s < 0) { /* produce on the left pan */
          const r = pw * .085, rows = [4, 3, 2, 1];
          rows.forEach((n, ri) => { for (let c = 0; c < n; c++) {
            const gx = ex + (c - (n - 1) / 2) * r * 2.05, gy = pyy - r - ri * r * 1.75 - goods.d * H * .6;
            al(goods.o); ctx.fillStyle = (ri + c) % 3 ? C.forest : C.green; ctx.beginPath(); ctx.arc(gx, gy, r, 0, 7); ctx.fill();
            al(goods.o * .6); ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(gx - r * .35, gy - r * .35, r * .22, 0, 7); ctx.fill();
          } });
        } else { /* certified weights on the right pan */
          let sy = pyy;
          wts.forEach(w => {
            const ww = R * w.w, wh = R * w.h, y = sy - wh - w.d * H * .6;
            al(w.o); ctx.fillStyle = C.cream; rrect(ex - ww / 2, y, ww, wh, 4); ctx.fill();
            al(w.o * .8); ctx.fillStyle = C.mint; ctx.fillRect(ex - ww * .18, y - wh * .25, ww * .36, wh * .25);
            al(w.o); text(w.l, ex, y + wh / 2 + 1, Math.max(9, wh * .45), C.ink, { weight: 700 });
            sy -= wh + wh * .25;
          });
        }
      });
      readout(cx, cy - R * 1.28, 'NET WEIGHT', `${rd.v.toFixed(3)} kg`, rd.o, '✓  WITHIN TOLERANCE  ±0.5 g', ok.o);
      al(1);
    }
  };
}

/* ---------------- 2. Fuel & Flow: turbine meter on a live pipeline ---------------- */
function Flow() {
  const st = { rate: 0 }, rd = { l: 0, o: 0 }, ok = { o: 0 };
  let off = 0, rot = 0;
  const tl = gsap.timeline({ repeat: -1, paused: true })
    .to(rd, { o: 1, duration: .6 })
    .to(st, { rate: 1, duration: 1.6, ease: 'power2.in' })
    .to(rd, { l: 50, duration: 6.4, ease: 'power1.inOut' }, '<.2')
    .to(st, { rate: 0, duration: 1.6, ease: 'power2.out' }, '-=1.6')
    .to(ok, { o: 1, duration: .5 }).to({}, { duration: 2.6 })
    .to([rd, ok], { o: 0, duration: .6 }).set(rd, { l: 0 }).to({}, { duration: .5 });
  return {
    name: 'Fuel & Flow',
    enter() { tl.play(); }, leave() { tl.pause(); },
    draw(t, dt) {
      photoBg(1, t, .5);
      const ph = R * .12, mr = R * .42;
      off += st.rate * dt * R * 2.4; rot += st.rate * dt * 16;
      /* pipe */
      al(.55); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-10, cy - ph, W + 20, ph * 2);
      al(.7); ctx.strokeStyle = C.mint; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-10, cy - ph); ctx.lineTo(W + 10, cy - ph); ctx.moveTo(-10, cy + ph); ctx.lineTo(W + 10, cy + ph); ctx.stroke();
      const gap = R * .9;
      al(.5); ctx.fillStyle = C.mint;
      for (let x = ((cx - mr) % gap + gap) % gap; x < W; x += gap) if (Math.abs(x - cx) > mr + 10) ctx.fillRect(x - 3, cy - ph * 1.35, 6, ph * 2.7);
      /* laminar flow: the centre lane runs fastest */
      ctx.lineCap = 'round';
      [[-.55, .7], [0, 1], [.55, .7]].forEach(([lane, sp]) => {
        const y = cy + lane * ph, g = R * .22, o = (off * sp) % g;
        al(.2 + .7 * st.rate); ctx.strokeStyle = sp === 1 ? C.green : C.forest; ctx.lineWidth = sp === 1 ? 3 : 2;
        ctx.beginPath();
        for (let x = o - g; x < W + g; x += g) if (Math.abs(x - cx) > mr) { ctx.moveTo(x, y); ctx.lineTo(x + 4 + g * .45 * st.rate, y); }
        ctx.stroke();
      });
      ctx.lineCap = 'butt';
      /* meter body + turbine */
      al(1); ctx.fillStyle = '#0d0b07'; ctx.strokeStyle = C.green; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, mr, 0, 7); ctx.fill(); ctx.stroke();
      al(.55); ctx.strokeStyle = C.mint; ctx.lineWidth = 1;
      for (let k = 0; k < 48; k++) { const a = k / 48 * 6.283, l = k % 4 ? 4 : 9; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (mr - 6), cy + Math.sin(a) * (mr - 6)); ctx.lineTo(cx + Math.cos(a) * (mr - 6 - l), cy + Math.sin(a) * (mr - 6 - l)); ctx.stroke(); }
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      for (let k = 0; k < 6; k++) {
        ctx.rotate(Math.PI / 3); al(.9); ctx.fillStyle = k % 2 ? C.green : C.forest;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(mr * .35, -mr * .2, mr * .62, -mr * .05); ctx.lineTo(mr * .6, mr * .08); ctx.quadraticCurveTo(mr * .3, mr * .05, 0, 0); ctx.fill();
      }
      ctx.restore();
      al(1); ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(cx, cy, mr * .1, 0, 7); ctx.fill();
      al(.6 + .4 * st.rate); text(`${(st.rate * 120).toFixed(1)} L/min`, cx, cy + mr + fs(.12), fs(.08), C.mint, { track: 1.5 });
      readout(cx, cy - mr - R * .45, 'VOLUME DELIVERED', `${rd.l.toFixed(2).padStart(6, '0')} L`, rd.o, '✓  CALIBRATED  ±0.25%', ok.o);
      al(1);
    }
  };
}

/* ---------------- 3. Weighbridge: a haul truck rolls on, load cells read true ---------------- */
function Bridge() {
  const tr = { p: 0 }, load = { v: 0 }, sus = { y: 0 }, rd = { o: 0 }, ok = { o: 0 };
  const tl = gsap.timeline({ repeat: -1, paused: true })
    .to(rd, { o: 1, duration: .5 })
    .fromTo(tr, { p: 0 }, { p: 1, duration: 3.4, ease: 'power2.out' })
    .to(load, { v: 1, duration: 2, ease: 'power3.out' }, '-=1.9')
    .fromTo(sus, { y: 4 }, { y: 0, duration: 1.4, ease: 'elastic.out(1.2,.25)' }, '-=1')
    .to(ok, { o: 1, duration: .4 }).to({}, { duration: 2.6 })
    .to(ok, { o: 0, duration: .3 })
    .to(tr, { p: 2, duration: 2.8, ease: 'power2.in' })
    .to(load, { v: 0, duration: 1.3, ease: 'power2.in' }, '<.3')
    .to(rd, { o: 0, duration: .5 }).set(tr, { p: 0 }).to({}, { duration: .4 });
  function truck(x, gy, TL, t) {
    const wr = R * .085, ch = gy - wr * 2.1, bh = R * .48, back = x - TL / 2, front = x + TL / 2;
    const spin = x / wr;
    /* dump body */
    al(.95); ctx.fillStyle = 'rgba(11,10,7,.85)'; ctx.strokeStyle = C.green; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(back, ch - bh); ctx.lineTo(back + TL * .66, ch - bh); ctx.lineTo(back + TL * .62, ch); ctx.lineTo(back + TL * .04, ch); ctx.closePath(); ctx.fill(); ctx.stroke();
    al(.35); ctx.strokeStyle = C.mint; ctx.lineWidth = 1;
    for (let k = 1; k < 5; k++) { const xx = back + TL * .66 * k / 5; ctx.beginPath(); ctx.moveTo(xx, ch - bh + 4); ctx.lineTo(xx - TL * .01, ch - 4); ctx.stroke(); }
    /* load of aggregate */
    al(.8); ctx.fillStyle = C.forest; ctx.beginPath(); ctx.moveTo(back + TL * .03, ch - bh);
    for (let k = 0; k <= 8; k++) ctx.lineTo(back + TL * (.03 + .6 * k / 8), ch - bh - R * (.05 + .05 * Math.sin(k * 1.7)));
    ctx.lineTo(back + TL * .63, ch - bh); ctx.fill();
    /* cab */
    al(.95); ctx.fillStyle = 'rgba(11,10,7,.85)'; ctx.strokeStyle = C.green; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(back + TL * .7, ch); ctx.lineTo(back + TL * .7, ch - bh * .95); ctx.lineTo(front - TL * .1, ch - bh * .95); ctx.lineTo(front, ch - bh * .45); ctx.lineTo(front, ch); ctx.closePath(); ctx.fill(); ctx.stroke();
    al(.45); ctx.fillStyle = C.mint; ctx.beginPath(); ctx.moveTo(back + TL * .76, ch - bh * .85); ctx.lineTo(front - TL * .12, ch - bh * .85); ctx.lineTo(front - TL * .04, ch - bh * .5); ctx.lineTo(back + TL * .76, ch - bh * .5); ctx.closePath(); ctx.fill();
    /* headlight */
    const g = ctx.createRadialGradient(front, ch - bh * .25, 0, front, ch - bh * .25, R * .5);
    g.addColorStop(0, rgba(C.mint, .55)); g.addColorStop(1, rgba(C.mint, 0));
    al(.8); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(front, ch - bh * .25); ctx.arc(front, ch - bh * .25, R * .5, -.35, .35); ctx.fill();
    /* wheels */
    [back + TL * .14, back + TL * .32, front - TL * .16].forEach(wx => {
      al(1); ctx.fillStyle = '#0d0b07'; ctx.strokeStyle = C.cream; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(wx, gy - wr, wr, 0, 7); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = C.green; ctx.lineWidth = 1.5;
      for (let k = 0; k < 3; k++) { const a = spin + k * 2.094; ctx.beginPath(); ctx.moveTo(wx, gy - wr); ctx.lineTo(wx + Math.cos(a) * wr * .7, gy - wr + Math.sin(a) * wr * .7); ctx.stroke(); }
    });
  }
  return {
    name: 'Weighbridge',
    enter() { tl.play(); }, leave() { tl.pause(); },
    draw(t) {
      photoBg(2, t, .68);
      const gy = cy + R * .5, half = R * (mobile() ? 1.05 : 1.2), TL = R * (mobile() ? 1.5 : 1.75);
      const x = tr.p < 1 ? -TL + (cx + TL) * tr.p : cx + (W + TL - cx) * (tr.p - 1);
      const defl = load.v * 2.5;
      /* ground */
      al(.35); ctx.strokeStyle = C.mint; ctx.lineWidth = 1; ctx.setLineDash([10, 8]);
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(cx - half, gy); ctx.moveTo(cx + half, gy); ctx.lineTo(W, gy); ctx.stroke(); ctx.setLineDash([]);
      /* platform + load cells */
      al(1); ctx.fillStyle = '#0d0b07'; ctx.strokeStyle = C.green; ctx.lineWidth = 2;
      ctx.fillRect(cx - half, gy + defl, half * 2, R * .07); ctx.strokeRect(cx - half, gy + defl, half * 2, R * .07);
      al(.35); ctx.strokeStyle = C.mint; ctx.lineWidth = 1;
      for (let k = 1; k < 12; k++) { const xx = cx - half + half * 2 * k / 12; ctx.beginPath(); ctx.moveTo(xx, gy + defl + 2); ctx.lineTo(xx, gy + defl + R * .07 - 2); ctx.stroke(); }
      [-.8, -.27, .27, .8].forEach((f, k) => {
        const lx = cx + half * f, ly = gy + defl + R * .07, pulse = (t * 1.6 + k * .25) % 1;
        al(.35 + .65 * load.v); ctx.fillStyle = C.green;
        ctx.beginPath(); ctx.moveTo(lx - 7, ly + 11); ctx.lineTo(lx + 7, ly + 11); ctx.lineTo(lx, ly + 1); ctx.closePath(); ctx.fill();
        if (load.v > .05) { al(load.v * (1 - pulse) * .8); ctx.strokeStyle = C.green; ctx.beginPath(); ctx.arc(lx, ly + 7, 6 + pulse * 18, 0, 7); ctx.stroke(); }
      });
      const onDeck = Math.abs(x - cx) < half;
      truck(x, gy + (onDeck ? defl : 0) - sus.y, TL, t);
      const kg = Math.round(load.v * 42380 + (load.v > .02 && load.v < .995 ? rand(-40, 40) : 0));
      readout(cx, cy - R * 1.12, 'GROSS WEIGHT', `${Math.max(0, kg).toLocaleString('en-US').padStart(6, ' ')} kg`, rd.o, '✓  STABLE  ·  CERTIFIED READING', ok.o);
      al(1);
    }
  };
}

/* ---------------- 4. Utilities: three-phase supply through a smart meter ---------------- */
function Utility() {
  const st = { amp: .25 }, kwh = { v: 1284.6 }, rd = { o: 0 };
  let ph = 0, blink = 0;
  const tl = gsap.timeline({ repeat: -1, paused: true })
    .to(rd, { o: 1, duration: .6 })
    .to(st, { amp: 1, duration: 2.2, ease: 'power2.inOut' }, 0)
    .to(kwh, { v: 1288.4, duration: 9, ease: 'power1.in' }, 0)
    .to(st, { amp: .3, duration: 2.4, ease: 'power2.inOut' }, 6.4)
    .to({}, { duration: 1 })
    .to(rd, { o: 0, duration: .5 }).set(kwh, { v: 1284.6 });
  return {
    name: 'Utilities & Metering',
    enter() { tl.play(); }, leave() { tl.pause(); },
    draw(t, dt) {
      photoBg(3, t, .68);
      ph += dt * 3; blink += dt * st.amp * 5;
      const mw = R * (mobile() ? 1.1 : 1.05), mh = R * 1.35, mx = cx - mw / 2, my = cy - mh / 2;
      /* three-phase waveform, raw on the way in, metered pulses on the way out */
      ctx.lineWidth = 2;
      [C.green, C.mint, C.cream].forEach((col, k) => {
        al(.55 * rd.o + .15); ctx.strokeStyle = col; ctx.beginPath();
        for (let x = -4; x <= mx; x += 5) { const y = cy + Math.sin(x * .014 - ph + k * 2.094) * R * .32 * st.amp; x < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke();
      });
      const step = R * .16, o = (t * R * .5 * st.amp) % step;
      for (let x = mx + mw + o; x < W; x += step) { al((.25 + .6 * st.amp) * (1 - (x - mx - mw) / (W - mx - mw + 1) * .6)); ctx.fillStyle = C.green; ctx.fillRect(x, cy - 3, step * .45, 6); }
      /* meter */
      al(1); ctx.fillStyle = '#0d0b07'; ctx.strokeStyle = C.green; ctx.lineWidth = 2.5;
      rrect(mx, my, mw, mh, 18); ctx.fill(); ctx.stroke();
      al(.75); text('CDS · SMART METER  3Φ', cx, my + mh * .1, fs(.06), C.mint, { track: 2 });
      const lw = mw * .84, lh = mh * .26, lx = cx - lw / 2, ly = my + mh * .18;
      al(1); ctx.fillStyle = '#1a1608'; rrect(lx, ly, lw, lh, 8); ctx.fill();
      al(.5); ctx.strokeStyle = C.mint; ctx.lineWidth = 1; ctx.stroke();
      al(1); text(kwh.v.toFixed(2).padStart(8, '0'), cx - lw * .06, ly + lh / 2, Math.min(lh * .62, lw / 6.2), C.green, { weight: 600 });
      al(.75); text('kWh', lx + lw - 8, ly + lh * .78, fs(.055), C.mint, { align: 'right' });
      const amps = 32 * st.amp + Math.sin(t * 7) * .3;
      [['V', (230 + Math.sin(t * 1.3) * .6).toFixed(1)], ['A', amps.toFixed(1)], ['PF', '0.98']].forEach(([k, v], i) => {
        const yy = ly + lh + mh * .1 + i * mh * .095;
        al(.6); text(k, lx + 4, yy, fs(.07), C.mint, { align: 'left' });
        al(1); text(v, lx + lw - 4, yy, fs(.08), C.cream, { align: 'right' });
      });
      const on = blink % 1 < .14;
      const ledX = lx + 10, ledY = my + mh * .9;
      al(on ? 1 : .25); ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(ledX, ledY, 5, 0, 7); ctx.fill();
      if (on) { al(.35); ctx.beginPath(); ctx.arc(ledX, ledY, 12, 0, 7); ctx.fill(); }
      al(.6); text('IMP  1000/kWh', ledX + 14, ledY, fs(.055), C.mint, { align: 'left' });
      al(1);
    }
  };
}

/* ---------------- 5. Certified Accuracy: test points on a reference gauge, then the stamp ---------------- */
function Calibrate() {
  const st = { v: 0 }, stamp = { o: 0, s: 1.9, r: -.5 }, list = { o: 0 };
  const pts = [25, 50, 75, 100].map((p, i) => ({ p, o: 0, d: ['+0.02', '−0.01', '+0.01', '0.00'][i] }));
  const tl = gsap.timeline({ repeat: -1, paused: true }).to(list, { o: 1, duration: .5 });
  pts.forEach(p => tl.to(st, { v: p.p, duration: 1.5, ease: 'elastic.out(1,.38)' }, '+=.35').to(p, { o: 1, duration: .35 }, '-=.6'));
  tl.to(stamp, { o: 1, s: 1, r: -.14, duration: .45, ease: 'back.out(2.2)' }, '+=.3')
    .to({}, { duration: 2.8 })
    .to([stamp, list, ...pts], { o: 0, duration: .6 })
    .to(st, { v: 0, duration: 1, ease: 'power2.inOut' }, '<')
    .set(stamp, { s: 1.9, r: -.5 }).to({}, { duration: .3 });
  const ang = v => (135 + v / 100 * 270) * Math.PI / 180;
  return {
    name: 'Certified Accuracy',
    enter() { tl.play(); }, leave() { tl.pause(); },
    draw(t) {
      photoBg(4, t, .7);
      const dr = R * .82, gx = mobile() ? cx : cx - R * .55, gy = mobile() ? cy - R * .25 : cy;
      /* dial */
      al(.85); ctx.fillStyle = 'rgba(11,10,7,.82)'; ctx.beginPath(); ctx.arc(gx, gy, dr * 1.12, 0, 7); ctx.fill();
      al(.6); ctx.strokeStyle = C.mint; ctx.lineWidth = 1; ctx.stroke();
      al(.25); ctx.strokeStyle = C.mint; ctx.lineWidth = dr * .06; ctx.beginPath(); ctx.arc(gx, gy, dr * .93, ang(0), ang(100)); ctx.stroke();
      al(1); ctx.strokeStyle = C.green; ctx.beginPath(); ctx.arc(gx, gy, dr * .93, ang(0), ang(Math.max(.01, st.v))); ctx.stroke();
      for (let k = 0; k <= 50; k++) {
        const a = ang(k * 2), major = k % 5 === 0, l = major ? dr * .14 : dr * .07;
        al(major ? .9 : .45); ctx.strokeStyle = C.cream; ctx.lineWidth = major ? 2 : 1;
        ctx.beginPath(); ctx.moveTo(gx + Math.cos(a) * dr * .84, gy + Math.sin(a) * dr * .84); ctx.lineTo(gx + Math.cos(a) * (dr * .84 - l), gy + Math.sin(a) * (dr * .84 - l)); ctx.stroke();
        if (major) { al(.75); text(String(k * 2), gx + Math.cos(a) * dr * .58, gy + Math.sin(a) * dr * .58, fs(.07), C.mint); }
      }
      pts.forEach(p => { const a = ang(p.p); al(.4 + .6 * p.o); ctx.fillStyle = p.o > .5 ? C.green : C.mint; ctx.beginPath(); ctx.arc(gx + Math.cos(a) * dr * 1.04, gy + Math.sin(a) * dr * 1.04, 4, 0, 7); ctx.fill(); });
      /* needle */
      const a = ang(st.v);
      al(1); ctx.fillStyle = C.cream;
      ctx.beginPath(); ctx.moveTo(gx + Math.cos(a) * dr * .8, gy + Math.sin(a) * dr * .8);
      ctx.lineTo(gx + Math.cos(a + 1.57) * 5, gy + Math.sin(a + 1.57) * 5); ctx.lineTo(gx - Math.cos(a) * dr * .16, gy - Math.sin(a) * dr * .16);
      ctx.lineTo(gx + Math.cos(a - 1.57) * 5, gy + Math.sin(a - 1.57) * 5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(gx, gy, 9, 0, 7); ctx.fill();
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(gx, gy, 3.5, 0, 7); ctx.fill();
      al(1); text(`${st.v.toFixed(2)}%`, gx, gy + dr * .7, fs(.1), C.green);
      al(.6); text('REFERENCE  FS', gx, gy + dr * .88, fs(.05), C.mint, { track: 2 });
      /* test-point log */
      const lf = fs(.06), lx = mobile() ? cx - lf * 8 : gx + dr * 1.3, ly0 = mobile() ? gy + dr * 1.3 : gy - dr * .75, rowH = lf * 1.9;
      al(list.o * .7); text('CALIBRATION LOG', lx, ly0, lf * .85, C.mint, { align: 'left', track: 2.5 });
      pts.forEach((p, i) => {
        const yy = ly0 + rowH * (i + 1);
        al(p.o); text(`TP${i + 1}  ${String(p.p).padStart(3, ' ')}%`, lx, yy, lf, C.cream, { align: 'left' });
        text(`Δ ${p.d}%`, lx + lf * 7.6, yy, lf, C.mint, { align: 'left' });
        check(lx + lf * 13.4, yy, lf * 1.1, C.green);
      });
      /* verification stamp */
      if (stamp.o > 0) {
        const sr = R * (mobile() ? .3 : .34), sx = mobile() ? gx + dr * .78 : lx + sr * 1.15, sy = mobile() ? gy - dr * .95 : gy + dr * .55;
        ctx.save(); ctx.translate(sx, sy); ctx.rotate(stamp.r); ctx.scale(stamp.s, stamp.s);
        al(stamp.o * .92); ctx.strokeStyle = C.green; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, sr, 0, 7); ctx.stroke();
        ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, 0, sr * .84, 0, 7); ctx.stroke();
        text('VERIFIED', 0, 0, sr * .3, C.green, { weight: 800, mono: false, track: 1 });
        text('CDS IGRL', 0, -sr * .42, sr * .14, C.green, { weight: 700, track: 2 });
        text('LEGAL METROLOGY', 0, sr * .42, sr * .11, C.green, { weight: 700, track: 1.5 });
        ctx.restore();
      }
      al(1);
    }
  };
}

/* ---------------- Engine ---------------- */
const scenes = [Trade(), Flow(), Bridge(), Utility(), Calibrate()];
const DUR = 16, FADE = 2.4;
let cur = 0, next = null, playing = !still, delay = null, barTw = null;
const mix = { v: 0 };

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  cx = W * (mobile() ? .5 : .45); cy = H * (mobile() ? .6 : .54); R = Math.min(W, H) * (mobile() ? .36 : .3);
  scenes.forEach(s => s.resize && s.resize());
  if (still) render(0, 0);
}
function drawScene(s, alpha, scale, t, dt) {
  ctx.save(); ctx.globalAlpha = BA = alpha;
  ctx.translate(cx, cy); ctx.scale(scale, scale); ctx.translate(-cx, -cy);
  s.draw(t, dt); ctx.restore();
}
function render(t, dt) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawScene(scenes[cur], 1, 1 + .05 * mix.v, t, dt);
  if (next !== null) drawScene(scenes[next], mix.v, 1 + .08 * (1 - mix.v), t, dt);
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
