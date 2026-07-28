// ============================================================
//  scoofy.xyz :: guestbook server  -  EPHEMERAL, in-memory
//  Runs on Railway / Render / Fly / any Node host. There is NO
//  database and NO file persistence: every signature lives in RAM.
//  When this process stops or redeploys, the whole guestbook is
//  WIPED. That's intentional - it's a temporary wall by design.
//  Zero npm dependencies. Just:  node server.js
// ============================================================
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const IP_SALT = process.env.IP_SALT || 'scoofy-change-this-salt';

// ---- knobs ----
const MAX_ENTRIES = 500;              // keep the newest N in memory
const SIGN_COOLDOWN_MS = 30 * 60 * 1000; // 1 signature per IP per 30 minutes
const DAILY_CAP = 25;                 // max signatures per IP per day
const IDX_MAX = 1000;                 // sane upper bound for any index

// ---- EPHEMERAL STATE (all in RAM, gone on restart) ----
let entries = [];               // [{id, pfp,a,b,c,msg, likes, ts, country}]
const likesByIp = new Map();    // iphash -> Set(entryId)
const cooldown = new Map();     // iphash -> last-sign timestamp
const daily = new Map();        // iphash -> { day:'YYYY-MM-DD', count }

// ---- helpers ----
const ipHash = (ip) => crypto.createHash('sha256').update(IP_SALT + '|' + ip).digest('hex').slice(0, 24);
function clientIP(req) {
  return req.headers['cf-connecting-ip']
    || (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket.remoteAddress || '0.0.0.0';
}
// country flag comes from the cf-ipcountry header - i.e. only when Cloudflare
// is proxying in front (recommended, see GUESTBOOK_SETUP.md). Otherwise blank.
const country = (req) => String(req.headers['cf-ipcountry'] || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);

function sendJSON(res, status, obj) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise((resolve) => {
    let d = '', over = false;
    req.on('data', (c) => { d += c; if (d.length > 4000) over = true; });
    req.on('end', () => resolve(over ? null : d));
    req.on('error', () => resolve(null));
  });
}

// ---- API ----
async function api(req, res, url) {
  const hash = ipHash(clientIP(req));

  if (url.pathname === '/api/guestbook' && req.method === 'GET') {
    return sendJSON(res, 200, { ok: true, entries, myLikes: [...(likesByIp.get(hash) || [])], you: { country: country(req) } });
  }

  if (url.pathname === '/api/guestbook' && req.method === 'POST') {
    let body; try { body = JSON.parse(await readBody(req)); } catch { return sendJSON(res, 400, { error: 'bad json' }); }
    const idx = (v) => Number.isInteger(v) && v >= 0 && v < IDX_MAX;
    const { pfp, a, b, c, msg } = body || {};
    if (![pfp, a, b, c, msg].every(idx)) return sendJSON(res, 400, { error: 'invalid fields' });

    const now = Date.now();
    if (now - (cooldown.get(hash) || 0) < SIGN_COOLDOWN_MS) return sendJSON(res, 429, { error: 'slow down, one signature every 30 minutes' });
    const today = new Date().toISOString().slice(0, 10);
    const rec = daily.get(hash);
    const used = rec && rec.day === today ? rec.count : 0;
    if (used >= DAILY_CAP) return sendJSON(res, 429, { error: "that's enough signatures for today, champ" });

    // country flag only if the signer opted in. prefer the trusted cf-ipcountry
    // header; fall back to the client's detected 2-letter code (best-effort).
    const cleanCC = (x) => String(x || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
    const showCountry = (body && body.showCountry) === true;
    const cc = showCountry ? (country(req) || cleanCC(body.cc)) : '';

    const entry = { id: 'g' + now.toString(36) + Math.random().toString(36).slice(2, 7), pfp, a, b, c, msg, likes: 0, ts: now, country: cc };
    entries.unshift(entry);
    if (entries.length > MAX_ENTRIES) entries.length = MAX_ENTRIES;
    cooldown.set(hash, now);
    daily.set(hash, { day: today, count: used + 1 });
    return sendJSON(res, 200, { ok: true, entry });
  }

  if (url.pathname === '/api/like' && req.method === 'POST') {
    let body; try { body = JSON.parse(await readBody(req)); } catch { return sendJSON(res, 400, { error: 'bad json' }); }
    const id = typeof (body && body.id) === 'string' ? body.id : '';
    const entry = entries.find((e) => e.id === id);
    if (!entry) return sendJSON(res, 404, { error: 'unknown entry' });
    let set = likesByIp.get(hash); if (!set) { set = new Set(); likesByIp.set(hash, set); }
    let liked;
    if (set.has(id)) { set.delete(id); entry.likes = Math.max(0, entry.likes - 1); liked = false; }
    else { set.add(id); entry.likes += 1; liked = true; }
    return sendJSON(res, 200, { ok: true, id, likes: entry.likes, liked });
  }

  return sendJSON(res, 404, { error: 'not found' });
}

// ---- static files ----
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.avif': 'image/avif',
};
function serveStatic(req, res, url) {
  let p = decodeURIComponent(url.pathname);
  if (p === '/' || p === '') p = '/index.html';
  const filePath = path.normalize(path.join(ROOT, p));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end('nope'); }
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('404 - how tf did you find this path'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
  if (url.pathname.startsWith('/api/')) return api(req, res, url);
  return serveStatic(req, res, url);
}).listen(PORT, () => console.log('scoofy.xyz guestbook (ephemeral, in-memory) listening on :' + PORT));
