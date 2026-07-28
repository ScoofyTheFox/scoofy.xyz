// scoofy.xyz :: STUPID MODE :: the js is 90% jokes
'use strict';
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
let HITS = 1; // the fake visitor count (section 5)
const TXT = (window.GB_CONFIG && window.GB_CONFIG.text) || {}; // editable copy, see config.js

/* ============================================================
   0. LOCKDOWN - no selecting, no dragging, no easy inspecting
   ============================================================ */
(function lockdown() {
  const stop = (e) => e.preventDefault();
  document.addEventListener('contextmenu', stop);   // no right-click menu
  document.addEventListener('selectstart', stop);    // no text selection
  document.addEventListener('dragstart', stop);      // no dragging images/text out
  document.addEventListener('keydown', (e) => {
    const k = (e.key || '').toLowerCase();
    // F12, Ctrl+Shift+I/J/C (devtools), Ctrl+U (view source)
    if (k === 'f12'
      || (e.ctrlKey && e.shiftKey && (k === 'i' || k === 'j' || k === 'c'))
      || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });
})();

/* ============================================================
   1. cursed emoji cursor trail (the geocities classic)
   ============================================================ */
(function cursorTrail() {
  if (REDUCED) return;
  const junk = ['✨', '⭐', '💫', '👽', '🛸', '💿', '🌟'];
  let last = 0;
  addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - last < 45) return; // don't spawn a billion
    last = now;
    const s = document.createElement('span');
    s.textContent = junk[Math.floor(Math.random() * junk.length)];
    s.style.cssText =
      `position:fixed;left:${e.clientX}px;top:${e.clientY}px;z-index:45;` +
      `pointer-events:none;font-size:${14 + Math.random() * 12}px;` +
      `transform:translate(-50%,-50%);transition:transform .8s ease-out,opacity .8s ease-out;`;
    document.body.appendChild(s);
    requestAnimationFrame(() => {
      s.style.transform = `translate(-50%,-50%) translateY(26px) scale(0.4) rotate(${(Math.random() - 0.5) * 90}deg)`;
      s.style.opacity = '0';
    });
    setTimeout(() => s.remove(), 850);
  }, { passive: true });
})();

/* ============================================================
   1.5 ANIMATED BURN CURSOR - flips 2 frames on a timer.
       CSS can't animate a cursor, so we swap the image in JS.
       hover a clickable = the pointing-finger hand instead.
   ============================================================ */
(function burnCursor() {
  // only take over on real mouse devices; touch/reduced-motion keep defaults
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (REDUCED || !fine) return;

  const SRC = {
    pointer: ['assets/cursors/pointer1.png', 'assets/cursors/pointer2.png'],
    link: ['assets/cursors/link1.png', 'assets/cursors/link2.png'],
  };
  // preload so the very first frames are ready
  [...SRC.pointer, ...SRC.link].forEach((s) => { const i = new Image(); i.src = s; });

  const HOT = { pointer: [2, 1], link: [9, 1] }; // fingertip offset per hand
  const CLICKABLE = 'a, button, .btn, .counter, .close, [role="button"], label, summary';

  // build the fake cursor element + kill the real one
  const cur = document.createElement('div');
  cur.id = 'fakecur';
  document.body.appendChild(cur);
  document.documentElement.classList.add('js-cursor');

  let x = innerWidth / 2, y = innerHeight / 2, over = false, frame = 0, shown = false;
  const key = () => (over ? 'link' : 'pointer');
  const paint = () => { cur.style.backgroundImage = `url('${SRC[key()][frame]}')`; };
  const place = () => {
    const h = HOT[key()];
    cur.style.translate = `${x - h[0]}px ${y - h[1]}px`;
  };
  // retrigger a wobble animation (remove → reflow → re-add)
  const wobble = (name) => {
    cur.classList.remove('pop', 'squish', 'boing');
    void cur.offsetWidth; // force reflow so the animation restarts
    cur.classList.add(name);
  };
  const reveal = () => {
    cur.style.display = 'block';
    if (!shown) { shown = true; wobble('pop'); } // pop in on first contact
  };

  addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    const o = !!(e.target && e.target.closest && e.target.closest(CLICKABLE));
    if (o !== over) { over = o; paint(); if (o) wobble('boing'); } // boing when it lands on a button
    reveal();
    place();
  }, { passive: true });
  addEventListener('pointerdown', () => { place(); wobble('squish'); }, { passive: true }); // squish on click
  document.addEventListener('mouseleave', () => { cur.style.display = 'none'; shown = false; });
  document.addEventListener('mouseenter', reveal); // pop again when you come back

  paint();
  setInterval(() => { frame ^= 1; paint(); }, 140); // the burn
})();

/* ============================================================
   2. the accusation line up top - decodes in like a terminal
      (scramble technique lifted from the effects stash, 004)
   ============================================================ */
const kickers = TXT.kickers || [
  "// unauthorized visitor detected",
  "// this is a private incident",
  "// who the fuck told you about this",
  "// i wasn't expecting a damn soul",
  "// suspicious. but welcome i guess",
  "// you're not on the guest list",
];
(function scrambleKicker() {
  const el = document.getElementById('kicker');
  if (!el) return;
  const pool = '!<>-_\\/[]{}=+*^?#01';
  let idx = 0, frame = 0, queue = [], raf;
  function set(target) {
    queue = [...target].map((ch, i) => ({
      ch, start: Math.floor(Math.random() * 10), end: Math.floor(Math.random() * 10) + 12 + i,
    }));
    frame = 0; cancelAnimationFrame(raf); tick();
  }
  function tick() {
    let out = '', done = 0;
    for (const q of queue) {
      if (frame >= q.end) { done++; out += q.ch; }
      else if (frame >= q.start) { out += pool[Math.floor(Math.random() * pool.length)]; }
      else { out += ' '; }
    }
    el.textContent = out;
    if (done === queue.length) return;
    frame++; raf = requestAnimationFrame(tick);
  }
  if (REDUCED) { el.textContent = kickers[0]; return; }
  set(kickers[0]);
  setInterval(() => { idx = (idx + 1) % kickers.length; set(kickers[idx]); }, 3400);
})();

/* ============================================================
   3. confetti burst (technique from effect 249)
   ============================================================ */
const boom = (function confetti() {
  const cv = document.getElementById('confetti');
  if (!cv) return () => {};
  const ctx = cv.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let ps = [], running = false;
  const cols = ['#ff00cc', '#00ffcc', '#ffff00', '#00ff00', '#00aaff', '#ff0000'];
  function size() {
    cv.width = Math.round(innerWidth * dpr);
    cv.height = Math.round(innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  addEventListener('resize', size, { passive: true });
  function frame() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ps = ps.filter((p) => p.life > 0 && p.y < innerHeight + 20);
    for (const p of ps) {
      p.vy += 0.13; p.vx *= 0.992; p.x += p.vx; p.y += p.vy;
      p.rot += p.vr; p.life -= 0.006;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w * Math.abs(Math.cos(p.rot * 1.7)), p.h);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (ps.length) requestAnimationFrame(frame); else running = false;
  }
  return function burst(x, y) {
    if (REDUCED) return;
    for (let i = 0; i < 110; i++) {
      const a = Math.random() * Math.PI * 2, s = 1.5 + Math.random() * 7;
      ps.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2.6,
        w: 4 + Math.random() * 6, h: 6 + Math.random() * 8,
        rot: Math.random() * 7, vr: (Math.random() - 0.5) * 0.34,
        c: cols[Math.floor(Math.random() * cols.length)], life: 1,
      });
    }
    if (!running) { running = true; requestAnimationFrame(frame); }
  };
})();

/* ============================================================
   4. the "% sure i forgot the domain" number can't commit
   ============================================================ */
// re-query each tick so it keeps working even after config re-renders the .sub line
if (document.getElementById('percent')) setInterval(() => {
  const el = document.getElementById('percent');
  if (el) el.textContent = Math.floor(60 + Math.random() * 39);
}, 2600);

/* ============================================================
   5. fake hit counter - ticks up on its own, insults you if clicked
   ============================================================ */
const counterEl = document.getElementById('counter');
if (counterEl) {
  HITS = 1;
  const pad = () => String(HITS).padStart(7, '0');
  counterEl.textContent = pad();
  setInterval(() => { HITS += Math.floor(1 + Math.random() * 4); counterEl.textContent = pad(); }, 1800);

  let clicks = 0;
  counterEl.addEventListener('click', () => {
    clicks++;
    const lines = TXT.counterInsults || [
      "you are visitor number",
      "ok stop fuckin touching it",
      "it's fake. it was always fake.",
      "i literally make the number up",
      "why the hell are you like this",
      "...fine, +1000, congrats",
    ];
    const label = document.querySelector('.counter-label');
    if (label) label.textContent = lines[Math.min(clicks, lines.length - 1)];
    if (clicks >= 5) { HITS += 1000; counterEl.textContent = pad(); }
  });
}

/* ============================================================
   6. confession sheet + confetti payoff
   ============================================================ */
const sheet = document.getElementById('sheet');
const openBtn = document.getElementById('confess');
const closeBtn = document.getElementById('close');
const openSheet = () => { sheet.classList.add('open'); sheet.setAttribute('aria-hidden', 'false'); };
const closeSheet = () => { sheet.classList.remove('open'); sheet.setAttribute('aria-hidden', 'true'); };
if (openBtn) openBtn.addEventListener('click', () => {
  const r = openBtn.getBoundingClientRect();
  boom(r.left + r.width / 2, r.top + r.height / 2);
  openSheet();
});
if (closeBtn) closeBtn.addEventListener('click', closeSheet);
if (sheet) sheet.addEventListener('click', (e) => { if (e.target === sheet) closeSheet(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

/* ============================================================
   7. the "leave" button dodges, then folds
   ============================================================ */
const leaveBtn = document.getElementById('leave');
if (leaveBtn) {
  let dodges = 0;
  leaveBtn.addEventListener('mouseenter', () => {
    if (dodges < 3) {
      dodges++;
      const dx = (Math.random() - 0.5) * 220;
      const dy = (Math.random() - 0.5) * 90;
      leaveBtn.style.transition = 'transform 0.2s ease';
      leaveBtn.style.transform = `translate(${dx}px, ${dy}px)`;
      const dodgeText = ['wait', "no don't", 'we just fuckin met', 'okay fine, go'];
      leaveBtn.textContent = dodgeText[dodges - 1] || "honestly, i'll just leave";
    }
  });
  leaveBtn.addEventListener('click', () => {
    document.body.classList.add('bye');
    requestAnimationFrame(() => document.body.classList.add('gone'));
    setTimeout(() => {
      document.body.classList.remove('gone');
      leaveBtn.style.transform = '';
      leaveBtn.textContent = "oh you're still here lol";
      const r = leaveBtn.getBoundingClientRect();
      boom(r.left + r.width / 2, r.top + r.height / 2);
      dodges = 3;
    }, 1400);
  });
}

/* ============================================================
   8. type anywhere and the whisper line reacts
   ============================================================ */
const whisper = document.getElementById('whisper');
if (whisper) {
  let typed = '', typeTimer;
  document.addEventListener('keydown', (e) => {
    if (e.key.length !== 1 || e.metaKey || e.ctrlKey) return;
    typed = (typed + e.key).slice(-20);
    whisper.textContent = `> ${typed}`;
    clearTimeout(typeTimer);
    const t = typed.toLowerCase();
    if (t.endsWith('hi') || t.endsWith('hello') || t.endsWith('hey')) {
      whisper.textContent = '> hi. genuinely, welcome. this is weird for both of us.';
    } else if (t.endsWith('scoofy')) {
      whisper.textContent = "> that's me. that's the whole brand.";
    } else if (t.endsWith('who')) {
      whisper.textContent = '> exactly. who indeed.';
    } else if (t.endsWith('why')) {
      whisper.textContent = "> no reason. that's the honest answer.";
    }
    typeTimer = setTimeout(() => {
      whisper.textContent = TXT.whisper || "psst - click the hit counter. or type something. or don't. i'm a website, not a fucking cop.";
      typed = '';
    }, 4000);
  });
}

/* ============================================================
   9. CURSED MEME POPUPS - win98 windows full of furries & dogs
   ============================================================ */
// each meme can carry ONE caption or an ARRAY of captions (a random one shows).
// to add real new memes: drop a file in memes/ and add an entry here.
const MEMES = {
  sadDog:    { f: "dog sad.jpg", c: ["you're leaving? ok. this is fine. i'm fine.", "aw. you're going. i'll just sit here then.", "no wait, i had more to show you."] },
  whatDog:   { f: "dog what question.jpg", c: ["wait- how did you get here again??", "hold on. who actually let you in.", "genuine question: how. HOW."] },
  susFish:   { f: "fish side eye sus what.mp4", c: ["...you look kinda sus ngl", "the fish is judging you. i'm sorry.", "why's it staring like that"], v: true },
  creator:   { f: "furry scoofyx creator infront of gay flag proud salute.gif", c: ["hi. i'm scoofy. i made this shit. i'm so sorry.", "creator of this mess, reporting in.", "yeah, one purple fox-shark did all this. me. hi."] },
  die:       { f: "guess i'll die text caption expie furry.png", c: ["0 visitors in 4 years. guess i'll die.", "no one signed the guestbook. guess i'll die.", "welp. guess i'll die."] },
  happyDog:  { f: "happy dog.jpg", c: ["OMG a REAL person?? hi hi hi!!", "YOU SIGNED IT?? best day ever!!", "a visitor!! i'm gonna cry (happy)"] },
  chadWolf:  { f: "lone wolf tuff chad.jpg", c: ["yeah i built this site alone. and?", "one guy. one website. zero regrets.", "solo dev energy. respect it."] },
  waitTiger: { f: "tiger furry anthro sitting waiting tuff .jpg", c: ["been sitting here waiting for literally anyone.", "you have NO idea how long i've waited.", "finally. someone. hi."] },
  watchTiger:{ f: "tiger looking at screen.jpg", c: ["i can see you looking at the screen btw", "yes, i see you. hi.", "eye contact. through the screen. weird huh."] },
  mafiaTiger:{ f: "tiger smoking a cigarette mafia looking tuff.jpg", c: ["you didn't see nothin here. capisce?", "this website? never existed. got it?", "keep quiet about the guestbook, kid."] },
  hatWolf:   { f: "tuff dark wolf knowledge with hat on.png", c: ["fun fact: this popup has no purpose whatsoever.", "did you know? no. you didn't. now you sorta do.", "knowledge is power. this popup is not knowledge."] },
  zenWolf:   { f: "tuff wolf meditating in the mountains.jpg", c: ["i achieved inner peace. then you showed up.", "was meditating. you ruined it. it's fine.", "namaste. now leave. gently."] },
  crazyWolf: { f: "wolf with hands on face worried wondering depressed sad going crazy.jpg", c: ["oh FUCK someone's HERE. WHAT DO I DO", "AAAA a person AAAA", "i was not emotionally ready for a visitor"] },
};
const MEME_KEYS = Object.keys(MEMES);
const WIN_NAMES = TXT.winNames || ["scoofy.exe", "warning.exe", "popup.dll", "DO_NOT_CLOSE.exe", "trust_me.bat", "hello.exe", "free_ipod.exe", "totally_safe.exe", "clippy.dll", "scoofyx.gif", "screensaver.scr", "wow.exe"];

let MAX_POPUPS = 3; // grows as the visitor count climbs (escalating popups)
let openPopups = 0;
function spawnMeme(key, x, y) {
  if (openPopups >= MAX_POPUPS) return;
  const useKey = MEMES[key] ? key : MEME_KEYS[Math.floor(Math.random() * MEME_KEYS.length)];
  const m = MEMES[useKey];
  const pop = document.createElement('div');
  pop.className = 'meme-pop';
  const media = m.v
    ? `<video src="memes/${encodeURIComponent(m.f)}" autoplay muted loop playsinline></video>`
    : `<img src="memes/${encodeURIComponent(m.f)}" alt="" loading="lazy" />`;
  const capSrc = (TXT.memeCaptions && TXT.memeCaptions[useKey]) || m.c;
  const capText = Array.isArray(capSrc) ? capSrc[Math.floor(Math.random() * capSrc.length)] : capSrc;
  pop.innerHTML =
    `<div class="bar"><span>◕ ${WIN_NAMES[Math.floor(Math.random() * WIN_NAMES.length)]}</span>` +
    `<button aria-label="close">×</button></div>` +
    `<div class="body">${media}<div class="cap">${capText}</div></div>`;

  // position - popups spawn in the side gutters BESIDE the main content so they
  // never cover the GUI. if there's no room beside it (narrow screen), skip.
  const w = 270, h = 260;
  const wrap = document.querySelector('.wrap');
  const wr = wrap && wrap.getBoundingClientRect();
  const gutters = [];
  if (wr) {
    if (wr.left - w - 10 >= 8) gutters.push([8, wr.left - w - 10]);
    if (wr.right + 10 <= innerWidth - w - 8) gutters.push([wr.right + 10, innerWidth - w - 8]);
  } else {
    gutters.push([8, Math.max(8, innerWidth - w - 8)]);
  }
  if (!gutters.length) return; // no safe spot beside the content, don't cover the GUI
  const g = gutters[Math.floor(Math.random() * gutters.length)];
  let px = g[0] + Math.random() * Math.max(0, g[1] - g[0]);
  let py = 70 + Math.random() * Math.max(0, innerHeight - h - 130);
  px = Math.max(8, Math.min(innerWidth - w - 8, px));
  py = Math.max(60, Math.min(innerHeight - h - 60, py));
  // anchor to the PAGE (document coords), so popups scroll with the content
  pop.style.left = (px + (window.scrollX || 0)) + 'px';
  pop.style.top = (py + (window.scrollY || 0)) + 'px';
  pop.style.rotate = ((Math.random() - 0.5) * 6) + 'deg';

  document.body.appendChild(pop);
  openPopups++;
  requestAnimationFrame(() => pop.classList.add('show'));

  const kill = () => {
    pop.classList.remove('show');
    setTimeout(() => { pop.remove(); openPopups--; }, 180);
  };
  pop.querySelector('button').addEventListener('click', kill);
  const auto = setTimeout(kill, 9000 + Math.random() * 4000);

  // draggable by the title bar (it's the 90s, of course it's draggable)
  const bar = pop.querySelector('.bar');
  bar.addEventListener('pointerdown', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    clearTimeout(auto);
    // drag in page coords (pageX/Y) so it works after scrolling too
    const startLeft = parseFloat(pop.style.left) || 0;
    const startTop = parseFloat(pop.style.top) || 0;
    const ox = e.pageX - startLeft, oy = e.pageY - startTop;
    pop.style.rotate = '0deg';
    const move = (ev) => {
      pop.style.left = Math.max(0, ev.pageX - ox) + 'px';
      pop.style.top = Math.max(0, ev.pageY - oy) + 'px';
    };
    const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    bar.setPointerCapture?.(e.pointerId);
  });
}

if (!REDUCED) {
  // greet you a few seconds in - "i can see you looking"
  setTimeout(() => spawnMeme('watchTiger'), 4500);
  // random cursed popups forever (gentle, capped at 3)
  setInterval(() => {
    if (Math.random() < 0.75) spawnMeme(MEME_KEYS[Math.floor(Math.random() * MEME_KEYS.length)]);
  }, 12000);

  // action-triggered ones
  if (openBtn) openBtn.addEventListener('click', () => setTimeout(() => spawnMeme('creator'), 250));
  if (leaveBtn) leaveBtn.addEventListener('click', () => spawnMeme('sadDog'));
  if (counterEl) {
    let c = 0;
    counterEl.addEventListener('click', () => {
      c++;
      if (c === 3) spawnMeme('susFish');
      if (c >= 6) spawnMeme('crazyWolf');
    });
  }
}

/* ============================================================
   10. a line for whoever opens the console
   ============================================================ */
console.log('%chi. how the fuck did you find the console too.', 'font-size:16px;font-weight:bold;color:#ff00cc;');
console.log('%cnothing\'s hidden down here. i checked. no shit. - scoofy', 'color:#00ffcc;');

/* ============================================================
   11. THE CURSED 2003 SOUND - dialup screech, click blips, mute.
       Sounds are PLACEHOLDERS: config.js `sfx` points at files in
       assets/sfx/. If a file is missing, a synthesized WebAudio
       fallback plays instead, so it's never silent. Drop your own
       audio in assets/sfx/ to override. Exposes window.playSfx(name).
   ============================================================ */
(function sound() {
  const KEY = 'scoofy_sound';
  const SFX = (window.GB_CONFIG && window.GB_CONFIG.sfx) || {};
  let enabled = localStorage.getItem(KEY) !== 'off'; // default ON
  let ac = null, master = null, started = false, dialupDone = false;

  const rawBuf = {};  // name -> ArrayBuffer (prefetched, no AudioContext needed)
  const audBuf = {};  // name -> AudioBuffer | 'fail'

  // prefetch any configured files right away (fetch doesn't need AudioContext)
  Object.keys(SFX).forEach((name) => {
    const url = SFX[name];
    if (!url) return;
    fetch(url).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject())).then((ab) => {
      rawBuf[name] = ab; tryDecode(name);
    }).catch(() => { audBuf[name] = 'fail'; });
  });

  function ensure() {
    if (ac) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    master = ac.createGain();
    master.gain.value = 0.16;
    master.connect(ac.destination);
    Object.keys(rawBuf).forEach(tryDecode);
  }
  function tryDecode(name) {
    if (!ac || audBuf[name] || !rawBuf[name]) return;
    try { ac.decodeAudioData(rawBuf[name].slice(0), (b) => { audBuf[name] = b; }, () => { audBuf[name] = 'fail'; }); }
    catch { audBuf[name] = 'fail'; }
  }
  function playFile(name) {
    const buf = audBuf[name];
    if (!buf || buf === 'fail' || !ac) return false;
    const src = ac.createBufferSource();
    src.buffer = buf; src.connect(master); src.start();
    return true;
  }

  // ---- synthesized fallbacks (used when a file isn't present) ----
  function tone(freq, start, dur, type, vol) {
    if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain(), t0 = ac.currentTime + start, v = (vol == null ? 0.5 : vol);
    o.type = type || 'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(v, t0 + 0.01);
    g.gain.setValueAtTime(v, t0 + dur - 0.02);
    g.gain.linearRampToValueAtTime(0, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function noise(start, dur, vol) {
    if (!ac) return;
    const n = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(); src.buffer = buf;
    const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1700; f.Q.value = 0.6;
    const g = ac.createGain(); g.gain.value = (vol == null ? 0.3 : vol);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(ac.currentTime + start); src.stop(ac.currentTime + start + dur);
  }
  function synthDialup() {
    tone(350, 0, 0.35, 'sine', 0.4); tone(440, 0, 0.35, 'sine', 0.4);       // dial tone
    [941, 697, 1336, 852, 1209, 1477].forEach((f, i) => tone(f, 0.45 + i * 0.14, 0.1, 'sine', 0.35)); // dialing
    const t = 1.45;                                                          // handshake screech
    tone(1100, t, 0.22, 'sine', 0.45);
    tone(2100, t + 0.22, 0.28, 'sine', 0.45);
    noise(t + 0.5, 0.75, 0.3);
    tone(1750, t + 0.55, 0.7, 'sawtooth', 0.12);
    tone(1000, t + 0.55, 0.7, 'square', 0.06);
  }
  function synthClick() { tone(560 + Math.random() * 320, 0, 0.045, 'square', 0.4); }
  function synthSign() { [660, 880, 1320].forEach((f, i) => tone(f, i * 0.08, 0.13, 'triangle', 0.4)); }
  const SYNTH = { dialup: synthDialup, click: synthClick, sign: synthSign };

  // ---- public: play a named sfx (file if present, else the beep) ----
  function playSfx(name) {
    if (!enabled) return;
    ensure();
    if (!ac) return;
    if (ac.state === 'suspended') ac.resume();
    if (playFile(name)) return;      // a real file wins
    if (SYNTH[name]) SYNTH[name]();  // otherwise the built-in beep
  }
  window.playSfx = playSfx;

  // ---- mute / unmute button ----
  const btn = document.createElement('button');
  btn.id = 'soundtoggle'; btn.type = 'button';
  const paint = () => { btn.textContent = enabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF'; btn.classList.toggle('off', !enabled); };
  paint();
  if (document.body) document.body.appendChild(btn);
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    enabled = !enabled;
    localStorage.setItem(KEY, enabled ? 'on' : 'off');
    paint();
    if (enabled) { ensure(); if (ac && ac.state === 'suspended') ac.resume(); }
  });

  // ---- first user gesture unlocks audio + plays the modem once ----
  function kick(e) {
    if (started) return;
    started = true;
    ensure();
    if (ac && ac.state === 'suspended') ac.resume();
    const onToggle = e && e.target && ((e.target.id === 'soundtoggle') || (e.target.closest && e.target.closest('#soundtoggle')));
    if (enabled && !onToggle && !dialupDone) { dialupDone = true; playSfx('dialup'); }
  }
  addEventListener('pointerdown', kick, { passive: true });
  addEventListener('keydown', kick, { passive: true });

  // ---- click blips on interactive things ----
  addEventListener('pointerdown', (e) => {
    if (!started || !enabled) return;
    const t = e.target;
    if (t && t.closest && t.closest('a, button, .btn, summary, .gb-pfp, .gb-chip, .gb-msg, .counter, [role="button"]')) playSfx('click');
  }, { passive: true });
})();

/* ============================================================
   12. CUSTOM EMOJIS - type :name: in any page text and it becomes
       a tiny inline image. ALL emojis are PLACEHOLDERS pointing at
       files in assets/emojis/ (config.js `emojis`). Until you drop a
       real file there, a built-in fallback shows (flags render as
       SVG; others show fox art / a placeholder box), so nothing is
       ever a broken image. exposes window.cemojify(str).
   ============================================================ */
(function customEmoji() {
  const uri = (svg) => 'data:image/svg+xml,' + encodeURIComponent(svg);

  // fallbacks (shown until the real file exists in assets/emojis/)
  const MLM = uri("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 20'>" +
    "<rect width='30' height='2.857' y='0' fill='#078D70'/>" +
    "<rect width='30' height='2.857' y='2.857' fill='#26CEAA'/>" +
    "<rect width='30' height='2.857' y='5.714' fill='#98E8C1'/>" +
    "<rect width='30' height='2.858' y='8.571' fill='#FFFFFF'/>" +
    "<rect width='30' height='2.857' y='11.429' fill='#7BADE2'/>" +
    "<rect width='30' height='2.857' y='14.286' fill='#5049CC'/>" +
    "<rect width='30' height='2.857' y='17.143' fill='#3D1A78'/></svg>");
  const RO = uri("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 20'>" +
    "<rect width='10' height='20' fill='#002B7F'/>" +
    "<rect x='10' width='10' height='20' fill='#FCD116'/>" +
    "<rect x='20' width='10' height='20' fill='#CE1126'/></svg>");
  let usStripes = '';
  for (let i = 0; i < 13; i++) if (i % 2 === 0) usStripes += `<rect width='30' height='1.539' y='${(i * 1.539).toFixed(3)}' fill='#B22234'/>`;
  let usStars = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) usStars += `<circle cx='${1.7 + c * 3}' cy='${1.8 + r * 3.4}' r='0.6'/>`;
  const US = uri("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 20'><rect width='30' height='20' fill='#fff'/>" +
    usStripes + "<rect width='13' height='10.77' fill='#3C3B6E'/><g fill='#fff'>" + usStars + "</g></svg>");
  const GENERIC = uri("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><rect width='20' height='20' rx='4' fill='#2a0a3a' stroke='#ff00ff' stroke-width='2'/><text x='10' y='14.5' font-size='12' fill='#ff66ff' text-anchor='middle' font-family='monospace'>?</text></svg>");

  // name -> { src: placeholder file, fb: fallback shown if the file is missing }
  const DEF = {
    mlm:     { src: 'assets/emojis/mlm_flag_emoji.png',     fb: MLM },
    us:      { src: 'assets/emojis/usa_flag_emoji.png',     fb: US },
    usa:     { src: 'assets/emojis/usa_flag_emoji.png',     fb: US },
    ro:      { src: 'assets/emojis/romania_flag_emoji.png', fb: RO },
    romania: { src: 'assets/emojis/romania_flag_emoji.png', fb: RO },
  };
  const CEMOJI = {};
  Object.keys(DEF).forEach((k) => { CEMOJI[k] = { src: DEF[k].src, fb: DEF[k].fb }; });
  const cfg = (window.GB_CONFIG && window.GB_CONFIG.emojis) || {};
  Object.keys(cfg).forEach((k) => {
    const key = k.toLowerCase(), v = cfg[k];
    const src = (typeof v === 'string') ? v : (v && v.src) || '';
    const fb = (v && typeof v === 'object' && v.fb) || (CEMOJI[key] && CEMOJI[key].fb) || GENERIC;
    CEMOJI[key] = { src, fb };
  });

  // fallbacks reachable from inline onerror (used by cemojify's HTML strings)
  window.__cemojiFB = {};
  Object.keys(CEMOJI).forEach((k) => { window.__cemojiFB[k] = CEMOJI[k].fb; });

  const RE = /:([a-z0-9_]+):/gi;

  // for dynamic strings (returns HTML; caller must pre-escape any user text)
  window.cemojify = (str) => String(str).replace(RE, (full, n) => {
    const k = n.toLowerCase();
    if (!CEMOJI[k]) return full;
    return `<img class="cemoji" src="${CEMOJI[k].src}" alt=":${k}:" draggable="false" onerror="this.onerror=null;this.src=window.__cemojiFB['${k}'];" />`;
  });

  function makeImg(name) {
    const img = document.createElement('img');
    img.className = 'cemoji'; img.alt = ':' + name + ':'; img.setAttribute('draggable', 'false');
    img.src = CEMOJI[name].src;
    img.onerror = function () { this.onerror = null; this.src = CEMOJI[name].fb; };
    return img;
  }
  function replaceIn(node) {
    const text = node.nodeValue;
    let m, last = 0, any = false;
    const frag = document.createDocumentFragment();
    RE.lastIndex = 0;
    while ((m = RE.exec(text))) {
      const name = m[1].toLowerCase();
      if (!CEMOJI[name]) continue;
      any = true;
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      frag.appendChild(makeImg(name));
      last = m.index + m[0].length;
    }
    if (!any) return;
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }
  function run() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || n.nodeValue.indexOf(':') === -1) return NodeFilter.FILTER_REJECT;
        const tag = n.parentNode && n.parentNode.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const list = [];
    let node;
    while ((node = walker.nextNode())) { RE.lastIndex = 0; if (RE.test(node.nodeValue)) list.push(node); }
    list.forEach(replaceIn);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

/* ============================================================
   13. SMOOTH IMAGE LIGHTBOX - click .refsheet (or any element with
       [data-lightbox]) and its image zooms open big, in-page, via a
       FLIP animation. click anywhere / Esc closes it back down.
   ============================================================ */
(function lightbox() {
  const triggers = document.querySelectorAll('.refsheet, [data-lightbox]');
  if (!triggers.length) return;

  const ov = document.createElement('div');
  ov.id = 'lightbox';
  ov.innerHTML = '<img alt="" /><button class="lb-close" type="button" aria-label="close">×</button>';
  document.body.appendChild(ov);
  const big = ov.querySelector('img');
  const closeBtn = ov.querySelector('.lb-close');
  let thumb = null, busy = false;

  const rectOf = (el) => el.getBoundingClientRect();

  function open(a) {
    const timg = a.querySelector('img');
    thumb = timg || a;
    big.src = a.getAttribute('href') || (timg && timg.src) || '';
    ov.classList.add('show');
    requestAnimationFrame(() => {
      const fr = rectOf(thumb), br = rectOf(big);
      if (!br.width || !fr.width) return;
      const sx = fr.width / br.width, sy = fr.height / br.height;
      const dx = (fr.left + fr.width / 2) - (br.left + br.width / 2);
      const dy = (fr.top + fr.height / 2) - (br.top + br.height / 2);
      big.style.transition = 'none';
      big.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      void big.offsetWidth;
      big.style.transition = 'transform .42s cubic-bezier(.2,.9,.25,1)';
      big.style.transform = 'translate(0,0) scale(1)';
    });
  }
  function close() {
    if (busy) return;
    busy = true;
    if (thumb) {
      const fr = rectOf(thumb), br = rectOf(big);
      if (br.width && fr.width) {
        const sx = fr.width / br.width, sy = fr.height / br.height;
        const dx = (fr.left + fr.width / 2) - (br.left + br.width / 2);
        const dy = (fr.top + fr.height / 2) - (br.top + br.height / 2);
        big.style.transition = 'transform .34s cubic-bezier(.4,0,.2,1)';
        big.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      }
    }
    ov.classList.remove('show');
    setTimeout(() => { big.style.transition = 'none'; big.style.transform = ''; big.removeAttribute('src'); thumb = null; busy = false; }, 400);
  }

  triggers.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); open(a); }));
  ov.addEventListener('click', (e) => { if (e.target === ov || e.target === closeBtn) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && ov.classList.contains('show')) close(); });
})();

/* ============================================================
   14. LIMINAL SLIDESHOW - the "where 2 find me" banner. cross-fades
       through config.js `liminal` pics with tv grain + a fake REC
       timestamp. empty list = a "NO SIGNAL" placeholder. drop pics
       in assets/liminal/ and list them in config.js.
   ============================================================ */
(function liminal() {
  const box = document.getElementById('liminal');
  if (!box) return;
  const pics = (window.GB_CONFIG && window.GB_CONFIG.liminal) || [];
  const timeEl = box.querySelector('.liminal-time');

  if (timeEl) {
    const p2 = (n) => String(n).padStart(2, '0');
    const tick = () => { const d = new Date(); timeEl.textContent = `${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`; };
    tick(); setInterval(tick, 1000);
  }

  if (!pics.length) { box.classList.add('empty'); return; } // NO SIGNAL placeholder stays

  const ns = box.querySelector('.liminal-nosignal');
  if (ns) ns.remove(); // pics exist, so drop NO SIGNAL (no peeking through during fades)
  const scan = box.querySelector('.liminal-scan');
  const a = document.createElement('img'), b = document.createElement('img');
  a.className = b.className = 'liminal-slide'; a.alt = b.alt = '';
  box.insertBefore(b, scan); box.insertBefore(a, scan);
  const layers = [a, b];
  let top = 0, idx = 0;
  a.src = pics[0]; a.classList.add('on');

  if (REDUCED || pics.length < 2) return; // show the first, don't cycle

  setInterval(() => {
    idx = (idx + 1) % pics.length;
    const cur = layers[top], next = layers[1 - top];
    next.onload = next.onerror = () => { next.classList.add('on'); cur.classList.remove('on'); top = 1 - top; };
    next.src = pics[idx];
  }, 4200);
})();

/* ============================================================
   15. TEXT INJECTION - pulls editable copy from config.js
       (GB_CONFIG.text) into the page. only overrides when the key
       exists, so the HTML defaults stand otherwise.
   ============================================================ */
(function injectText() {
  const set = (sel, val) => { const el = document.querySelector(sel); if (el && val != null) el.textContent = val; };
  set('#whisper', TXT.whisper);
  set('.counter-label', TXT.counterLabel);
  set('.about-head', TXT.aboutHead);
  if (document.querySelector('.about')) { // marquees differ per page; only retext them on the homepage
    const dupe = (sel, val) => { const el = document.querySelector(sel); if (el && val) { const u = val + '     '; el.innerHTML = window.cemojify ? window.cemojify(u + u) : (u + u); } };
    dupe('.marquee.top .marquee-run', TXT.marqueeTop);
    dupe('.marquee.bottom .marquee-run', TXT.marqueeBottom);
  }
  if (Array.isArray(TXT.confessTruths) && TXT.confessTruths.length) {
    const ul = document.querySelector('.truths');
    if (ul) ul.innerHTML = TXT.confessTruths.map((s) => '<li>' + s + '</li>').join('');
  }
  // generic: any element with data-txt="key" / data-html="key" gets TXT[key]
  document.querySelectorAll('[data-txt]').forEach((el) => { const v = TXT[el.getAttribute('data-txt')]; if (v != null) el.textContent = v; });
  document.querySelectorAll('[data-html]').forEach((el) => { const v = TXT[el.getAttribute('data-html')]; if (v != null) el.innerHTML = (window.cemojify ? window.cemojify(v) : v); });
})();

/* ============================================================
   16. SITE LOGO - click the big scoofy.xyz for a confetti pop +
       a scale bounce. (the rainbow / jitter / glow live in CSS.)
   ============================================================ */
(function siteLogo() {
  const logo = document.getElementById('siteLogo');
  if (!logo) return;
  logo.addEventListener('click', () => {
    const r = logo.getBoundingClientRect();
    if (typeof boom === 'function') boom(r.left + r.width / 2, r.top + r.height / 2);
    try { logo.animate([{ scale: '1' }, { scale: '1.4' }, { scale: '1' }], { duration: 420, easing: 'ease-out' }); } catch (e) {}
  });
})();