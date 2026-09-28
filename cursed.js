(() => {
  const page = document.body;
  const warning = document.getElementById('stay-warning');
  if (!page || !warning) return;

  const stages = [
    'you weren\'t supposed to find this... it gets weirder the longer you stay.',
    'still here? the colors noticed.',
    'the alphabet is starting to look back.',
    'that little eye moved. don\'t follow it.',
    'why is everything turning red?',
    'the page is making a copy of your cursor.',
    'that was not your reflection.',
    'it followed you out of the alphabet.',
    'don\'t hover over that.',
    'it can see the cursor.',
    'TOO LATE. YOU HAVE BEEN HERE TOO LONG.',
  ];
  const stickers = [
    'assets/pfps/scoofy-evil.png',
    'assets/pfps/scoofy-profile.png',
    'assets/pfps/scoofy-cutie.png',
    'assets/pfps/scoofy-self-sabotage.png',
    'memes/nuh-uh.jpg',
    'memes/big-brain.jpg',
    'assets/emojis/dead scoofyx.png',
    'assets/pfps/scoofy-kfc-wing.png',
  ];
  let stage = 0;
  let watcher;
  let stickerIndex = 0;
  let shakeLoopStarted = false;

  const playCue = (src) => {
    const audio = new Audio(src);
    audio.volume = 0.32;
    audio.play().catch(() => {}); // browsers may block audio before a user gesture
  };

  // Split the marquee into individually hoverable letters without changing its text.
  document.querySelectorAll('.marquee-run').forEach((run) => {
    const text = run.textContent;
    run.setAttribute('aria-label', text);
    const fragment = document.createDocumentFragment();
    Array.from(text).forEach((char) => {
      if (/^[a-z0-9]$/i.test(char)) {
        const letter = document.createElement('span');
        letter.className = 'marquee-letter';
        letter.textContent = char;
        fragment.appendChild(letter);
      } else {
        fragment.appendChild(document.createTextNode(char));
      }
    });
    run.replaceChildren(fragment);
  });

  const addSticker = () => {
    if (stickerIndex >= stickers.length) return;
    const sticker = document.createElement('img');
    sticker.className = 'curse-sticker';
    sticker.setAttribute('aria-hidden', 'true');
    sticker.alt = '';
    sticker.src = stickers[stickerIndex++];
    sticker.style.left = `${4 + Math.random() * 88}%`;
    sticker.style.top = `${14 + Math.random() * 70}%`;
    sticker.style.setProperty('--sticker-size', `${58 + Math.random() * 48}px`);
    sticker.style.setProperty('--sticker-drift', `${Math.round(Math.random() * 34 - 17)}px`);
    sticker.style.animationDuration = `${2.5 + Math.random() * 3}s`;
    sticker.style.animationDelay = `${Math.random() * -3}s`;
    document.body.appendChild(sticker);
  };

  const createWatcher = () => {
    if (watcher) return;
    watcher = document.createElement('div');
    watcher.className = 'curse-wanderer';
    watcher.setAttribute('aria-hidden', 'true');
    watcher.textContent = '◉';
    document.body.appendChild(watcher);
  };

  const moveWatcher = () => {
    if (!watcher) return;
    const margin = 55;
    watcher.style.left = `${margin + Math.random() * Math.max(0, innerWidth - margin * 2)}px`;
    watcher.style.top = `${margin + Math.random() * Math.max(0, innerHeight - margin * 2)}px`;
    watcher.style.rotate = `${Math.round(Math.random() * 50 - 25)}deg`;
  };

  const randomBetween = (min, max) => min + Math.random() * (max - min);
  const randomizeFrameShake = () => {
    if (shakeLoopStarted) return;
    shakeLoopStarted = true;
    const tick = () => {
      if (stage < 5 || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        shakeLoopStarted = false;
        return;
      }
      const power = stage - 4;
      const magnitude = power * 1.7;
      page.style.setProperty('--jitter-x', `${randomBetween(-magnitude, magnitude).toFixed(1)}px`);
      page.style.setProperty('--jitter-y', `${randomBetween(-magnitude, magnitude).toFixed(1)}px`);
      page.style.setProperty('--jitter-angle', `${randomBetween(-power * 0.09, power * 0.09).toFixed(2)}deg`);
      window.setTimeout(tick, randomBetween(45, Math.max(65, 145 - stage * 7)));
    };
    tick();
  };

  const shakeable = '.letter-card, .meme-placeholder, .translator button, .translator textarea, .alphabet-home, .found-warning, .marquee-letter';
  const shake = (event) => {
    if (stage < 3) return;
    const target = event.target.closest?.(shakeable);
    if (!target) return;
    if (event.type === 'pointerover' && target.contains(event.relatedTarget)) return;
    const motion = 1 + (stage - 3) * 1.4;
    target.style.setProperty('--touch-x1', `${randomBetween(-motion, motion).toFixed(1)}px`);
    target.style.setProperty('--touch-x2', `${randomBetween(-motion, motion).toFixed(1)}px`);
    target.style.setProperty('--touch-y1', `${randomBetween(-motion, motion).toFixed(1)}px`);
    target.style.setProperty('--touch-y2', `${randomBetween(-motion, motion).toFixed(1)}px`);
    target.style.setProperty('--touch-angle1', `${randomBetween(-3 - stage * 0.6, 3 + stage * 0.6).toFixed(1)}deg`);
    target.style.setProperty('--touch-angle2', `${randomBetween(-3 - stage * 0.6, 3 + stage * 0.6).toFixed(1)}deg`);
    target.style.setProperty('--touch-angle3', `${randomBetween(-4, 4).toFixed(1)}deg`);
    target.style.setProperty('--touch-angle4', `${randomBetween(-2.5, 2.5).toFixed(1)}deg`);
    target.style.setProperty('--squash-wide', `${(1.12 + stage * 0.025).toFixed(2)}`);
    target.style.setProperty('--squash-narrow', `${(0.94 - stage * 0.012).toFixed(2)}`);
    target.style.setProperty('--stretch-tall', `${(1.16 + stage * 0.03).toFixed(2)}`);
    target.style.setProperty('--touch-duration', `${randomBetween(0.48, 0.96).toFixed(2)}s`);
    target.style.setProperty('--touch-curve', ['cubic-bezier(.2,1.5,.45,1)', 'cubic-bezier(.25,1.7,.35,.85)', 'cubic-bezier(.1,1.35,.6,1)'][Math.floor(Math.random() * 3)]);
    target.classList.remove('touch-haunt');
    void target.offsetWidth;
    target.classList.add('touch-haunt');
    window.setTimeout(() => target.classList.remove('touch-haunt'), 750);
  };
  document.addEventListener('pointerover', shake);
  document.addEventListener('pointerdown', shake);

  window.setInterval(() => {
    const previousStage = stage;
    stage = Math.min(stage + 1, stages.length - 1);
    page.dataset.curse = String(stage);
    page.style.setProperty('--curse-hue', `${stage * 17}deg`);
    page.style.setProperty('--curse-wash', `${Math.min(stage / 12, 0.72)}`);
    page.style.setProperty('--shake-size', `${Math.max(0, (stage - 2) * 2)}px`);
    page.style.setProperty('--frame-shake-size', `${Math.max(0, (stage - 4) * 1.7)}px`);
    page.style.setProperty('--squish', `${0.1 + stage * 0.025}`);
    page.style.setProperty('--frame-shake-speed', `${Math.max(0.065, 0.2 - Math.max(0, stage - 5) * 0.027)}s`);
    page.classList.toggle('curse-deep', stage >= 3);
    page.classList.toggle('curse-mad', stage >= 6);
    page.classList.toggle('curse-final', stage >= 9);
    page.classList.toggle('curse-chaos', stage >= 5);
    warning.textContent = stages[stage];
    addSticker();
    if (stage >= 2) createWatcher();
    moveWatcher();
    if (stage !== previousStage && stage === 4) playCue('assets/sfx/cave-creepy.wav');
    if (stage !== previousStage && stage === 10) playCue('assets/sfx/error.mp3');
    randomizeFrameShake();
  }, 9000);

  window.setInterval(moveWatcher, 2500);
})();
