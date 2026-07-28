# AI HANDOFF - scoofy.xyz

Read this before touching anything. This is a personal site owned by the user (goes by
**Larpbase**, he/him). It is a **static site**: plain `index.html` + `styles.css` + `script.js`,
no build step, no framework, no dependencies, no server. Open `index.html` directly in a browser.

---

## 0. THE VIBE (do not sanitize this)

The site is **intentionally, gloriously ugly** - cursed 2003-geocities energy. Comic Sans,
seizure rainbow background, scrolling marquees, WordArt headline, blinking badges, a fake hit
counter, an emoji cursor trail, and win98-style meme popups. **This is the whole point.** The
running joke is: *"hi. how tf did you find my site."* - the page acts confused and mildly hostile
that anyone showed up.

**If it looks like bad design, that's the design.** Do NOT:
- "clean up" the ugliness, tone down the colors, or make it tasteful
- remove the jokes, the hostility, or the chaos
- add corporate polish, disclaimers, or cookie banners

The user's voice is casual/lowercase and funny. Match it. Don't lecture him.

**HARD RULES (non-negotiable, from the owner):**
1. **NEVER use em dashes** (the long dash character, U+2014). Not in site copy, not in code
   comments, not in docs, not in commit messages, not in chat. Use a comma, a period, parentheses,
   or a plain hyphen instead. Zero tolerance, he checks.
2. **Never write anything that could stir drama.** Unhinged and absurd is the whole vibe, keep it.
   But avoid anything that reads as a real dig at a person, group, or brand, or anything
   controversial that invites a fight. Weird, yes. Provocative or divisive, no.

---

## 1. FILE MAP

```
scoofy.xyz/
├─ index.html            # the landing page (hero + ABOUT ME dropdowns + retirement notice)
├─ 404.html              # cursed not-found page (GitHub Pages serves it automatically)
├─ guestbook.html        # the guestbook page (same style, links index.html)
├─ styles.css            # all styling (STUPID MODE) - shared by every page
├─ script.js             # shared behavior - numbered sections 0-11 (11 = the 2003 sound)
├─ config.js             # >>> EDIT THIS <<< guestbook faces / names / messages (loaded before guestbook.js)
├─ guestbook.js          # guestbook behavior (loaded AFTER script.js + config.js)
├─ server.js             # EPHEMERAL Node backend (zero deps) - serves site + /api, in-memory
├─ package.json          # just `npm start` -> node server.js
├─ host.bat              # Windows: double-click to self-host the ephemeral server on a port
├─ CNAME                 # GitHub Pages custom domain (scoofy.xyz)
├─ .nojekyll             # tells GitHub Pages to serve files raw (no Jekyll)
├─ GUESTBOOK_SETUP.md    # how to deploy it live (self-host bat / Railway / tunnel)
├─ AI_HANDOFF.md         # this file
├─ assets/
│  ├─ pfps/              # drop custom avatar images/gifs here, then list them in config.js
│  └─ cursors/           # the ACTIVE cursors (25x32 pngs) used by the site
│     ├─ pointer1.png  pointer2.png   # normal cursor, 2-frame burn animation
│     └─ link1.png     link2.png      # "hovering a clickable" cursor, 2-frame burn
├─ cursor/               # the user's ORIGINAL hand-drawn cursor frames (1280x1280)
│  └─ pointer_frame1.png, pointer_frame2.png, link_frame1.png, link_frame2.png
└─ memes/                # meme images used by the popup system (see §4)
```

`cursor/` = source art (huge). `assets/cursors/` = the processed 25x32 versions the site loads.
If the user redraws a cursor, re-run the resize (see §3) to regenerate `assets/cursors/`.

There is also an unrelated sibling folder outside this project the user pointed us at once:
`C:\Users\Rocky\Documents\250-html-effects-vfx-main` - a stash of 250 standalone HTML effect
demos. We **lifted techniques** (not files) from a few: text-scramble (#004), particle-network
(#026), spotlight (#226), confetti (#249). You may mine it for more if asked.

---

## 2. script.js SECTION GUIDE

`script.js` is one file, plain IIFEs, commented with numbered sections:

- **0. LOCKDOWN** - blocks right-click (`contextmenu`), text selection (`selectstart`),
  drag (`dragstart`), and devtools shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U). Paired with
  `user-select: none` in CSS. NOTE: this only deters casual users; you CANNOT truly block
  devtools on a static site. Don't pretend otherwise to the user.
- **1. cursor trail** - spawns fading emoji (✨👽🛸💿…) on pointermove. Throttled to ~45ms.
- **1.5 BURN CURSOR** - the custom animated cursor. ⚠️ SEE §3, it has a critical gotcha.
- **2. scramble kicker** - the `//` accusation line up top decodes in like a terminal, rotates
  through a list of lines. (technique from effect #004)
- **3. confetti** - `boom(x,y)` burst function. (technique from effect #249)
- **4. percent** - the "87% sure i forgot the domain" number randomizes.
- **5. hit counter** - fake odometer that ticks up on its own; insults you if clicked.
- **6. confession sheet** - the "i'll explain myself" modal; fires confetti on open.
- **7. leave button** - dodges the cursor 3x, then on click shrinks the page and snaps back
  with "oh you're still here lol".
- **8. type-anywhere** - typing reacts in the whisper line (try "hi", "scoofy", "who", "why").
- **9. MEME POPUPS** - win98 windows full of memes. SEE §4.
- **10. console message** - a line for anyone who opens the console.

Everything is guarded with `if (element)` and a `REDUCED` (prefers-reduced-motion) check.

---

## 3. THE CUSTOM CURSOR - READ BEFORE "FIXING" IT ⚠️

This is the part a future AI is most likely to "helpfully" break. Here's the full story so you
don't.

**Goal:** an *animated* hand cursor (2 frames alternating = a hand-drawn "line burn" flicker),
with a different hand when hovering clickable things.

**Two things that are NOT bugs:**

1. **CSS cursors cannot animate.** `cursor: url(a.gif)` freezes on frame 1. There is no CSS-only
   way to animate a cursor. So animation MUST be driven by JS.

2. **Rapidly swapping `cursor: url()` in JS flickers to the OS default arrow.** We tried it. On
   Windows/Chrome, changing the CSS cursor image every ~140ms makes the browser blink to the
   system arrow between swaps. This looked broken. **This is why we do NOT use `cursor: url()`
   for the animation.**

**The solution we settled on (keep it):** hide the real cursor entirely and draw a fake one.
- CSS: `html.js-cursor, html.js-cursor * { cursor: none !important; }`
- JS (section 1.5) creates a `#fakecur` `<div>` with a `background-image`, adds `.js-cursor` to
  `<html>`, and moves the div to follow `pointermove` via the CSS **`translate`** property
  (NOT `transform`) - this is deliberate so the wobble can use `scale`/`rotate` on the same
  element without the position overwriting it.
- A `setInterval(…, 140)` swaps the div's background between frame 1 and frame 2 = the burn.
- Hover detection via `e.target.closest(CLICKABLE)` switches pointer↔link frames.
- **Wobble animations:** CSS `@keyframes cur-pop / cur-squish / cur-boing` animate `scale`+`rotate`
  (pivoting at the fingertip via `transform-origin: 3px 1px`). JS retriggers them by
  remove-class → reflow (`void offsetWidth`) → add-class. Fired on: first contact / window
  re-entry (`pop`), click (`squish`), landing on a clickable (`boing`).
- `#fakecur` has `pointer-events: none` so clicks pass through. z-index 99999 (above everything).

**Fallback:** if JS is off, or on touch (`(hover: hover) and (pointer: fine)` fails), or
reduced-motion, the script bails early and CSS shows a **static** hand via `cursor: url()`.
That's intentional - don't remove the CSS fallback either.

**Hotspot** (the real click pixel) is the fingertip: `HOT = { pointer:[2,1], link:[9,1] }` in JS,
mirrored as `2 1` / `9 1` in the CSS fallback. Keep them in sync if you change them.

**The 1280px gotcha:** the user draws cursors at **1280×1280**. Browsers **ignore** any cursor
image bigger than ~128px (best ≤32px). So originals in `cursor/` must be shrunk into
`assets/cursors/`. We resized to **25×32** (cropped to the top-left region where the hand lives,
same crop for all 4 frames so the animation doesn't jitter). Regenerate with this PowerShell
(System.Drawing), mapping `pointer_frame1→pointer1`, etc.:

```powershell
Add-Type -AssemblyName System.Drawing
$src="...\scoofy.xyz\cursor"; $dst="...\scoofy.xyz\assets\cursors"
$crop=New-Object 'System.Drawing.Rectangle' -ArgumentList 0,0,620,800
# load each bitmap, DrawImage into a 25x32 Format32bppArgb bitmap with HighQualityBicubic,
# Graphics cleared to Color::Transparent, then Save as PNG.
```
(Full working version is in the chat history / reproduce from the crop+resize pattern above.)

---

## 4. MEME POPUP SYSTEM (section 9)

Cursed win98 windows that pop up with a meme + a caption in a comic-sans title-barred frame.
They're **draggable** by the title bar, auto-dismiss after ~9-13s, cap at 3 on screen.

- Images live in `memes/`. Filenames contain spaces (and one `.mp4`), so src is built with
  `` `memes/${encodeURIComponent(m.f)}` ``. Keep that encoding or spaces break.
- The `MEMES` object maps a key → `{ f: "filename", c: "caption", v: true? }`. `v:true` renders
  a `<video autoplay muted loop>` instead of `<img>` (used for the fish `.mp4`).
- Triggers: one shows ~4.5s after load ("i can see you looking"); random ones every ~12s; and
  action-linked ones - confess→creator gif, leave→sad dog, counter-clicks→sus fish / crazy wolf.
- **To add a meme:** drop the file in `memes/`, add an entry to `MEMES` with a caption in the
  site's voice, and it joins the random rotation automatically.

Note: `styles.css` sets `img, video { pointer-events: none }` globally (part of the lockdown),
so popups are dragged via the title-bar `<div>`, not the image. Don't "fix" that.

---

## 6.5 ABOUT ME DROPDOWNS + RETIREMENT NOTICE (index.html)

Below the hero: an `<section class="about">` with three native `<details class="drop">`
accordions (no JS - `<details>` handles open/close, works even if JS is off). Order:
**where 2 find me** (yt/tiktok), **who even am i** (bio + fursona), **site lore [ARCHIVED]**
(history + the Fable-5 confession). The `.drop-ico` emoji are **placeholder icons** - swap for
`<img>` later. `summary` was added to the burn-cursor `CLICKABLE` list and the CSS hover
fallback so the link-hand shows on them.

Then `<section class="signoff">` - the retirement notice (done with coding + roblox, moving to
YouTube, dated **July 27 2026**, thanks himself). Pure content/CSS, no JS.

The `.gb-link` button jumps to `guestbook.html`. (Footer still jokes "there is no guestbook" -
that gag stays; the real link lives up in the about section.)

## 7. GUESTBOOK (guestbook.html + guestbook.js)

Same cursed shell (loads `styles.css` + `script.js`, so it inherits the burn cursor, emoji trail,
lockdown, marquees, and meme popups for free - the index-only bits are element-guarded and just
no-op here). `guestbook.js` runs AFTER `script.js` and reuses its globals `boom(x,y)` (confetti)
and `spawnMeme(key)`.

**The whole point:** users cannot free-type anything (anti-abuse, since it's unmoderated). All three
are configured in **`config.js`** (append-only):
- **Face:** `config.pfps` - an emoji (auto-tiled by `avatar()`) OR a path to a custom image/gif in
  `assets/pfps/` (e.g. `'assets/pfps/wolf.gif'`), or `{img}` / `{emoji,bg}` objects. `resolvePfp()`
  figures out which. gifs animate.
- **Name:** built from `config.nameParts.a/b/c` (adj + critter + suffix) → e.g. `feralPossum_2003`.
  No text input = anonymous, no slurs/doxxing.
- **Message:** chosen from `config.messages` only.

**TWO MODES (auto-detected on boot):**
- **LIVE** - the ephemeral Node backend (`server.js`) answers `/api/*`. One shared in-memory list,
  real IP-based country flag (from Cloudflare's `cf-ipcountry` header when proxied), server-side
  rate limiting. See `GUESTBOOK_SETUP.md` to deploy (Railway etc.).
- **DEMO** - backend unreachable (opened as a local `file://`, or not deployed). Entries kept in a
  plain in-memory array, gone on refresh. NO localStorage, NO disk - temporary on purpose.
  `guestbook.js` probes `/api/guestbook` with a 6s timeout; the status pill shows the mode.

**EPHEMERAL BY DESIGN:** `server.js` holds all signatures in RAM (`let entries`, plus `Map`s for
per-IP likes / cooldown / daily cap). Stop or redeploy the server → the guestbook is wiped. No DB.
Keep it to ONE instance (multiple replicas = separate lists). To ever persist, swap the in-memory
store in `server.js` for SQLite/Redis/etc - the frontend won't change.

**Client sends INTEGERS only** (`{pfp,a,b,c,msg}` indices). Server stores integers, never free text
→ stored XSS is impossible. Entries carry only a 2-letter country code; raw IPs are never stored
(salted SHA-256 hash only). ⚠️ Because entries store INDICES, `config.js` is **append-only** - never
reorder/delete `pfps` / `nameParts` / `messages` or old signatures point at the wrong thing.

**No seeds / no bots** - the feed starts empty and shows only real signatures. Live likes go through
`/api/like` (one per IP, reversible); demo likes are in-memory. Posting fires confetti + a `happyDog`
popup and re-randomizes the composer. Backend knobs are at the top of `server.js` (`MAX_ENTRIES`,
`SIGN_COOLDOWN_MS`, `DAILY_CAP`).

`.gb-pfp` / `.gb-msg` / chips / like buttons are real `<button>`s so the global
`img,video{pointer-events:none}` rule (from the lockdown) doesn't block them - clicks on the inner
`<img>` fall through to the parent button. Don't "fix" that.

**Country flags (opt-in):** each signer chooses "show my flag" or "anonymous" (compose step 4,
persisted in `localStorage` `gb_showcc`). The visitor's country is detected client-side via a free
geo lookup (`ipwho.is`) so it works on static hosting; in LIVE mode behind Cloudflare the server
prefers the trusted `cf-ipcountry` header. Anonymous means no country is stored at all. A tally
("signers from: [flag] CC n") renders above the feed (`renderCountries`).

**Sort toggle:** newest vs most-liked, above the feed (`sortMode`, `.gb-sortbtn`).

**Hosting = GitHub Pages + the scoofy.xyz domain** (see `CNAME` + `.nojekyll`). Pages is static, so
the guestbook runs in DEMO mode there: entries persist per-browser in `localStorage`, NOT shared
between visitors (a static host has no server to share one list). Every feature still works; it
becomes a real shared wall only when pointed at the Node server (Railway / tunnel). No seeds/bots,
so a fresh browser starts empty.

**Sound (script.js §11):** WebAudio. Sounds are PLACEHOLDERS: `config.js` `sfx` maps
`dialup` / `click` / `sign` to files in `assets/sfx/`. Each is prefetched + decoded; if a file is
missing, a synthesized beep plays instead (never silent). `window.playSfx(name)` is the entry point
(guestbook.js calls `playSfx('sign')`). Dialup fires on the first user gesture; the fixed
`#soundtoggle` mutes (default ON, saved in `localStorage` `scoofy_sound`); if the first click IS the
mute button the modem does not blast. NOTE: because the sound reads `GB_CONFIG`, **`config.js` now
loads BEFORE `script.js` on every page** (index, 404, guestbook).

**404.html:** cursed not-found page, auto-served by GitHub Pages. Loads the shared shell.

## 5. GOTCHAS / DON'T-BREAK LIST

- **No emojis in the user-facing copy?** The site copy uses some emoji intentionally (badges,
  marquees). That's fine here. (Separate from any assistant-output style rules.)
- `img, video { pointer-events: none }` is deliberate (see §4).
- The lockdown (§0, section 0) will make normal debugging annoying for YOU too - right-click and
  F12 are blocked on the live page. Edit the files directly; don't rely on in-page inspection.
- Everything is vanilla. Do not introduce a framework, bundler, or CDN dependency unless the user
  explicitly asks. It must keep working by double-clicking `index.html`.
- Keep the `REDUCED` (prefers-reduced-motion) and touch fallbacks intact.

---

## 6. HOW TO WORK WITH THIS USER

- He's building this for fun and testing ideas as he goes. Move fast, show results, open the file
  in the browser so he can see it (`Start-Process index.html` on Windows).
- Match his energy: casual, funny, lowercase, no hand-wringing. He likes "make it stupider."
- When he drops files in a folder, go look at them before assuming what they are.
- Don't over-question. Build the obvious thing, show it, iterate.

- handoff written by the AI that built the cursor system and the meme popups. good luck, be cool.
```
