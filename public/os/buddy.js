/* Ceedee: the CDS IGRL mark brought to life. Hops around the page, settles in the corner, and opens a chat.
   Self-contained: works on the OS homepage (public/index.html) and the React pages (app.html). */
(() => {
if (window.__cdsBuddy) return; window.__cdsBuddy = true;

const SIZE = 64;
const OS = () => typeof window.openApp === 'function';
const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
const mobile = () => innerWidth <= 760;
const rand = (a, b) => a + Math.random() * (b - a);
const store = { get: k => { try { return sessionStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch {} } };

/* ---------------- look ---------------- */
const css = `
.cdsb{position:fixed;inset:0;pointer-events:none;z-index:6000;font-family:Inter,system-ui,-apple-system,sans-serif}
.cdsb *{box-sizing:border-box}
.cdsb-shadow{position:absolute;left:0;top:0;width:${SIZE}px;height:12px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.45),transparent);will-change:transform}
.cdsb-orb{position:absolute;left:0;top:0;opacity:0;width:${SIZE}px;height:${SIZE}px;pointer-events:auto;cursor:pointer;border:0;padding:0;background:none;will-change:transform;-webkit-tap-highlight-color:transparent}
.cdsb-orb:focus-visible{outline:2px solid #18C25A;outline-offset:4px;border-radius:50%}
.cdsb-body{position:absolute;inset:0;transform-origin:50% 100%}
.cdsb-breath{position:absolute;inset:0}
.cdsb-aura{position:absolute;inset:-14px;border-radius:50%;background:radial-gradient(closest-side,rgba(24,194,90,.55),rgba(24,194,90,.12) 60%,transparent);filter:blur(2px)}
.cdsb-orb svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.cdsb-badge{position:absolute;top:-2px;right:-2px;width:16px;height:16px;border-radius:50%;background:#18C25A;color:#07131F;font:800 10px/16px Inter,sans-serif;text-align:center;box-shadow:0 0 0 2px #07131F;transform:scale(0)}
.cdsb-tease{position:absolute;max-width:250px;padding:12px 14px 12px;border-radius:16px 16px 4px 16px;background:rgba(12,30,48,.96);color:#EEF4F8;font-size:13.5px;line-height:1.45;box-shadow:0 18px 50px -12px rgba(0,0,0,.7),0 0 0 1px rgba(143,240,181,.18);pointer-events:none;transform-origin:100% 100%;opacity:0;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.cdsb-tease b{color:#8FF0B5}
.cdsb-tease .row{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.cdsb-chip{font:600 12px Inter,sans-serif;padding:7px 11px;border-radius:999px;border:1px solid rgba(143,240,181,.35);background:transparent;color:#8FF0B5;cursor:pointer;transition:background .15s,color .15s}
.cdsb-chip:hover,.cdsb-chip.pri{background:#18C25A;border-color:#18C25A;color:#07131F}
.cdsb-x{position:absolute;top:6px;right:8px;width:22px;height:22px;border:0;background:none;color:rgba(238,244,248,.55);font-size:16px;line-height:1;cursor:pointer;border-radius:6px}
.cdsb-x:hover{color:#EEF4F8;background:rgba(238,244,248,.08)}
.cdsb-panel{position:absolute;display:flex;flex-direction:column;border-radius:20px;overflow:hidden;background:rgba(7,19,31,.97);color:#EEF4F8;box-shadow:0 30px 80px -20px rgba(0,0,0,.8),0 0 0 1px rgba(143,240,181,.16);pointer-events:auto;transform-origin:100% 100%;opacity:0;visibility:hidden;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
.cdsb-head{display:flex;align-items:center;gap:11px;padding:14px 14px 12px;border-bottom:1px solid rgba(238,244,248,.08);background:linear-gradient(180deg,rgba(24,194,90,.10),transparent)}
.cdsb-head svg{width:38px;height:38px;flex:none}
.cdsb-head b{display:block;font-size:14.5px;font-weight:800;letter-spacing:-.01em}
.cdsb-head small{display:flex;align-items:center;gap:6px;font-size:11.5px;color:rgba(238,244,248,.62)}
.cdsb-head small i{width:7px;height:7px;border-radius:50%;background:#18C25A;box-shadow:0 0 8px #18C25A;animation:cdsbPulse 1.6s ease-in-out infinite}
.cdsb-head .cdsb-x{position:static;margin-left:auto;width:30px;height:30px;font-size:18px}
@keyframes cdsbPulse{50%{opacity:.35}}
.cdsb-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;scrollbar-width:none}
.cdsb-msgs::-webkit-scrollbar{display:none}
.cdsb-m{max-width:86%;padding:9px 12px;border-radius:14px;font-size:13.5px;line-height:1.5;word-wrap:break-word}
.cdsb-m.in{align-self:flex-start;background:#0C1E30;border:1px solid rgba(238,244,248,.07);border-bottom-left-radius:4px}
.cdsb-m.out{align-self:flex-end;background:#18C25A;color:#07131F;font-weight:600;border-bottom-right-radius:4px}
.cdsb-m b{color:#8FF0B5}
.cdsb-m a{color:#8FF0B5;font-weight:700;text-decoration:none;border-bottom:1px solid rgba(143,240,181,.4);cursor:pointer}
.cdsb-m.typing{display:flex;gap:4px;padding:12px 14px}
.cdsb-m.typing i{width:6px;height:6px;border-radius:50%;background:#8FF0B5;animation:cdsbDot 1s infinite}
.cdsb-m.typing i:nth-child(2){animation-delay:.15s}.cdsb-m.typing i:nth-child(3){animation-delay:.3s}
@keyframes cdsbDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-4px);opacity:1}}
.cdsb-quick{display:flex;gap:6px;overflow-x:auto;padding:4px 14px 10px;scrollbar-width:none}
.cdsb-quick::-webkit-scrollbar{display:none}
.cdsb-quick .cdsb-chip{flex:none}
.cdsb-form{display:flex;gap:8px;padding:10px 12px 12px;border-top:1px solid rgba(238,244,248,.08)}
.cdsb-form input{flex:1;min-width:0;height:40px;border-radius:12px;border:1px solid rgba(238,244,248,.12);background:#0C1E30;color:#EEF4F8;padding:0 12px;font:500 14px Inter,sans-serif;outline:none;user-select:text;-webkit-user-select:text}
.cdsb-form input:focus{border-color:#18C25A}
.cdsb-form input::placeholder{color:rgba(238,244,248,.42)}
.cdsb-form button{width:40px;height:40px;flex:none;border:0;border-radius:12px;background:#18C25A;color:#07131F;display:grid;place-items:center;cursor:pointer}
@media (prefers-reduced-motion:reduce){.cdsb-head small i,.cdsb-m.typing i{animation:none}}
`;

/* The mark: green gauge "C" ring around a navy face. Eyes, happy eyes and a smile live inside. */
const ARC = 'M73.04 29.26A31 31 0 1 0 73.04 70.74';
const face = (id) => `
<svg viewBox="0 0 100 100" aria-hidden="true">
  <defs><radialGradient id="${id}g" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#16324D"/><stop offset="1" stop-color="#07131F"/></radialGradient></defs>
  <circle cx="50" cy="50" r="44" fill="url(#${id}g)"/>
  <path d="${ARC}" fill="none" stroke="#18C25A" stroke-width="9" stroke-linecap="round"/>
  <circle class="k" cx="35" cy="59" r="4.5" fill="#18C25A" opacity=".28"/><circle class="k" cx="61" cy="59" r="4.5" fill="#18C25A" opacity=".28"/>
  <g class="eyes"><g class="pupils">
    <ellipse cx="41" cy="47" rx="4.2" ry="6.2" fill="#EEF4F8"/><ellipse cx="57" cy="47" rx="4.2" ry="6.2" fill="#EEF4F8"/>
    <circle cx="42.4" cy="44.6" r="1.4" fill="#07131F"/><circle cx="58.4" cy="44.6" r="1.4" fill="#07131F"/>
  </g></g>
  <g class="happy" opacity="0" fill="none" stroke="#EEF4F8" stroke-width="3" stroke-linecap="round"><path d="M37 49q4-6 8 0"/><path d="M53 49q4-6 8 0"/></g>
  <path class="mouth" d="M44 57q5 5 10 0" fill="none" stroke="#EEF4F8" stroke-width="2.6" stroke-linecap="round"/>
</svg>`;

/* ---------------- what Ceedee knows ---------------- */
const SVC = s => ({ href: `/services/${s[0]}`, app: s[1] });
const A = [
  [/price|cost|fee|budget|how much|quote|naira|₦/i, 'Every quote is scoped to the instrument and site, so it depends on what you need. Tell us a little and we\'ll come back with options.', ['Request a quote', { href: '/get-started' }]],
  [/contact|call|talk|email|phone|whatsapp|human|person|team|someone/i, 'You can reach the team on <a href="tel:+2348002742475">+234 800 CDS IGRL</a> or <a href="mailto:info@cdsigrl.org">info@cdsigrl.org</a>, or leave your details and we\'ll call you.', ['Talk to the team', { href: '/get-started' }]],
  [/retail|supermarket|scale|checkout|deli|food|packag/i, '<b>Retail & Food Packaging</b>: price-computing scales, checkweighers and multihead weighers, installed, calibrated and certified for trade.', ['See retail solutions', SVC(['retail-food-packaging', 'p01'])]],
  [/fuel|flow|dispenser|oil|gas|chemical|liquid|petrol|diesel/i, '<b>Fuel & Industrial Flow</b>: turbine, ultrasonic and Coriolis flow meters plus fuel dispensers, matched to your product and traceable to standards.', ['See fuel & flow', SVC(['fuel-industrial-flow', 'p02'])]],
  [/weighbridge|truck|bulk|load ?cell|conveyor|mining|quarry|tonnage/i, '<b>Truck & Bulk Weighing</b>: weighbridges, column load cells, belt scales and weigh-in-motion, built for heavy daily use.', ['See weighbridges', SVC(['truck-bulk-weighing', 'p03'])]],
  [/lab|laborator|balance|pharma|precision|jewel|gold|research|analytical/i, '<b>Laboratory & Precision</b>: analytical balances and precision scales for labs, pharmacies, QC and jewellers.', ['See lab & precision', SVC(['laboratory-precision', 'p06'])]],
  [/electric|taxi|utility|utilities|transport|smart meter|energy/i, '<b>Utilities & Transport</b>: smart electricity meters and GPS taximeters, certified and tamper-resistant.', ['See utilities', SVC(['utilities-transport', 'p05'])]],
  [/hotel|bar|brew|spirit|beverage|farm|livestock|grain|agri/i, '<b>Hospitality & Agriculture</b>: spirit measures, beverage flow meters, livestock scales and grain moisture meters.', ['See hospitality & agri', SVC(['hospitality-agriculture', 'p04'])]],
  [/calibrat|certif|verif|complian|inspect|regulat|legal/i, 'We handle the whole compliance loop: <b>calibration</b>, verification paperwork, and support so you\'re ready when inspectors visit.', ['How we work', { href: '/approach', app: 'approach' }]],
  [/catalog|equipment|product|list|range/i, 'Our catalogue covers <b>22 instrument types</b> across 6 categories, each with what it does, where it\'s used in Nigeria and the compliance notes.', ['Open the catalogue', { href: '/equipment' }]],
  [/approach|process|how .*work|steps?\b|method/i, 'Five steps: <b>Assess → Select → Install → Certify → Support</b>. One partner from quote to certified accuracy.', ['See the approach', { href: '/approach', app: 'approach' }]],
  [/client|who .*serve|industr|sector/i, 'We work with <b>retailers</b>, <b>industrial operators</b> and <b>labs</b> across all 36 states.', ['Who we serve', { href: '/clients', app: 'clients' }]],
  [/where|office|address|locat|abuja|lagos|state/i, 'Head office: <b>House 21, Megro Crescent, Maitama, Abuja</b>. We deploy nationwide, all 36 states.'],
  [/^(hi|hey|hello|good|yo|sup)\b/i, 'Hey! 👋 Ask me about scales, weighbridges, flow meters, utility meters, lab balances or calibration.'],
  [/thank|thanks|cool|great|nice|ok(ay)?\b/i, 'Anytime! I\'ll be bouncing around here if you need me. 🙂'],
  [/what|do|offer|service|instrument|measure|sell|supply/i, 'We supply, install, calibrate and certify measuring instruments in <b>six categories</b>: retail scales, fuel & flow, weighbridges, hospitality & agri, utilities & transport, and lab precision.', ['Browse services', { href: '/services', app: 'work' }]],
];
const QUICK = ['What do you supply?', 'Weighbridges', 'Fuel & flow meters', 'Calibration', 'Get a quote', 'Talk to a person'];

/* ---------------- build ---------------- */
function boot() {
  const st = document.createElement('style'); st.textContent = css; document.head.append(st);
  const root = document.createElement('div'); root.className = 'cdsb';
  root.innerHTML = `
    <div class="cdsb-shadow"></div>
    <div class="cdsb-tease" role="status" aria-live="polite"></div>
    <section class="cdsb-panel" role="dialog" aria-label="Chat with CDS IGRL">
      <header class="cdsb-head">${face('h')}<div><b>Ceedee · CDS IGRL</b><small><i></i>online · replies instantly</small></div><button class="cdsb-x" aria-label="Close chat">×</button></header>
      <div class="cdsb-msgs"></div>
      <div class="cdsb-quick">${QUICK.map(q => `<button class="cdsb-chip">${q}</button>`).join('')}</div>
      <form class="cdsb-form"><input placeholder="Ask about scales, meters, calibration…" autocomplete="off" aria-label="Message"><button aria-label="Send"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button></form>
    </section>
    <button class="cdsb-orb" aria-label="Chat with the CDS IGRL assistant"><div class="cdsb-body"><div class="cdsb-breath"><div class="cdsb-aura"></div>${face('o')}</div></div><span class="cdsb-badge">1</span></button>`;
  document.body.append(root);
  const $ = s => root.querySelector(s);
  const orb = $('.cdsb-orb'), body = $('.cdsb-body'), breath = $('.cdsb-breath'), aura = $('.cdsb-aura'), shadow = $('.cdsb-shadow');
  const tease = $('.cdsb-tease'), panel = $('.cdsb-panel'), msgs = $('.cdsb-msgs'), badge = $('.cdsb-badge');
  const eyes = orb.querySelector('.eyes'), pupils = orb.querySelector('.pupils'), happy = orb.querySelector('.happy'), mouth = orb.querySelector('.mouth');

  const pos = { x: 0, y: 0, g: 0 };
  let mode = 'roam', hopTl = null, wanderCall = null, opened = false, greeted = false;
  const apply = () => {
    orb.style.transform = `translate(${pos.x}px,${pos.y}px)`;
    const air = Math.max(0, pos.g - pos.y), k = Math.max(.35, 1 - air / 260);
    shadow.style.transform = `translate(${pos.x}px,${pos.g + SIZE - 6}px) scale(${k})`;
    shadow.style.opacity = .9 * k;
  };
  const home = () => ({ x: innerWidth - SIZE - (mobile() ? 16 : 26), y: innerHeight - SIZE - (OS() && mobile() ? 100 : mobile() ? 18 : 26) });

  /* ---- expressions ---- */
  const look = dx => gsap.to(pupils, { x: Math.max(-3, Math.min(3, dx / 40)), duration: .25, ease: 'power2.out' });
  const smile = (on = true) => { gsap.to(happy, { opacity: on ? 1 : 0, duration: .12 }); gsap.to(eyes, { opacity: on ? 0 : 1, duration: .12 }); };
  const blink = () => { if (!document.hidden && eyes.style.opacity !== '0') gsap.to(eyes, { scaleY: .1, transformOrigin: '50% 50%', duration: .07, yoyo: true, repeat: 1 }); gsap.delayedCall(rand(2.2, 5), blink); };
  let talkTw = null;
  const talk = on => { talkTw && talkTw.kill(); gsap.set(mouth, { attr: { d: 'M44 57q5 5 10 0' } }); if (on) talkTw = gsap.to(mouth, { attr: { d: 'M44 56q5 8 10 0' }, duration: .14, yoyo: true, repeat: -1, ease: 'sine.inOut' }); };

  /* ---- movement ---- */
  function hop(tx, ty, h = rand(70, 150)) {
    return new Promise(res => {
      const sx = pos.x, sy = pos.y, dist = Math.hypot(tx - sx, ty - sy);
      const d = Math.min(1, .5 + dist / 1400), peak = Math.min(sy, ty) - h;
      pos.g = sy; look(tx - sx); smile(false);
      hopTl && hopTl.kill();
      hopTl = gsap.timeline({ onComplete: res })
        .to(body, { scaleX: 1.18, scaleY: .8, duration: .13, ease: 'power2.out' })
        .addLabel('air')
        .to(body, { scaleX: .86, scaleY: 1.14, duration: .16, ease: 'power2.out' }, 'air')
        .to(body, { scaleX: 1, scaleY: 1, duration: d * .5, ease: 'sine.out' }, 'air+=.16')
        .to(body, { rotation: (tx - sx) > 0 ? 8 : -8, duration: d / 2, ease: 'sine.out' }, 'air')
        .to(body, { rotation: 0, duration: d / 2, ease: 'sine.in' }, `air+=${d / 2}`)
        .to(pos, { x: tx, g: ty, duration: d, ease: 'none', onUpdate: apply }, 'air')
        .to(pos, { y: peak, duration: d / 2, ease: 'power2.out' }, 'air')
        .to(pos, { y: ty, duration: d / 2, ease: 'power2.in' }, `air+=${d / 2}`)
        .addLabel('land')
        .to(body, { scaleX: 1.28, scaleY: .74, duration: .08, ease: 'power2.out' }, 'land')
        .call(() => smile(true), null, 'land')
        .to(body, { scaleX: 1, scaleY: 1, duration: .55, ease: 'elastic.out(1.1,.35)' }, 'land+=.08')
        .call(() => smile(false), null, 'land+=.5');
    });
  }
  const spot = () => {
    const pad = 24, top = OS() ? 60 : 90, bottom = mobile() ? 170 : 140;
    return { x: rand(pad, innerWidth - SIZE - pad), y: rand(top, Math.max(top + 10, innerHeight - SIZE - bottom)) };
  };
  async function wander(n) {
    mode = 'roam';
    for (let i = 0; i < n && mode === 'roam'; i++) { const p = spot(); await hop(p.x, p.y); await new Promise(r => setTimeout(r, rand(120, 520))); }
    if (mode !== 'roam') return;
    const h = home(); await hop(h.x, h.y, 120);
    settle();
  }
  function settle() {
    mode = 'home'; look(-40);
    if (!greeted) { greeted = true; showTease(); }
    scheduleWander();
  }
  /* every so often, if the chat is closed and nobody is talking to him, Ceedee goes for a little wander */
  function scheduleWander() {
    wanderCall && wanderCall.kill();
    if (still) return;
    wanderCall = gsap.delayedCall(rand(40, 70), () => {
      if (opened || document.hidden || tease.style.opacity > .5) return scheduleWander();
      hideTease(); wander(Math.round(rand(2, 3)));
    });
  }
  /* small idle hop in place */
  const fidget = () => { if (mode === 'home' && !opened && !document.hidden && !still) { const h = home(); gsap.timeline().call(() => look(rand(-60, 60))).to(pos, { y: h.y - 26, duration: .22, ease: 'power2.out', onUpdate: apply }).to(pos, { y: h.y, duration: .22, ease: 'power2.in', onUpdate: apply }).to(body, { scaleX: 1.15, scaleY: .85, duration: .07 }).to(body, { scaleX: 1, scaleY: 1, duration: .4, ease: 'elastic.out(1,.4)' }); } gsap.delayedCall(rand(7, 13), fidget); };

  /* ---- teaser bubble ---- */
  function placeTease() {
    const h = home(), w = Math.min(250, innerWidth - SIZE - 48);
    tease.style.width = w + 'px';
    tease.style.left = Math.max(12, h.x - w - 10) + 'px';
    tease.style.top = (h.y - tease.offsetHeight + SIZE * .55) + 'px';
  }
  function showTease() {
    tease.innerHTML = `<button class="cdsb-x" aria-label="Dismiss">×</button>Hi, I'm <b>Ceedee</b> 👋<br>Need a scale, weighbridge, meter or calibration? I can point you the right way.<div class="row"><button class="cdsb-chip pri" data-go>Let's chat</button><button class="cdsb-chip" data-no>Just browsing</button></div>`;
    tease.style.pointerEvents = 'auto'; placeTease(); talk(true); gsap.delayedCall(1.2, () => talk(false));
    gsap.fromTo(tease, { opacity: 0, scale: .6, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: .5, ease: 'back.out(2)' });
    gsap.to(badge, { scale: 1, duration: .4, ease: 'back.out(3)' });
    tease.querySelector('[data-go]').onclick = openChat;
    tease.querySelector('[data-no]').onclick = () => { hideTease(); smile(true); gsap.delayedCall(.8, () => smile(false)); };
    tease.querySelector('.cdsb-x').onclick = hideTease;
  }
  const hideTease = () => { tease.style.pointerEvents = 'none'; gsap.to(tease, { opacity: 0, scale: .8, duration: .2, overwrite: true }); };

  /* ---- chat ---- */
  const esc = s => s.replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
  function go(t) {
    if (OS() && t.app) { closeChat(); return window.openApp(t.app); }
    if (!OS() && t.href.startsWith('/') && document.getElementById('root')) {
      closeChat(); history.pushState({}, '', t.href); dispatchEvent(new PopStateEvent('popstate')); scrollTo(0, 0); return;
    }
    location.href = t.href;
  }
  function add(html, cls) {
    const m = document.createElement('div'); m.className = 'cdsb-m ' + cls; m.innerHTML = html; msgs.append(m);
    msgs.scrollTop = msgs.scrollHeight;
    if (cls === 'in') gsap.from(m, { opacity: 0, y: 8, scale: .96, transformOrigin: '0 100%', duration: .3, ease: 'back.out(2)' });
    return m;
  }
  function reply(q) {
    const t = add('<i></i><i></i><i></i>', 'in typing'); talk(true);
    setTimeout(() => {
      t.remove(); talk(false);
      const hit = A.find(([r]) => r.test(q));
      const text = hit ? hit[1] : 'Good question. The team can answer that properly. Leave your details and someone will get back to you.';
      const link = hit ? hit[2] : ['Talk to the team', { href: '/get-started' }];
      const m = add(text + (link ? `<br><a data-l>${link[0]} →</a>` : ''), 'in');
      const a = m.querySelector('[data-l]'); if (a) a.onclick = () => go(link[1]);
      smile(true); setTimeout(() => smile(false), 700);
    }, 650 + Math.min(900, q.length * 18));
  }
  const send = q => { q = q.trim(); if (!q) return; add(esc(q), 'out'); reply(q); };
  root.querySelectorAll('.cdsb-quick .cdsb-chip').forEach(b => b.onclick = () => send(b.textContent));
  $('.cdsb-form').onsubmit = e => { e.preventDefault(); const i = $('.cdsb-form input'); send(i.value); i.value = ''; };
  $('.cdsb-head .cdsb-x').onclick = closeChat;
  addEventListener('keydown', e => { if (e.key === 'Escape' && opened) closeChat(); });

  function placePanel() {
    const h = home(), w = Math.min(370, innerWidth - 24), hh = Math.min(540, innerHeight - (innerHeight - h.y) - 40);
    Object.assign(panel.style, { width: w + 'px', height: Math.max(320, hh) + 'px', left: (innerWidth - w - 12 - (mobile() ? 0 : 14)) + 'px', top: (h.y - Math.max(320, hh) - 12) + 'px' });
  }
  function openChat() {
    if (opened) return; opened = true; store.set('cdsb', 'met');
    mode = 'home'; hopTl && hopTl.progress(1); const h = home(); pos.x = h.x; pos.y = pos.g = h.y; apply();
    hideTease(); gsap.to(badge, { scale: 0, duration: .2, overwrite: true });
    placePanel(); panel.style.visibility = 'visible';
    gsap.fromTo(panel, { opacity: 0, scale: .4, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: .45, ease: 'back.out(1.6)' });
    gsap.timeline().to(body, { scaleX: .85, scaleY: 1.15, duration: .12 }).to(body, { scaleX: 1, scaleY: 1, duration: .5, ease: 'elastic.out(1,.35)' });
    look(-60);
    if (!msgs.children.length) setTimeout(() => add("Hey! I'm <b>Ceedee</b>, the CDS IGRL assistant. What do you need to measure?", 'in'), 250);
    setTimeout(() => !mobile() && $('.cdsb-form input').focus(), 400);
  }
  function closeChat() {
    if (!opened) return; opened = false;
    gsap.to(panel, { opacity: 0, scale: .4, y: 30, duration: .3, ease: 'power2.in', onComplete: () => { panel.style.visibility = 'hidden'; } });
    smile(true); gsap.delayedCall(.9, () => smile(false));
    scheduleWander(); orb.focus({ preventScroll: true });
  }
  orb.onclick = () => (opened ? closeChat() : openChat());

  addEventListener('resize', () => {
    if (mode === 'home' || still) { const h = home(); pos.x = h.x; pos.y = pos.g = h.y; apply(); }
    if (tease.style.opacity > 0) placeTease();
    if (opened) placePanel();
  });

  /* ---- alive: breathe, glow, blink ---- */
  gsap.to(aura, { scale: 1.25, opacity: .55, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  if (!still) gsap.to(breath, { scaleY: 1.04, scaleX: .98, transformOrigin: '50% 100%', duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.delayedCall(2, blink);

  /* ---- entrance ---- */
  const h = home();
  if (still) { pos.x = h.x; pos.y = pos.g = h.y; apply(); gsap.set(orb, { opacity: 1 }); setTimeout(settle, 600); return; }
  const first = store.get('cdsb') !== 'met';
  if (first) {
    /* pop up from the bottom edge, look around, then bounce about the page */
    pos.x = innerWidth * (mobile() ? .5 : .45); pos.y = pos.g = innerHeight - SIZE - (mobile() ? 170 : 140); apply();
    gsap.timeline({ onComplete: () => { store.set('cdsb', 'met'); wander(mobile() ? 3 : 5); } })
      .fromTo(orb, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .6, ease: 'back.out(2.4)' })
      .fromTo(shadow, { opacity: 0 }, { opacity: .9, duration: .4 }, '<')
      .call(() => smile(true)).to({}, { duration: .5 }).call(() => smile(false))
      .call(() => look(-60)).to({}, { duration: .35 }).call(() => look(60)).to({}, { duration: .35 }).call(() => look(0));
  } else {
    pos.x = h.x; pos.y = pos.g = h.y; apply();
    gsap.fromTo(orb, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(2.4)' });
    greeted = true; gsap.to(badge, { scale: 1, duration: .4, delay: .5, ease: 'back.out(3)' }); scheduleWander();
  }
  gsap.delayedCall(9, fidget);
}

/* ---------------- start once GSAP and the page are ready ---------------- */
function whenReady(fn) {
  const go = () => {
    /* on the OS homepage, wait for the boot screen to finish */
    const wait = () => document.getElementById('boot') ? setTimeout(wait, 300) : setTimeout(fn, OS() ? 1400 : 2200);
    wait();
  };
  if (window.gsap) return go();
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
  s.onload = go; document.head.append(s);
}
document.readyState === 'loading' ? addEventListener('DOMContentLoaded', () => whenReady(boot)) : whenReady(boot);
})();
