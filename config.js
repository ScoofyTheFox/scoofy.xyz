// ============================================================
//  scoofy.xyz :: GUESTBOOK CONFIG
//  This is the ONLY file you need to edit to change faces, names,
//  or messages. It's loaded before guestbook.js.
//
//  GOLDEN RULE: only ever ADD TO THE END of these lists. Never
//  reorder or delete items - signatures are stored as position
//  NUMBERS, so shuffling them repoints old entries at the wrong
//  face/word/message. (Everything's temporary anyway, but still.)
// ============================================================
window.GB_CONFIG = {

  // ---- FACES people can pick ---------------------------------------------
  // Add a face in any of these ways:
  //   • an emoji  ................  '🐺'            (auto-draws a colored tile)
  //   • YOUR image or gif  .......  'assets/pfps/mywolf.gif'
  //   • explicit object  .........  { img: 'assets/pfps/x.png' }
  //                                 { emoji: '🐺', bg: '#3a2a6b' }
  //  >> drop custom image/gif files into the  assets/pfps/  folder, then
  //     list their path here. gifs animate. any size works (shown as a square).
  pfps: [
    '🐺', '🐯', '🦊', '🦝', '🦎', '🐸', '🦇',
    '🦈', '🐊', '🐗', '🦉', '🐙', '🦫', '👽',

    // ── custom faces (real images + gifs) ──
    'assets/purple_morphing_fox.gif',
    'assets/rainbow_morphing_fox.gif',
    'assets/fox_silly.png',
    'assets/fox_blep.png',
    'assets/fox.jpg',
    'assets/fox_snow.jpg',
    // add more by dropping files in assets/ (or assets/pfps/) and listing them here
  ],

  // ---- USERNAME KEYWORDS -------------------------------------------------
  // People build an anonymous name by picking ONE word from each column:
  //     a + Capitalized(b) + c     →    feral + Possum + _2003  =  feralPossum_2003
  // '' in column c = "no suffix". Edit/add freely (append-only).
  nameParts: {
    a: ['sleepy','feral','tuff','cursed','legally','mildly','extremely','sus','based','unhinged','dizzy','radioactive','nocturnal','discount','anonymous','forbidden','emotional','sopping','vintage','haunted'],
    b: ['wolf','tiger','possum','raccoon','gecko','moth','goblin','frog','crow','ferret','axolotl','shark','bat','husky','opossum','skunk','otter','dragon','snail','gremlin'],
    c: ['','_2003','_420','.exe','.zip','_v2','~','_official','_69','_XxX','_real','_online','_ttv','_fr','_wav'],
  },

  // ---- MESSAGES people can pick (no free typing, ever) -------------------
  // The ONLY things anyone can "say". All pre-written, in the site's voice.
  // Append your own - keep them short and funny.
  messages: [
    "how the fuck did i even find this site :disappear:",
    "i was NOT supposed to be here. staying anyway. :dope_scoofy:",
    "signing the guestbook that swore it didn't exist. gotcha.",
    "netscape navigator gang, rise UP",
    "certified 2003.",
    "clicked one (1) wrong link and now i live here",
    "the hit counter lied to my ass and honestly? respect.",
    "would get lost here again. immediately.",
    "why is the fish looking at me like that",
    "i'm legally scoofy's friend now. i read the terms.",
    "under construction since 2003 and it SHOWS (affectionate)",
    "the burn cursor is unreasonably cool, just saying",
    "came for the vibes, stayed bc the leave button ran away :pensive:",
    "this website pays for itself in vibes fr fr",
    "guess i'll... sign the guestbook",
    "best viewed in netscape, worst viewed in public",
    "my mom asked what i was doing. couldn't explain this.",
    "popup number 4 is my roman empire now",
    "i have no idea what year it is anymore and i'm okay",
    "scoofy if you see this: hi. this rules. carry on.",
    "pressed every single button. worth it. no regrets.",
    "found this at 3am and it healed something in me",
    "no fuckin clue how i got here but hi",
    "this site is cursed as hell and i'm STAYING!!",
    "10/10 would waste my ass here again",
    "this fucking cursor IS SOOOOO COOL",
  ],

  // ---- SOUND EFFECTS (placeholders) ------------------------------------
  // drop your own audio into  assets/sfx/  and point to it here (mp3/wav/ogg).
  // if a file is missing, a built-in synthesized beep plays instead, so it is
  // never silent. delete a line (or set '') to force the synth for that one.
  sfx: {
    dialup: 'assets/sfx/dialup.mp3', // plays once on the first click (the 2003 modem)
    click:  'assets/sfx/click.mp3',  // every button / link click
    sign:   'assets/sfx/sign.mp3',   // when a guestbook signature posts
  },

  // ---- CUSTOM EMOJIS (placeholders) ------------------------------------
  // type :name: anywhere in the site text and it becomes a tiny inline image.
  // these POINT AT assets/emojis/ placeholder files. drop a real png there
  // (matching filename) to replace one; until then a fallback shows.
  // built-in flags live in script.js:  :mlm:   :us: / :usa:   :ro: / :romania:
  // add your own:  name: 'path'   OR   name: { src:'path', fb:'shown-if-missing' }
  emojis: {
    // scoofy's own face emojis (purple fox w/ glasses). type these :codes: anywhere in the copy.
    scoofy:          'assets/emojis/Scoofy_Approve.png',      // default :scoofy: (thumbs up)
    scoofy_approve:  'assets/emojis/Scoofy_Approve.png',      // thumbs up
    scoofy_disagree: 'assets/emojis/Scoofy_Disagree.png',     // thumbs down
    scoofy_up:       'assets/emojis/Scoofy_Up.png',           // pointing up
    scoofy_nerd:     'assets/emojis/scoofy_nerd.png',         // pointing up, buck teeth (nerd)
    scoofy_mf:       'assets/emojis/Scoofy_Middlefinger.png', // the rude one
    scoofy_pet:      'assets/emojis/scoofy_pet.webp',         // petting
    // ── newer animated ones (webp) ──
    pensive:         'assets/emojis/pensive.webp',            // pensive / sad-thinking
    dies:            'assets/emojis/dies.webp',               // dies
    blep:            'assets/emojis/blep.webp',               // tongue blep
    troll:           'assets/emojis/troll.webp',              // trollface
    sadcat:          'assets/emojis/sadcat.webp',             // sad cat
    istg:            'assets/emojis/istg.webp',               // i swear to god
    appear:          'assets/emojis/appear.webp',             // appears
    dope_scoofy:     'assets/emojis/cool_scoofy.png',          
    disappear:       'assets/emojis/disappear.webp',          // disappears
    fox:             { src: 'assets/emojis/fox_emoji.png', fb: 'assets/fox_silly.png' },
  },

  // ---- LIMINAL SLIDESHOW (the "where 2 find me" banner) ----------------
  // drop your liminal pics in assets/liminal/ and list their paths here.
  // they cross-fade with tv grain + a fake REC timestamp over the top.
  // empty list = a cursed "NO SIGNAL" placeholder shows instead.
  liminal: [
    'assets/liminal/backrooms.png',
    'assets/liminal/under a bed.jpg',
    'assets/liminal/random_house.jpg',
    'assets/liminal/stop sign night.png',
    'assets/liminal/sunpark_night.jpg',
    'assets/liminal/foggy_Field.jpg',
    'assets/liminal/field.jpg',
    'assets/liminal/grassy_field.jpg',
    'assets/liminal/beach.jpg',
    'assets/liminal/path_park.jpg',
    'assets/liminal/pillars_park.jpg',
    'assets/liminal/mountain snow.jpg',
    'assets/liminal/snow_mountain_clear.jpg',
    'assets/liminal/snow_mountain_field.jpg',
    'assets/liminal/snow_mountain_camp.jpg',
    'assets/liminal/snow_mountain_parklot.jpg',
    'assets/liminal/snow_mountain_corner.jpg',
    'assets/liminal/snow_mountain_path0.jpg',
    'assets/liminal/snow_mountain_path1.jpg',
    'assets/liminal/snow_mountain_path2.jpg',
  ],

  // ---- PAGE COPY ------------------------------------------------------
  // all the site's wording (headline, hero blurb, dropdowns, retirement
  // notice, confession, marquees, badges...) now lives in its OWN file:
  //     content.js   (loaded right after this one)
  // edit your words there, not here.
};
