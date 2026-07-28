// ============================================================
//  scoofy.xyz :: PAGE COPY        >>> EDIT YOUR WORDS HERE <<<
// ============================================================
//  This is the ONE file for all the wording on the pages: the
//  headline, the hero blurb, the ABOUT-ME dropdowns (where 2 find
//  me / who even am i / site lore), the OFFICIAL RETIREMENT NOTICE,
//  the confession panel, the marquees, badges, everything.
//
//  HOW TO EDIT:
//    - just change the text inside the quotes. save, reload. done.
//    - DON'T rename the keys (the word before the colon). only edit
//      what's inside the quotes.
//    - keys that hold a paragraph / list / body accept HTML: you can
//      use <b> <i> <a href="..."> <br>, and :emoji: codes (like
//      :scoofy: :mlm: :scoofy_nerd:). the plain-text keys are just words.
//    - an apostrophe inside a '...single-quoted...' value must be
//      written as  \'  (backslash apostrophe). double-quoted "..." values
//      don't need that.
//
//  (loads right AFTER config.js, so it fills in GB_CONFIG.text.)
// ============================================================
window.GB_CONFIG = window.GB_CONFIG || {};
window.GB_CONFIG.text = {

  /* ========================= HERO (top of homepage) ========================= */

  // the big shaking rainbow logo
  cornerLogo: "scoofy.xyz",

  // little tagline under the logo ('' = show nothing)
  tagline: '',

  // the rotating line up top (it scrambles in and cycles through all of these)
  kickers: [
    "// oh! a visitor! hi hi",
    "// wait, someone's actually here :3",
    "// incoming friend detected",
    "// you found it! welcome in",
    "// didn't expect you, but i'm glad",
    "// a wild guest appears. neat.",
  ],

  // the giant WordArt headline. <br> = new line. the <span class="tf"> word glows.
  headline: 'HAIII.<br>welcome to my<br>scoofed little<br><span class="tf">CORNER</span>',

  // the three blinking badges
  badge1: "NEW!",
  badge2: "HOT!!",
  badge3: "100% VIRUS FREE*",

  // the blurb under the headline. KEEP the <span id="percent"> - that number animates on its own.
  sub: 'i\'ve changed the design of this site like 10 times so far :scoofy_pet:, and i\'m about <span id="percent">87</span>% sure i forgot to renew the domain. so genuinely? <em>i\'m kinda happy you found it.</em>',

  // the two hero buttons
  btnConfess: "i'll explain myself »",
  btnLeave: "eh, fuck it, i'm out",

  // the fake hit counter: the label, then the lines it cycles through when clicked
  counterLabel: "you are visitor number",
  counterInsults: [
    "you are visitor number",
    "heehee, that tickles, keep going",
    "ok it's fake. it was always fake.",
    "i literally make the number up lol",
    "you're kinda fun, you know that?",
    "...fine, +1000, just for you",
  ],

  /* ========================= SCROLLING MARQUEES (homepage) ========================= */
  // you CAN use :emoji: codes in here now, e.g.  :scoofy:  :scoofy_up:  :mlm:

  marqueeTop: "★彡 WELCOME 2 MY WEBSITE 彡★ • how the fuck did u even find this :scoofy_nerd: (LWK TELL ME IN THE GUEST BOOK >:3) | UNDER CONSTRUCTION SINCE 2069 AHH",
  marqueeBottom: " you shouldn't be here but welcome anyway :3 • tell your friends. actually don't. • defo not romanian made :ro: •",

  /* ========================= ABOUT ME (heading above the dropdowns) ========================= */

  aboutHead: "ok since you're actually fuckin HERE here...",

  /* ========================= DROPDOWN: where 2 find me ========================= */

  dropWhere: "where 2 find me",
  dropWhereIntro: "i basically live in two (2) places now:",
  dropWhereList: '<li><b>YOUTUBE</b>: this is the main thing. the whole thing, actually. long stuff, dumb stuff, whatever i feel like. → <a href="https://www.youtube.com/@scoofyx" class="ext" target="_blank" rel="noopener">youtube.com/@scoofyx</a></li><li><b>TIKTOK</b>: random tiktoks you could never think of :dies:. → <a href="https://www.tiktok.com/@scoofyx" class="ext" target="_blank" rel="noopener">tiktok.com/@scoofyx</a></li>',
  dropWhereFoot: "everywhere else? assume it's as abandoned as this shithole.",

  /* ========================= DROPDOWN: who even am i ========================= */

  dropWho: "who even am i :scoofy_pet:",
  dropWhoIntro: 'HAIIIIII. I\'M <b>ScOoFyX</b> (he/him). i make things, i abandon things (A LOT:pensive:), it\'s a whole cycle.. :scoofy:',
  dropWhoBio: '<li><b>species:</b> fox-shark hybrid (mostly fox lmfao)</li><li><b>pronouns:</b> he/him :mlm: &nbsp;·&nbsp; <b>age:</b> 16</li><li><b>ma fur:</b> ultra violet its and some pinkish white :istg:</li><li><b>markings:</b> darker purple tiger stripes down the arms and legs, matching the tips of my BIGGG GIANT fox ears, plus a clean purple "X" on my back</li><li><b>hair:</b> a messy spiky purple tuft hair, inner ears flashing BRIGHTT HOT pink!</li><li><b>tail:</b> a shark tail in the same purple and white fluffy fluffer fur :blep:</li><li><b>extras:</b> round glasses with red and blue heterochromia eyes (i recently added glasses to my fursona cuz i have to wear glasses irl cuz of astigmatism & nearsightness :dies:)</li><li><b>Meaning of "X": it\'s deeper than it looks. I\'ve NEVER been able to lock in decisions (self-diagnosed hYpERaACtivE ADHD!!!:istg: makes me unable to commit to most things I want to do), so "X" became my escape, the <b>undecided variable</b>, the blank i never have to fill in. the x on my back has the same meaning.',
  dropWhoRefCap: "☝ the official ref sheet. click him to go big.",
  dropWhoFoot: "so yeah. purple fox-shark. that's the guy. that's me.",

  /* ========================= DROPDOWN: site lore ========================= */

  dropLore: 'site lore <span class="tag-archived">[ARCHIVED]</span>',
  dropLore1: 'this started life as a <i>portfolio</i>. obviously. they always do. :appear:',
  dropLore2: 'changed them about 4 times for no reason, i\'m pretty sure theres even a screenshot saved on internet archive on my site',
  dropLore3: 'it\'s <b>archived</b> now. frozen in TiMe (aka 2026). a monument to a series of insomnia nights decisions no one asked for.',
  dropLoreFoot: "nothing gets updated anymore. this is the final fuckin form!!!!! :3",

  /* ========================= GUESTBOOK BUTTON ========================= */

  gbLink: "✍ sign my guestbook (it's REAL now) »",

  /* ========================= OFFICIAL RETIREMENT NOTICE ========================= */

  signoffStar: "★彡 THE END OF AN ERA :disappear: 彡★",
  signoffTitle: "📢 OFFICIAL RETIREMENT NOTICE",
  signoffDate: 'as of <b>july 27, 2026</b> i\'m putting the keyboard down.',
  signoffList: '<li>done with <b>scripting &amp; coding</b>. genuinely. that chapter\'s closed. mostly...</li><li>done with <b>roblox</b> too. it was fun. they fucked their own game up (multi billionaire company that cant afford better HUMAN moderation btw).</li><li>pouring everything into <b>YOUTUBE</b> now → new chapter (hopefully).</li>',
  signoffThanks: 'and... thank you, <i>myself and kaspy (for supporting me)</i>. for being cool enough to build dumb little websites and worlds out of nothing. that was sick as hell. 🫡',

  /* ========================= CONFESSION PANEL ("i'll explain myself") ========================= */

  confessTitle: "OK FINE. THE TRUTH:",
  confessTruths: [
    "there is no truth. i made this shit for no reason and then forgot about it (i want attention!!!!!).",
    "this was gonna be a portfolio. then it became... whatever the hell THIS IS :disappear:",
    "the domain costed real fuckin money and THIS is what it's used for.",
  ],
  confessTiny: "refresh for a different set of bullshit ~*~",

  /* ========================= MEME POPUPS ========================= */

  // the fake window title-bar names the popups use
  winNames: ["scoofy.exe", "warning.exe", "popup.dll", "DO_NOT_CLOSE.exe", "trust_me.bat", "hello.exe", "free_ipod.exe", "totally_safe.exe", "clippy.dll", "scoofyx.gif", "screensaver.scr", "wow.exe"],

  // override a meme's caption:  memeKey: "text"  or  memeKey: ["a","b"].  {} = use the defaults in script.js
  memeCaptions: {},

};
