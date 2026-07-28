# Guestbook → going LIVE (ephemeral, Railway-style)

The guestbook is **temporary by design**: every signature lives in the server's memory (RAM).
When the deployment **stops, sleeps, or redeploys, the whole wall is wiped.** No database, no files,
nothing to clean up. That's the point.

Until it's deployed, the page runs in **demo mode** (entries kept in the browser's memory, gone on
refresh). The status pill in the feed header tells you which mode you're in.

---

## What runs it

- `server.js` - a **zero-dependency** Node server. Serves the static site **and** the `/api/*`
  guestbook endpoints, holding all signatures in memory.
- `package.json` - just `npm start` → `node server.js`. No packages to install.

```
GET  /api/guestbook   → list current signatures
POST /api/guestbook   → sign (body = integer indices only)
POST /api/like        → toggle a like
```

---

## Self-host on Windows (double-click, no cloud)

Just want it running on your own machine? Double-click **`host.bat`**. It checks Node is installed,
picks a port (default `3000`, or `host.bat 8080` for another), opens the guestbook in your browser,
and runs the server. **Close the window to stop it - which wipes the guestbook** (ephemeral, remember).

While it's up it's reachable at:
- `http://localhost:3000` - this PC
- `http://<your-LAN-ip>:3000` - anyone on the same wi-fi (the bat prints your LAN ip)

To let people **outside** your network sign it, either forward the port on your router, or run a
tunnel - e.g. `cloudflared tunnel --url http://localhost:3000` hands you a public https link and
routes through Cloudflare, so you keep that protection layer **and** the country flags (the
`cf-ipcountry` header comes through the tunnel) without touching your router.

> Heads up: your PC has to stay on and running `host.bat` for the site to be reachable. For an
> always-on link, use Railway below instead.

---

## Deploy on Railway (~3 min)

1. Push this folder to a GitHub repo (or use Railway's "Deploy from local").
2. **railway.app → New Project → Deploy from GitHub repo** → pick it.
3. Railway auto-detects Node, runs `npm start`, and injects a `PORT` - `server.js` already reads
   `process.env.PORT`. Nothing else to configure.
4. Open the generated URL. The pill flips to **🟢 LIVE**. Sign it. Redeploy → it's empty again
   (that's the ephemeral behavior working).

> Same thing works on **Render**, **Fly.io**, **Glitch**, or any Node host - they all set `PORT`
> and run `npm start`. Pick whichever you like; the code doesn't care.

### Recommended: put Cloudflare in front (protection + flags)
You wanted the Cloudflare "layer against hackers" - keep it by proxying your domain through
Cloudflare to the Railway URL:
- In Cloudflare DNS, add a **proxied** (orange-cloud) record pointing `scoofy.xyz` at the Railway host.
- Cloudflare's WAF/bot-protection now sits in front, **and** it adds the `cf-ipcountry` header, which
  is what draws the **country flag** on each signature. (Without Cloudflare, signatures just show no
  flag - everything else works fine.)
- Set an env var **`IP_SALT`** (Railway → Variables) to any long random string. It salts the IP hash
  used for rate-limiting, so raw IPs are never stored.

---

## Editing content

Everything player-facing lives in **`config.js`** (faces, username keywords, messages). You never
touch `guestbook.js` or `server.js` to add a face or a message. See `config.js` - it's all commented.

## Knobs (top of `server.js`)

| const | default | meaning |
|-------|---------|---------|
| `MAX_ENTRIES`      | 500 | keep the newest N in memory |
| `SIGN_COOLDOWN_MS` | 60000 | min ms between signatures per IP |
| `DAILY_CAP`        | 25  | max signatures per IP per day |

## Safety model (the anti-hacker part)

- **No stored free text.** The browser only ever sends **integers** (which face / name-parts /
  message). The server stores integers. There is nothing to inject - stored XSS is impossible.
- **Raw IPs are never stored** - only a salted SHA-256 hash, for rate-limit + one-like-per-IP.
- **Rate limited** per IP (cooldown + daily cap); Cloudflare in front adds WAF/bot filtering.
- Output is HTML-escaped client-side too, belt-and-suspenders.
- Path-traversal guarded in the static server.

## Honest caveats

- **It forgets everything on restart.** By design. If you ever want it to persist, swap the
  in-memory `entries`/`Map`s in `server.js` for a store (SQLite/Redis/D1) - the frontend won't change.
- In-memory means **one instance only.** Don't scale `server.js` to multiple replicas or each would
  have its own separate list. One container is perfect for this.
