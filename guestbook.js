// scoofy.xyz :: GUESTBOOK :: no free typing, no bots, opt-in flags
// depends on: config.js (window.GB_CONFIG) + script.js (boom(), spawnMeme()).
//
// TWO MODES, auto-detected:
//   LIVE  - the Node backend (/api/*) answers. one shared list, server-side
//           rate limiting. wiped on restart (ephemeral by design).
//   DEMO  - backend unreachable (GitHub Pages / local file / not deployed).
//           entries persist in this browser's localStorage. not shared between
//           visitors (a static host has no server to share one list), but every
//           feature still works and it lights up fully once a backend is attached.
'use strict';

/* ============================================================
   CONFIG (edit config.js, not this file)
   ============================================================ */
const CFG = window.GB_CONFIG || {};
const DEFAULT_PFPS = ['🐺','🐯','🦊','🦝','🦎','🐸','🦇','🦈','🐊','🐗','🦉','🐙','🦫','👽'];
const DEFAULT_NAMES = {
  a: ['sleepy','feral','tuff','cursed','sus','based','unhinged','anonymous'],
  b: ['wolf','tiger','possum','raccoon','gecko','moth','goblin','frog'],
  c: ['','_2003','.exe','~','_official','_real'],
};
const DEFAULT_MSGS = ['how tf did i even find this site','guess i\'ll... sign the guestbook','netscape navigator gang, rise UP'];

/* ============================================================
   ENDPOINTS + STATE
   ============================================================ */
const API = { list: '/api/guestbook', sign: '/api/guestbook', like: '/api/like' };
let MODE = 'demo';
let serverEntries = [];          // live entries (indices, not text)
let myLikes = new Set();         // live: ids this IP liked
let myGeo = null;                // live: server-reported { country }
let myCC = '';                   // this visitor's 2-letter country (detected)
let sortMode = 'new';            // 'new' | 'top'

/* ---- localStorage (demo persistence + opt-in country choice) ---- */
const LS_ENTRIES = 'gb_entries_v1';
const LS_LIKED = 'gb_liked_v1';
const LS_SHOWCC = 'gb_showcc';
const loadEntries = () => { try { return JSON.parse(localStorage.getItem(LS_ENTRIES)) || []; } catch { return []; } };
const saveEntries = (a) => { try { localStorage.setItem(LS_ENTRIES, JSON.stringify(a.slice(0, 200))); } catch {} };
const loadLiked = () => { try { return new Set(JSON.parse(localStorage.getItem(LS_LIKED)) || []); } catch { return new Set(); } };
const saveLiked = (s) => { try { localStorage.setItem(LS_LIKED, JSON.stringify([...s])); } catch {} };

let localEntries = loadEntries();
let localLikes = loadLiked();
let showCountry = localStorage.getItem(LS_SHOWCC) !== 'off'; // default: show your flag

/* ============================================================
   FACES - config-driven, supports emoji OR image/gif paths.
   ============================================================ */
const PFP_BG = ['#3a2a6b','#6b2a2a','#8a3a12','#2a3a5b','#1f5b2a','#2a6b3a','#1a1a2e','#1f4a6b','#3a5b1f','#5b3a2a','#4a3a1f','#6b2a5b','#4a3320','#2a5b5b','#5b1f3a','#1f2a5b','#3a5b5b','#5b4a1f'];
function avatar(emoji, bg) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'>` +
    `<rect width='100' height='100' rx='14' fill='${bg}'/>` +
    `<text x='50' y='54' font-size='58' text-anchor='middle' dominant-baseline='central'>${emoji}</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}
const isImgPath = (s) => typeof s === 'string' && (s.indexOf('/') !== -1 || /\.(png|jpe?g|gif|webp|svg|avif|bmp)(\?.*)?$/i.test(s));
function resolvePfp(entry, i) {
  const bg = PFP_BG[i % PFP_BG.length];
  if (entry && typeof entry === 'object') {
    if (entry.img) return entry.img;
    if (entry.emoji) return avatar(entry.emoji, entry.bg || bg);
  }
  if (typeof entry === 'string') return isImgPath(entry) ? entry : avatar(entry, bg);
  return avatar('👽', bg);
}
const PFP_SRC = ((CFG.pfps && CFG.pfps.length) ? CFG.pfps : DEFAULT_PFPS).map(resolvePfp);
const pfpSrc = (i) => PFP_SRC[i] || PFP_SRC[0];

/* ============================================================
   NAMES + MESSAGES (config-driven, append-only)
   ============================================================ */
const NAME_A = (CFG.nameParts && CFG.nameParts.a) || DEFAULT_NAMES.a;
const NAME_B = (CFG.nameParts && CFG.nameParts.b) || DEFAULT_NAMES.b;
const NAME_C = (CFG.nameParts && CFG.nameParts.c) || DEFAULT_NAMES.c;
const MESSAGES = (CFG.messages && CFG.messages.length) ? CFG.messages : DEFAULT_MSGS;

const cap = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : '');
const nameFrom = (a, b, c) => (NAME_A[a] ?? '???') + cap(NAME_B[b] ?? '') + (NAME_C[c] ?? '');
const msgFrom = (m) => MESSAGES[m] ?? '(a message lost to time)';

/* ============================================================
   COMPOSE STATE
   ============================================================ */
const rand = (n) => Math.floor(Math.random() * n);
let selPfp = rand(PFP_SRC.length);
let sel = { a: rand(NAME_A.length), b: rand(NAME_B.length), c: rand(NAME_C.length) };
let selMsg = -1;
const buildName = () => nameFrom(sel.a, sel.b, sel.c);

/* ============================================================
   HELPERS
   ============================================================ */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function flagEmoji(cc) {
  if (!cc || cc.length !== 2) return '🌍';
  const A = 0x1F1E6;
  return String.fromCodePoint(A + cc.charCodeAt(0) - 65, A + cc.charCodeAt(1) - 65);
}
function ago(ts) {
  const s = Math.max(0, (Date.now() - ts) / 1000);
  if (s < 45) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  if (s < 7 * 86400) return Math.floor(s / 86400) + 'd ago';
  return Math.floor(s / (7 * 86400)) + 'w ago';
}
function confettiAt(el) {
  if (typeof boom !== 'function' || !el) return;
  const r = el.getBoundingClientRect();
  boom(r.left + r.width / 2, r.top + r.height / 2);
}

/* detect the visitor's country client-side (works on static hosting).
   free, no key, CORS-friendly. graceful if blocked or offline. */
async function detectCountry() {
  if (myCC) return;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    const r = await fetch('https://ipwho.is/', { signal: ctrl.signal });
    clearTimeout(t);
    const d = await r.json();
    if (d && typeof d.country_code === 'string' && /^[A-Za-z]{2}$/.test(d.country_code)) {
      myCC = d.country_code.toUpperCase();
    }
  } catch { /* no country, no problem */ }
}

/* ============================================================
   RENDER: compose pieces
   ============================================================ */
function renderPfps() {
  const box = $('gbPfps');
  if (!box) return;
  box.innerHTML = '';
  PFP_SRC.forEach((src, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'gb-pfp' + (i === selPfp ? ' sel' : '');
    b.setAttribute('aria-label', 'pick avatar ' + (i + 1));
    b.innerHTML = `<img src="${esc(src)}" alt="" />`;
    b.addEventListener('click', () => { selPfp = i; renderPfps(); });
    box.appendChild(b);
  });
}

function renderName() {
  const cols = $('gbNameCols');
  if (cols) {
    cols.innerHTML = '';
    [['a', NAME_A], ['b', NAME_B], ['c', NAME_C]].forEach(([key, pool]) => {
      const col = document.createElement('div');
      col.className = 'gb-col';
      pool.forEach((word, i) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'gb-chip' + (sel[key] === i ? ' sel' : '');
        chip.textContent = word === '' ? '·none·' : word;
        chip.addEventListener('click', () => { sel[key] = i; renderName(); });
        col.appendChild(chip);
      });
      cols.appendChild(col);
    });
  }
  const prev = $('gbNamePrev');
  if (prev) prev.textContent = buildName();
}

function renderMsgs() {
  const box = $('gbMsgs');
  if (!box) return;
  box.innerHTML = '';
  MESSAGES.forEach((m, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'gb-msg' + (i === selMsg ? ' sel' : '');
    b.textContent = '“' + m + '”';
    b.addEventListener('click', () => {
      selMsg = i; renderMsgs();
      const w = $('gbWarn'); if (w) w.textContent = '';
    });
    box.appendChild(b);
  });
}

function renderCcToggle() {
  const b = $('gbCcToggle');
  if (!b) return;
  if (showCountry) {
    b.classList.remove('anon');
    b.textContent = myCC
      ? 'showing your flag: ' + flagEmoji(myCC) + ' ' + myCC + '  (tap to hide)'
      : '🌍 showing your country (locating...)';
  } else {
    b.classList.add('anon');
    b.textContent = '🕵 anonymous, no flag  (tap to show)';
  }
}

/* ============================================================
   RENDER: feed + country tally
   ============================================================ */
function rawEntries() {
  const src = MODE === 'live' ? serverEntries : localEntries;
  const likedSet = MODE === 'live' ? myLikes : localLikes;
  return src.map((e) => {
    const liked = likedSet.has(e.id);
    const base = e.likes || 0;
    return {
      id: e.id, pfpIdx: e.pfp, name: nameFrom(e.a, e.b, e.c), msg: msgFrom(e.msg),
      ts: e.ts, base, likes: MODE === 'live' ? base : base + (liked ? 1 : 0),
      liked, cc: e.country || '',
    };
  });
}
function displayList() {
  const out = rawEntries();
  if (sortMode === 'top') out.sort((a, b) => (b.likes - a.likes) || (b.ts - a.ts));
  else out.sort((a, b) => b.ts - a.ts);
  return out;
}

function entryHTML(d, fresh) {
  const geo = d.cc ? `<span class="gb-geo">${flagEmoji(d.cc)} ${esc(d.cc)}</span>` : '';
  return `<div class="gb-entry${fresh ? ' fresh' : ''}">` +
    `<div class="gb-entry-pfp"><img src="${esc(pfpSrc(d.pfpIdx))}" alt="" /></div>` +
    `<div class="gb-entry-main">` +
      `<div class="gb-entry-top"><span class="gb-entry-name">${esc(d.name)}</span>${geo}` +
        `<span class="gb-entry-time">${ago(d.ts)}</span></div>` +
      `<div class="gb-entry-msg">${window.cemojify ? window.cemojify(esc(d.msg)) : esc(d.msg)}</div>` +
      `<button class="gb-like${d.liked ? ' liked' : ''}" type="button" data-id="${esc(d.id)}" ` +
        `data-base="${d.base}" aria-pressed="${d.liked}">` +
        `<span class="gb-heart">${d.liked ? '♥' : '♡'}</span>` +
        `<span class="gb-like-count">${d.likes}</span></button>` +
    `</div></div>`;
}

function renderCountries() {
  const box = $('gbCountries');
  if (!box) return;
  const counts = {};
  rawEntries().forEach((d) => { if (d.cc) counts[d.cc] = (counts[d.cc] || 0) + 1; });
  const arr = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!arr.length) { box.style.display = 'none'; box.innerHTML = ''; return; }
  box.style.display = '';
  box.innerHTML = '<span class="gb-countries-label">signers from:</span>' +
    arr.map(([cc, n]) => `<span class="gb-cc-pill">${flagEmoji(cc)} ${esc(cc)} <b>${n}</b></span>`).join('');
}

function renderFeed(freshId) {
  const feed = $('gbFeed');
  if (!feed) return;
  const list = displayList();
  const countEl = $('gbCount');
  if (countEl) countEl.textContent = list.length;
  feed.innerHTML = list.length
    ? list.map((d) => entryHTML(d, d.id === freshId)).join('')
    : '<div class="gb-empty">no signatures yet. it\'s just you and the void. be the fuckin first.</div>';
  renderCountries();
}

function updateLikeBtn(btn, liked, count) {
  btn.classList.toggle('liked', liked);
  btn.setAttribute('aria-pressed', String(liked));
  btn.querySelector('.gb-heart').textContent = liked ? '♥' : '♡';
  btn.querySelector('.gb-like-count').textContent = count;
}

(function wireLikes() {
  const feed = $('gbFeed');
  if (!feed) return;
  feed.addEventListener('click', async (ev) => {
    const btn = ev.target.closest && ev.target.closest('.gb-like');
    if (!btn) return;
    const id = btn.dataset.id;

    if (MODE === 'live') {
      try {
        const res = await fetch(API.like, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) });
        const data = await res.json();
        if (data && data.ok) {
          if (data.liked) myLikes.add(id); else myLikes.delete(id);
          const se = serverEntries.find((e) => e.id === id);
          if (se) se.likes = data.likes;
          updateLikeBtn(btn, data.liked, data.likes);
          if (data.liked) confettiAt(btn);
        }
      } catch { /* network hiccup */ }
    } else {
      const nowLiked = !localLikes.has(id);
      if (nowLiked) localLikes.add(id); else localLikes.delete(id);
      saveLiked(localLikes);
      const base = parseInt(btn.dataset.base || '0', 10);
      updateLikeBtn(btn, nowLiked, base + (nowLiked ? 1 : 0));
      if (nowLiked) confettiAt(btn);
    }
  });
})();

/* ============================================================
   STATUS PILL
   ============================================================ */
function setStatus(state) {
  const el = $('gbStatus');
  if (!el) return;
  el.classList.remove('live', 'local');
  if (state === 'connecting') { el.textContent = '… connecting'; return; }
  const you = myCC ? ' · you’re ' + flagEmoji(myCC) : '';
  if (state === 'live') { el.classList.add('live'); el.textContent = '🟢 LIVE' + you; }
  else { el.classList.add('local'); el.textContent = '🔌 demo' + you; }
}

/* ============================================================
   ACTIONS
   ============================================================ */
function shuffleIdentity() {
  selPfp = rand(PFP_SRC.length);
  sel = { a: rand(NAME_A.length), b: rand(NAME_B.length), c: rand(NAME_C.length) };
  selMsg = rand(MESSAGES.length);
  renderPfps(); renderName(); renderMsgs();
  const w = $('gbWarn'); if (w) w.textContent = '';
}

function showWarn(text) {
  const w = $('gbWarn');
  if (!w) return;
  w.textContent = text;
  w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake');
}

let signCooldown = false;
async function sign() {
  if (selMsg < 0) { showWarn('↑ pick a message first, you menace'); return; }
  // 30-minute cooldown per browser (the server also enforces it per IP in live mode)
  const COOLDOWN_MS = 30 * 60 * 1000;
  const lastSign = parseInt(localStorage.getItem('gb_lastsign') || '0', 10);
  const since = Date.now() - lastSign;
  if (since < COOLDOWN_MS) {
    const mins = Math.max(1, Math.ceil((COOLDOWN_MS - since) / 60000));
    showWarn(`easy, 30 min cooldown. come back in ~${mins} min.`);
    return;
  }
  if (signCooldown) return;
  signCooldown = true;
  setTimeout(() => { signCooldown = false; }, 700);

  const payload = { pfp: selPfp, a: sel.a, b: sel.b, c: sel.c, msg: selMsg, showCountry, cc: myCC };

  if (MODE === 'live') {
    try {
      const res = await fetch(API.sign, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.ok) { showWarn(data.error || 'could not sign, try again'); return; }
      serverEntries.unshift(data.entry);
      afterSign(data.entry.id);
    } catch {
      showWarn('network hiccup, try again');
    }
  } else {
    localEntries.unshift({
      id: 'u' + Date.now().toString(36) + rand(1e6).toString(36),
      pfp: payload.pfp, a: payload.a, b: payload.b, c: payload.c, msg: payload.msg,
      likes: 0, ts: Date.now(), country: (showCountry && myCC) ? myCC : '',
    });
    saveEntries(localEntries);
    afterSign(localEntries[0].id);
  }
}

function afterSign(freshId) {
  try { localStorage.setItem('gb_lastsign', String(Date.now())); } catch {} // start the 30-min cooldown
  renderFeed(freshId);
  const w = $('gbWarn'); if (w) w.textContent = '';
  confettiAt($('gbSign'));
  if (typeof spawnMeme === 'function') spawnMeme('happyDog');
  if (typeof playSfx === 'function') playSfx('sign');
  selPfp = rand(PFP_SRC.length);
  sel = { a: rand(NAME_A.length), b: rand(NAME_B.length), c: rand(NAME_C.length) };
  selMsg = -1;
  renderPfps(); renderName(); renderMsgs();
  const first = document.querySelector('.gb-entry.fresh');
  if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ============================================================
   BOOT
   ============================================================ */
async function boot() {
  renderPfps(); renderName(); renderMsgs(); renderCcToggle();
  setStatus('connecting');

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(API.list, { signal: ctrl.signal });
    clearTimeout(t);
    const data = await res.json();
    if (res.ok && data && data.ok) {
      MODE = 'live';
      serverEntries = data.entries || [];
      myLikes = new Set(data.myLikes || []);
      myGeo = data.you || null;
      if (myGeo && myGeo.country) myCC = myGeo.country;
    } else { MODE = 'demo'; }
  } catch { MODE = 'demo'; }

  await detectCountry(); // fills myCC if the server didn't (i.e. static hosting)

  setStatus(MODE === 'live' ? 'live' : 'local');
  renderCcToggle();
  renderFeed();

  // wire controls
  $('gbShuffle')?.addEventListener('click', shuffleIdentity);
  $('gbSign')?.addEventListener('click', sign);
  $('gbCcToggle')?.addEventListener('click', () => {
    showCountry = !showCountry;
    localStorage.setItem(LS_SHOWCC, showCountry ? 'on' : 'off');
    renderCcToggle();
  });
  document.querySelectorAll('.gb-sortbtn').forEach((btn) => {
    btn.addEventListener('click', () => {
      sortMode = btn.dataset.sort === 'top' ? 'top' : 'new';
      document.querySelectorAll('.gb-sortbtn').forEach((b) => b.classList.toggle('sel', b === btn));
      renderFeed();
    });
  });
}

boot();
