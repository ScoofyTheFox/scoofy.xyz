// =============================================================
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

  // ---- BACKEND URL -------------------------------------------------------
  // Where the guestbook talks to. Leave '' if the Cloudflare Worker sits on
  // your own domain at scoofy.xyz/api/* (the recommended "same-origin" setup).
  // ONLY set this if your worker is on a *.workers.dev URL instead, e.g.:
  //   apiBase: 'https://scoofy-guestbook.yourname.workers.dev',
  apiBase: 'https://scoofy-guestbook.scoofyx.workers.dev',

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
    'assets/pfps/scoofy-profile.png',
    'assets/pfps/scoofy-evil.png',
    'assets/pfps/scoofy-cutie.png',
    'assets/pfps/erm-actually-nerd.gif',
    // Full image-only picker from Downloads/more stuff/player avatars.
    // Keep every entry above in place so existing guestbook faces keep their indexes.
    'assets/emojis/_ scoofy fox emoji.png',
    'assets/emojis/big brain smart.jpg',
    'assets/emojis/boykisser.png',
    'assets/emojis/check it out.png',
    'assets/emojis/dead scoofyx.png',
    'assets/emojis/depessed_wolf.jpg',
    'assets/emojis/dog what question.jpg',
    'assets/emojis/evaporate.gif',
    'assets/emojis/foxbag.png',
    'assets/emojis/gayest_salute_but_ANIMATED.gif',
    'assets/emojis/irl fat scoofy.png',
    'assets/emojis/irl scoofy.png',
    'assets/emojis/monkey worried crazy scared.gif',
    'assets/emojis/NUH UH.jpg',
    'assets/emojis/original.png',
    'assets/emojis/patrick drool 0 no iq.jpg',
    'assets/emojis/pls donate emoji man person begging for money asking.jpg',
    'assets/emojis/question mark.png',
    'assets/emojis/rage door.gif',
    'assets/emojis/roblox finally free from chains.jpg',
    'assets/emojis/scoofy crying emoji.png',
    'assets/emojis/scoofy drawn middle finger white.png',
    'assets/pfps/scoofy-kfc-wing.png',
    'assets/emojis/scoofy face check.png',
    'assets/emojis/scoofy fat what the fuck was that.gif',
    'assets/emojis/scoofy is a dumb fox.png',
    'assets/emojis/scoofy kaspy milk drinking it all.png',
    'assets/emojis/scoofy listening galaxy background.png',
    'assets/emojis/scoofy middle finger happy.png',
    'assets/emojis/scoofy middle finger rawr.png',
    'assets/emojis/scoofy middle finger.jpg',
    'assets/emojis/scoofy moustache better.png',
    'assets/emojis/scoofy posterized.png',
    'assets/pfps/scoofy-self-sabotage.png',
    'assets/emojis/scoofy_japanese.png',
    'assets/emojis/scoofy-spin.gif',
    'assets/emojis/scoofy-zestylaugh.gif',
    'assets/emojis/scoofyx 67.gif',
    'assets/emojis/scoofyx irl fake.png',
    'assets/emojis/scoofyx sturdy.gif',
    'assets/emojis/scoofyx_pixelation.png',
    'assets/emojis/speed WHAT HAPPENED.jpg',
    'assets/emojis/stairs gates to heaven.jpg',
    'assets/emojis/the rock explaining.gif',
    'assets/emojis/tuff dark wolf knowledge with hat on.png',
    'assets/emojis/tuff.gif',
    'assets/emojis/wait what.gif',
    'assets/emojis/walter scoofy.png',
    'assets/emojis/woman listening sad cry.jpg',
  ],

  // ---- USERNAME KEYWORDS -------------------------------------------------
  // People build an anonymous name by picking ONE word from each column:
  //     a + Capitalized(b) + c     →    feral + Possum + _2003  =  feralPossum_2003
  // '' in column c = "no suffix". Edit/add freely (append-only).
  nameParts: {
    a: ['sleepy','feral','tuff','cursed','legally','mildly','extremely','sus','based','unhinged','dizzy','radioactive','nocturnal','discount','anonymous','forbidden','emotional','sopping','vintage','haunted','lowkey','kinda','actually','maybe','too_tired','chronically','sleep_deprived','slightly_fucked','confused','probably'],
    b: ['wolf','tiger','possum','raccoon','gecko','moth','goblin','frog','crow','ferret','axolotl','shark','bat','husky','opossum','skunk','otter','dragon','snail','gremlin','person','dude','bestie','lurker','stranger','visitor','little_freak','random_guy','fox_online','idiot'],
    c: ['','_2003','_420','.exe','.zip','_v2','~','_official','_69','_XxX','_real','_online','_ttv','_fr','_wav','_lol','_irl','_idk','_bruh','_lmao','_rn','_somehow','_probably'],
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
    "wait this is a real guestbook?? ok hi lol",
    "i clicked the logo 7 times and now im here. worth it tbh",
    "not me reading this whole site at 2am",
    "ur cursor is following me and i hate that lmao",
    "idk what reqwerty says but i support it",
    "this site is so stupid. 10/10. i mean that lovingly",
    "i was gonna leave but the button ran away. what the fuck",
    "bro why is the page turning red rn",
    "who made this?? nvm it literally says scoofy everywhere",
    "i came here for 5 seconds and somehow its been an hour",
    "ok i signed the thing. can i go now or is there lore",
    "your fox avatar is cool as hell. urs truly, a random visitor",
    "the alphabet is fake but this website feels real as fuck",
    "i dont know u but this site has immaculate weird-person energy",
    "i clicked one link and got trapped in a purple fever dream",
    "why is there a wandering eyeball. actually dont answer that",
    "i feel like this page is judging me. fair enough tbh",
    "this is the dumbest cool thing ive seen all week",
    "i would explain how i got here but honestly idk either",
    "fuck it, leaving my mark before the page eats my browser",
    "i opened this in one tab and forgot why i came here",
    "this page has the energy of a sleepover at 1am",
    "i was gonna write something deep but my brain said nah",
    "hi stranger. hope ur day gets less weird (unless u like weird)",
    "this website feels like finding a note in an old game",
    "i trust the fox more than most websites tbh",
    "i clicked around for lore and found more questions. rude.",
    "the internet used to feel like this. kinda miss it.",
    "i dont know what reqwerty says but it probably says hi",
    "if this guestbook survives the apocalypse, tell em i was chill",
    "i came in curious and left with 4 new tabs and zero answers",
    "whoever made this: take a break and drink some water pls",
    "this site is a mess. respectfully, same.",
    "i signed this instead of doing the thing i was supposed to do",
    "i dont know u but im rooting for u, random internet person",
    "ngl this made my day a little less boring",
    "i feel like the eyeball knows i skipped the instructions",
    "ur site is weird as hell. please keep it that way",
    "i showed up, saw the fox, and immediately forgot my mission :scoofy:",
    "me trying to understand this site at 2am :pensive: :dies:",
    "this page got me like :blep: honestly",
    "the memes are classified but im leaking them anyway :troll:",
    "i thought that was a normal face. then it blinked :appear: :disappear:",
    "scoofy really said :istg: and left me with 40 questions",
    "i came for the alphabet and got emotionally jump-scared :sadcat:",
    "the lil fox is cute as hell, respectfully :scoofy_pet:",
    "i clicked the wrong thing and now im part of the lore :question_mark:",
    "reqwerty translation: what the fuck is happening :scoofy_nerd:",
    "this whole site is a mood :boykisser: :evil_scoofy:",
    "i am not okay but this website is helping somehow :scoofy_crying:",
  ],

  // ---- SOUND EFFECTS (placeholders) ------------------------------------
  // drop your own audio into  assets/sfx/  and point to it here (mp3/wav/ogg).
  // if a file is missing, a built-in synthesized beep plays instead, so it is
  // never silent. delete a line (or set '') to force the synth for that one.
  sfx: {
    dialup: 'assets/sfx/dialup.mp3', // plays once on the first click (the 2003 modem)
    click:  'assets/sfx/minecraft-click.wav', // every button / link click
    sign:   'assets/sfx/pop.wav',   // when a guestbook signature posts
  },

  // ---- SOUND BOARD on the secret alphabet page --------------------------
  // All files here were supplied in Downloads/more stuff/sfx to use and copied
  // into this project, so the site never points back into Downloads.
  soundboard: [
    { label: 'minecraft click', src: 'assets/sfx/minecraft-click.wav' },
    { label: 'pop', src: 'assets/sfx/pop.wav' },
    { label: 'cave noise', src: 'assets/sfx/cave-creepy.wav' },
    { label: 'error', src: 'assets/sfx/error.mp3' },
    { label: 'DJ hit', src: 'assets/sfx/dj-hit.wav' },
    { label: 'bass drop', src: 'assets/sfx/end-bassdrop.wav' },
    { label: 'lego breaking', src: 'assets/sfx/lego-breaking.wav' },
    { label: 'lights off', src: 'assets/sfx/lights-off.wav' },
    { label: 'minecraft drink', src: 'assets/sfx/minecraft-drink.mp3' },
    { label: 'new round', src: 'assets/sfx/new-round-cod.wav' },
    { label: 'raaar', src: 'assets/sfx/raaar.mp3' },
    { label: 'regular show', src: 'assets/sfx/regular-show.wav' },
    { label: 'taco bell troll', src: 'assets/sfx/taco-bell-troll.mp3' },
    { label: 'vine boom', src: 'assets/sfx/vine-boom.mp3' },
    { label: 'old Rbx button', src: 'assets/sfx/oldrbx/button.wav' },
    { label: 'old Rbx explosion', src: 'assets/sfx/oldrbx/explosion.wav' },
    { label: 'rubber band', src: 'assets/sfx/oldrbx/Rubber band sling shot.wav' },
    { label: 'short spring', src: 'assets/sfx/oldrbx/Short spring sound.wav' },
    { label: 'old Rbx spawn', src: 'assets/sfx/oldrbx/spawn.wav' },
    { label: 'old Rbx summon', src: 'assets/sfx/oldrbx/summon.wav' },
    { label: 'sword slash', src: 'assets/sfx/oldrbx/sword_slash.wav' },
    { label: 'sword unsheath', src: 'assets/sfx/oldrbx/sword_unsheath.wav' },
    { label: 'sword hit', src: 'assets/sfx/oldrbx/sword.wav' },
    { label: 'thunder 1', src: 'assets/sfx/oldrbx/thunders.wav' },
    { label: 'thunder 2', src: 'assets/sfx/oldrbx/thunders_2.wav' },
    { label: 'uuhhh', src: 'assets/sfx/oldrbx/uuhhh.wav' },
    { label: 'walking', src: 'assets/sfx/oldrbx/walking.mp3' },
  ],

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
    boykisser:       'assets/emojis/boykisser.png',
    evil_scoofy:     'assets/emojis/evil_scoofy.png',
    question_mark:   'assets/emojis/question_mark.png',
    scoofy_crying:   'assets/emojis/scoofy_crying.png',
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
