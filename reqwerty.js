(() => {
  const cfg = window.GB_CONFIG || {};
  const emojiBox = document.getElementById('emoji-reference');
  if (emojiBox) {
    const keys = [...new Set([...Object.keys(cfg.emojis || {}), 'mlm', 'us', 'usa', 'ro', 'romania'])];
    keys.forEach((key) => {
      const chip = document.createElement('span');
      const code = document.createElement('code');
      const preview = document.createElement('span');
      chip.className = 'emoji-reference-chip';
      code.textContent = `:${key}:`;
      preview.className = 'emoji-reference-preview';
      preview.textContent = `:${key}:`;
      chip.append(code, preview);
      emojiBox.appendChild(chip);
    });
  }

  const soundBox = document.getElementById('soundboard');
  const soundStatus = document.getElementById('soundboard-status');
  (cfg.soundboard || []).forEach((sound) => {
    if (!sound || !sound.src || !sound.label) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'soundboard-button';
    button.textContent = `▶ ${sound.label}`;
    button.addEventListener('click', () => {
      const audio = new Audio(sound.src);
      audio.volume = 0.65;
      audio.play().then(() => {
        if (soundStatus) soundStatus.textContent = `now playing: ${sound.label}`;
      }).catch(() => {
        if (soundStatus) soundStatus.textContent = `couldn't play ${sound.label}; try again`;
      });
    });
    soundBox?.appendChild(button);
  });

  const input = document.getElementById('translator-input');
  const output = document.getElementById('translator-output');
  const status = document.getElementById('translator-status');
  if (!input || !output || !status) return;

  // This substitution is reciprocal, so the same key encodes and decodes.
  // Explicit key avoids relying on keyboard-layout assumptions.
  const key = { a:'l', b:'c', c:'b', d:'j', e:'i', f:'h', g:'v', h:'f', i:'e', j:'d', k:'s', l:'a', m:'z', n:'x', o:'w', p:'q', q:'p', r:'u', s:'k', t:'y', u:'r', v:'g', w:'o', x:'n', y:'t', z:'m', '0':'1', '1':'0', '2':'9', '9':'2', '3':'8', '8':'3', '4':'7', '7':'4', '5':'6', '6':'5' };
  const translate = (text) => Array.from(text, (char) => {
    const lower = char.toLowerCase();
    const converted = key[lower];
    if (!converted) return char;
    return char === lower ? converted : converted.toUpperCase();
  }).join('');

  document.getElementById('encode-button')?.addEventListener('click', () => {
    output.value = translate(input.value);
    status.textContent = 'encoded!';
  });
  document.getElementById('decode-button')?.addEventListener('click', () => {
    output.value = translate(input.value);
    status.textContent = 'decoded!';
  });
  document.getElementById('copy-button')?.addEventListener('click', async () => {
    if (!output.value) { status.textContent = 'there is nothing to copy yet.'; return; }
    try {
      await navigator.clipboard.writeText(output.value);
    } catch {
      output.focus();
      output.select();
      document.execCommand('copy');
      output.setSelectionRange(0, 0);
    }
    status.textContent = 'copied!';
  });
})();
