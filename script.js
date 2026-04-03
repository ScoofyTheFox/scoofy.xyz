const reveals = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".top-nav a");
const currentPage = document.body.dataset.page;
const header = document.querySelector(".site-header");
const rootPath = "./";
const settingsPath = document.body.dataset.settings || "./assets/settings/site.json";
const volumeKey = "scoofyx-volume";
const trackIndexKey = "scoofyx-track-index";
const trackTimeKey = "scoofyx-track-time";
const embeddedTracks = [
  {
    file: "Browser History - Graham Kartna.mp3",
    name: "Browser History - Graham Kartna.mp3",
  },
  {
    file: "Star U - Graham Kartna.mp3",
    name: "Star U - Graham Kartna.mp3",
  },
  {
    file: "takeshi abo - LEASE (extended).mp3",
    name: "takeshi abo - LEASE (extended).mp3",
  },
];
const fallbackLiveData = {
  headline: "Scoofyx live feed",
  subline: "Edit assets/live/live.json from GitHub whenever you want this page to change.",
  windows: [
    {
      tag: "Template",
      title: "First live window",
      date: "Edit me anytime",
      text: "Duplicate this block in assets/live/live.json to add another update window. Change the title, text, date, and image whenever you want.",
      image: "./assets/images/r.png",
      linkLabel: "Open gallery",
      linkHref: "./gallery.html",
    },
    {
      tag: "Notes",
      title: "How this system works",
      date: "GitHub-friendly",
      text: "This page is meant to be easy to maintain. Add a new object to the windows array, set an image path, and push the changes.",
      image: "./assets/images/scoofyx-site-logo.png",
      linkLabel: "Open assets info",
      linkHref: "./assets.html",
    },
  ],
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const getValueByPath = (source, path) =>
  path.split(".").reduce((value, key) => (value && key in value ? value[key] : undefined), source);

const loadJson = async (path) => {
  try {
    const response = await fetch(path);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
};

const applyPageSettings = async (siteSettings) => {
  const settingsMap = siteSettings?.pages || {};
  const pageSettingsPath = settingsMap[currentPage] || `./assets/settings/pages/${currentPage}.json`;
  const pageSettings = await loadJson(pageSettingsPath);

  if (!pageSettings) {
    return;
  }

  if (typeof pageSettings.pageTitle === "string" && pageSettings.pageTitle.trim()) {
    document.title = pageSettings.pageTitle;
  }

  if (typeof pageSettings.pageDescription === "string" && pageSettings.pageDescription.trim()) {
    const descriptionMeta = document.querySelector('meta[name="description"]');

    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", pageSettings.pageDescription);
    }
  }

  document.querySelectorAll("[data-setting]").forEach((element) => {
    const settingPath = element.dataset.setting;
    const targetAttr = element.dataset.settingAttr || "text";
    const value = getValueByPath(pageSettings, settingPath);

    if (typeof value !== "string") {
      return;
    }

    if (targetAttr === "html") {
      element.innerHTML = value;
      return;
    }

    if (targetAttr === "text") {
      element.textContent = value;
      return;
    }

    element.setAttribute(targetAttr, value);
  });
};

navLinks.forEach((link) => {
  if (link.dataset.nav === currentPage) {
    link.classList.add("is-current");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

reveals.forEach((target, index) => {
  target.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
  observer.observe(target);
});

if (header) {
  const nav = header.querySelector(".top-nav");

  if (nav) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Toggle navigation");
    toggle.textContent = "Menu";
    header.insertBefore(toggle, nav);

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "Close" : "Menu";
    });
  }
}

document.querySelectorAll("[data-href]").forEach((card) => {
  card.addEventListener("click", (event) => {
    const anchor = event.target.closest("a");

    if (anchor) {
      return;
    }

    const href = card.getAttribute("data-href");

    if (href) {
      window.location.href = href;
    }
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const href = card.getAttribute("data-href");

      if (href) {
        window.location.href = href;
      }
    }
  });
});

const dock = document.createElement("nav");
dock.className = "page-dock";
dock.setAttribute("aria-label", "Quick page dock");

[
  ["home", "./index.html", "Blog"],
  ["fursona", "./fursona.html", "Fursona"],
  ["gallery", "./gallery.html", "Gallery"],
  ["live", "./live.html", "Live"],
  ["links", "./links.html", "Links"],
].forEach(([key, href, label]) => {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;

  if (currentPage === key) {
    link.classList.add("is-current");
  }

  dock.appendChild(link);
});

document.body.appendChild(dock);

const motionAllowed = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (motionAllowed && finePointer) {
  window.addEventListener("pointermove", (event) => {
    document.body.style.setProperty("--spot-x", `${event.clientX}px`);
    document.body.style.setProperty("--spot-y", `${event.clientY}px`);
  });

  const interactiveCards = document.querySelectorAll(
    ".feature-card, .page-panel, .gallery-card, .link-card, .topic-card, .glass-panel, .glossy-card"
  );

  interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateY = offsetX * 10;
      const rotateX = offsetY * -10;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.boxShadow = "0 34px 80px rgba(11, 28, 62, 0.34)";
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });
}

const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = `
  <div class="lightbox-panel">
    <button class="lightbox-close" type="button" aria-label="Close media viewer">X</button>
    <img class="lightbox-media" alt="">
    <p class="lightbox-caption"></p>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector(".lightbox-media");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const closeLightbox = () => lightbox.classList.remove("is-open");

document.addEventListener("click", (event) => {
  const mediaCard = event.target.closest(".media-card");

  if (mediaCard) {
    const directLink = event.target.closest("a");

    if (directLink) {
      return;
    }

    lightboxImage.src = mediaCard.dataset.lightboxSrc || "";
    lightboxImage.alt = mediaCard.dataset.lightboxAlt || "";
    lightboxCaption.textContent = mediaCard.querySelector("h3")?.textContent || mediaCard.dataset.lightboxAlt || "";
    lightbox.classList.add("is-open");
    return;
  }

  if (event.target === lightbox || event.target.closest(".lightbox-close")) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

const createBackgroundAudio = async (siteSettings) => {
  const musicSettings = siteSettings?.music || {};
  let tracks = [...embeddedTracks];
  const playlistPath = musicSettings.playlist || `${rootPath}assets/music/tracks.json`;
  const fetchedTracks = await loadJson(playlistPath);

  if (Array.isArray(fetchedTracks) && fetchedTracks.length > 0) {
    tracks = fetchedTracks;
  }

  if (!Array.isArray(tracks) || tracks.length === 0) {
    return;
  }

  let currentTrackIndex = 0;
  const getTrack = () => tracks[currentTrackIndex];
  const savedVolume = Number(window.localStorage.getItem(volumeKey));
  const savedTrackIndex = Number(window.localStorage.getItem(trackIndexKey));
  const savedTrackTime = Number(window.localStorage.getItem(trackTimeKey));
  const targetVolume = clamp(
    Number.isFinite(savedVolume) ? savedVolume : Number(musicSettings.defaultVolume) || 0.42,
    0.05,
    1
  );
  const crossfadeMs = Math.max(600, Number(musicSettings.crossfadeMs) || 1800);
  const resumeTime = Number.isFinite(savedTrackTime) && savedTrackTime >= 0 ? savedTrackTime : 0;

  if (Number.isFinite(savedTrackIndex) && savedTrackIndex >= 0 && savedTrackIndex < tracks.length) {
    currentTrackIndex = savedTrackIndex;
  }

  const audio = document.createElement("audio");
  audio.loop = false;
  audio.preload = "auto";
  audio.autoplay = true;
  audio.volume = 0;
  audio.style.display = "none";
  document.body.appendChild(audio);

  let audioContext = null;
  let mediaSource = null;
  let dryGain = null;
  let wetGain = null;
  let delayNode = null;
  let feedbackGain = null;
  let effectsReady = false;

  const ensureEffects = async () => {
    if (!window.AudioContext && !window.webkitAudioContext) {
      return false;
    }

    if (!audioContext) {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextCtor();
      mediaSource = audioContext.createMediaElementSource(audio);
      dryGain = audioContext.createGain();
      wetGain = audioContext.createGain();
      delayNode = audioContext.createDelay(0.6);
      feedbackGain = audioContext.createGain();

      const echoSettings = musicSettings.echo || {};
      delayNode.delayTime.value = clamp(Number(echoSettings.delay) || 0.21, 0, 0.55);
      feedbackGain.gain.value = clamp(Number(echoSettings.feedback) || 0.18, 0, 0.45);
      wetGain.gain.value = clamp(Number(echoSettings.mix) || 0.12, 0, 0.4);
      dryGain.gain.value = 1;
    }

    if (audioContext?.state === "suspended") {
      try {
        await audioContext.resume();
      } catch (error) {
        return false;
      }
    }

    if (!effectsReady) {
      mediaSource.connect(dryGain);
      dryGain.connect(audioContext.destination);
      mediaSource.connect(delayNode);
      delayNode.connect(feedbackGain);
      feedbackGain.connect(delayNode);
      delayNode.connect(wetGain);
      wetGain.connect(audioContext.destination);
      effectsReady = true;
    }

    return true;
  };

  const fadeTo = async (nextVolume, duration) => {
    const steps = 12;
    const start = audio.volume;
    const delta = nextVolume - start;

    for (let i = 1; i <= steps; i += 1) {
      audio.volume = clamp(start + delta * (i / steps), 0, 1);
      await new Promise((resolve) => window.setTimeout(resolve, duration / steps));
    }
  };

  const tryAutoplay = async () => {
    try {
      audio.muted = false;
      await audio.play();
      return true;
    } catch (error) {
      try {
        audio.muted = true;
        await audio.play();
        window.setTimeout(() => {
          audio.muted = false;
        }, 220);
        return true;
      } catch (mutedError) {
        return false;
      }
    }
  };

  const applyTrack = async (resumeFromSavedTime, shouldFade) => {
    const track = getTrack();

    if (shouldFade) {
      await fadeTo(0, crossfadeMs);
    }

    audio.src = `${rootPath}assets/music/${track.file}`;
    window.localStorage.setItem(trackIndexKey, String(currentTrackIndex));

    const setTime = () => {
      audio.currentTime = resumeFromSavedTime ? resumeTime : 0;
    };

    audio.addEventListener("loadedmetadata", setTime, { once: true });
    const started = await tryAutoplay();

    if (started) {
      await fadeTo(targetVolume, shouldFade ? crossfadeMs : 900);
    }
  };

  const savePlaybackState = () => {
    window.localStorage.setItem(trackIndexKey, String(currentTrackIndex));
    window.localStorage.setItem(trackTimeKey, String(audio.currentTime || 0));
    window.localStorage.setItem(volumeKey, String(targetVolume));
  };

  audio.addEventListener("ended", async () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    window.localStorage.setItem(trackTimeKey, "0");
    await applyTrack(false, true);
  });

  window.setInterval(() => {
    if (!audio.paused && Number.isFinite(audio.currentTime)) {
      window.localStorage.setItem(trackTimeKey, String(audio.currentTime));
    }
  }, 1000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && audio.paused) {
      void tryAutoplay();
    }
  });

  const wakePlayback = async () => {
    await ensureEffects();

    if (audio.paused) {
      await tryAutoplay();
      await fadeTo(targetVolume, 700);
    }
  };

  window.addEventListener("pagehide", savePlaybackState);
  window.addEventListener("beforeunload", savePlaybackState);
  window.addEventListener("pointerdown", wakePlayback, { once: true });
  window.addEventListener("keydown", wakePlayback, { once: true });

  window.addEventListener("storage", (event) => {
    if (event.key === trackIndexKey && event.newValue !== null) {
      const nextIndex = Number(event.newValue);

      if (Number.isFinite(nextIndex) && nextIndex >= 0 && nextIndex < tracks.length && nextIndex !== currentTrackIndex) {
        currentTrackIndex = nextIndex;
        void applyTrack(false, true);
      }
    }
  });

  void applyTrack(true, false);
};

const renderLiveFeed = async (siteSettings) => {
  if (currentPage !== "live" && currentPage !== "home") {
    return;
  }

  const liveSource = siteSettings?.live?.source || "./assets/live/live.json";
  const liveData = (await loadJson(liveSource)) || fallbackLiveData;
  const headline = document.getElementById("live-headline");
  const subline = document.getElementById("live-subline");
  const feed = document.getElementById("live-feed");

  if (!feed) {
    return;
  }

  if (liveData?.headline && headline) {
    headline.textContent = liveData.headline;
  }

  if (liveData?.subline && subline) {
    subline.textContent = liveData.subline;
  }

  const windows = Array.isArray(liveData?.windows) ? liveData.windows : [];

  if (windows.length === 0) {
    feed.innerHTML = `
      <article class="page-panel live-card">
        <p class="post-kicker">No windows yet</p>
        <h3>Add your first live post</h3>
        <p>Edit \`assets/live/live.json\` and add a window object to make this page update.</p>
      </article>
    `;
    return;
  }

  feed.innerHTML = windows
    .map((windowCard) => {
      const imageBlock = windowCard.image
        ? `<img src="${windowCard.image}" alt="${windowCard.title || "Live window image"}">`
        : "";
      const linkBlock = windowCard.linkHref && windowCard.linkLabel
        ? `<a class="button button-secondary" href="${windowCard.linkHref}">${windowCard.linkLabel}</a>`
        : "";

      return `
        <article class="page-panel live-card media-card" data-lightbox-src="${windowCard.image || ""}" data-lightbox-alt="${windowCard.title || "Live window"}">
          <p class="post-kicker">${windowCard.tag || "Update"}</p>
          <h3>${windowCard.title || "Untitled update"}</h3>
          <p class="live-date">${windowCard.date || ""}</p>
          <p>${windowCard.text || ""}</p>
          ${imageBlock}
          <div class="window-actions">${linkBlock}</div>
        </article>
      `;
    })
    .join("");
};

const setupToyWindows = () => {
  const pawCanvas = document.getElementById("paw-playground");
  const foxCanvas = document.getElementById("fox-drift");

  const fitCanvas = (canvas) => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round((rect.height || rect.width * 0.52) * ratio);
    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return {
      context,
      width: rect.width,
      height: rect.height || rect.width * 0.52,
    };
  };

  if (pawCanvas) {
    let balls = [];
    let pawFrame = null;
    let pawScene = fitCanvas(pawCanvas);

    const spawnBall = (x = Math.random() * pawScene.width, y = 32, power = Math.random()) => {
      balls.push({
        x,
        y,
        vx: (Math.random() - 0.5) * (2 + power * 4),
        vy: 1 + Math.random() * 2,
        r: 12 + Math.random() * 16,
        color: ["#a56cff", "#55dcff", "#ff75d7", "#7dffb6"][Math.floor(Math.random() * 4)],
      });
    };

    const resetPaw = () => {
      balls = [];
      for (let i = 0; i < 8; i += 1) {
        spawnBall(50 + i * 44, 24 + (i % 3) * 12, 0.4);
      }
    };

    const drawPaw = () => {
      const { context, width, height } = pawScene;
      context.clearRect(0, 0, width, height);

      context.fillStyle = "rgba(255,255,255,0.03)";
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(255,255,255,0.08)";
      context.lineWidth = 1;
      for (let x = 0; x < width; x += 28) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }

      balls.forEach((ball) => {
        ball.vy += 0.18;
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x - ball.r < 0 || ball.x + ball.r > width) {
          ball.vx *= -0.98;
          ball.x = Math.max(ball.r, Math.min(width - ball.r, ball.x));
        }

        if (ball.y + ball.r > height - 8) {
          ball.y = height - 8 - ball.r;
          ball.vy *= -0.86;
          ball.vx *= 0.995;
        }

        context.beginPath();
        context.fillStyle = ball.color;
        context.globalAlpha = 0.9;
        context.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.fillStyle = "rgba(255,255,255,0.2)";
        context.arc(ball.x - ball.r * 0.28, ball.y - ball.r * 0.28, ball.r * 0.28, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
      });

      context.fillStyle = "rgba(255,255,255,0.18)";
      context.fillRect(0, height - 8, width, 8);
      pawFrame = window.requestAnimationFrame(drawPaw);
    };

    pawCanvas.addEventListener("pointerdown", (event) => {
      const rect = pawCanvas.getBoundingClientRect();
      spawnBall(event.clientX - rect.left, event.clientY - rect.top, 1);
    });

    document.querySelectorAll('[data-toy-target="paw-playground"]').forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.toyAction;

        if (action === "reset") {
          resetPaw();
        }

        if (action === "burst") {
          for (let i = 0; i < 10; i += 1) {
            spawnBall(Math.random() * pawScene.width, 20 + Math.random() * 60, 1);
          }
        }
      });
    });

    resetPaw();
    drawPaw();
    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(pawFrame);
      pawScene = fitCanvas(pawCanvas);
      drawPaw();
    });
  }

  if (foxCanvas) {
    let foxScene = fitCanvas(foxCanvas);
    let foxFrame = null;
    const orb = {
      x: foxScene.width * 0.5,
      y: foxScene.height * 0.52,
      vx: 2.8,
      vy: -1.6,
      r: 28,
    };
    const sparkles = [];

    const resetFox = () => {
      orb.x = foxScene.width * 0.5;
      orb.y = foxScene.height * 0.52;
      orb.vx = 2.8;
      orb.vy = -1.6;
      sparkles.length = 0;
    };

    const nudgeFox = () => {
      orb.vx += (Math.random() - 0.5) * 8;
      orb.vy += (Math.random() - 0.5) * 8;
    };

    foxCanvas.addEventListener("pointermove", (event) => {
      const rect = foxCanvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dx = x - orb.x;
      const dy = y - orb.y;
      const dist = Math.max(Math.hypot(dx, dy), 1);

      if (dist < 120) {
        orb.vx += dx / dist * 0.22;
        orb.vy += dy / dist * 0.22;
        sparkles.push({ x, y, life: 24 + Math.random() * 18 });
      }
    });

    document.querySelectorAll('[data-toy-target="fox-drift"]').forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.toyAction;

        if (action === "reset") {
          resetFox();
        }

        if (action === "nudge") {
          nudgeFox();
        }
      });
    });

    const drawFox = () => {
      const { context, width, height } = foxScene;
      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(165,108,255,0.08)");
      gradient.addColorStop(1, "rgba(81,219,255,0.03)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      orb.vx *= 0.997;
      orb.vy *= 0.997;
      orb.x += orb.vx;
      orb.y += orb.vy;

      if (orb.x - orb.r < 0 || orb.x + orb.r > width) {
        orb.vx *= -1;
        orb.x = Math.max(orb.r, Math.min(width - orb.r, orb.x));
      }

      if (orb.y - orb.r < 0 || orb.y + orb.r > height) {
        orb.vy *= -1;
        orb.y = Math.max(orb.r, Math.min(height - orb.r, orb.y));
      }

      sparkles.forEach((sparkle, index) => {
        sparkle.life -= 1;
        context.beginPath();
        context.fillStyle = `rgba(255,255,255,${sparkle.life / 42})`;
        context.arc(sparkle.x, sparkle.y, 2 + sparkle.life * 0.03, 0, Math.PI * 2);
        context.fill();

        if (sparkle.life <= 0) {
          sparkles.splice(index, 1);
        }
      });

      context.save();
      context.translate(orb.x, orb.y);

      context.beginPath();
      context.fillStyle = "#8f63ff";
      context.arc(0, 0, orb.r, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.moveTo(-18, -16);
      context.lineTo(-6, -42);
      context.lineTo(2, -12);
      context.closePath();
      context.fillStyle = "#ff75d7";
      context.fill();

      context.beginPath();
      context.moveTo(18, -16);
      context.lineTo(6, -42);
      context.lineTo(-2, -12);
      context.closePath();
      context.fillStyle = "#55dcff";
      context.fill();

      context.beginPath();
      context.fillStyle = "rgba(255,255,255,0.88)";
      context.arc(-9, -4, 4, 0, Math.PI * 2);
      context.arc(9, -4, 4, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.fillStyle = "#111521";
      context.arc(-9, -4, 2, 0, Math.PI * 2);
      context.arc(9, -4, 2, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.fillStyle = "rgba(255,255,255,0.92)";
      context.arc(0, 10, 11, 0, Math.PI);
      context.fill();

      context.beginPath();
      context.fillStyle = "#151823";
      context.arc(0, 3, 4, 0, Math.PI * 2);
      context.fill();
      context.restore();

      foxFrame = window.requestAnimationFrame(drawFox);
    };

    drawFox();
    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(foxFrame);
      foxScene = fitCanvas(foxCanvas);
      resetFox();
      drawFox();
    });
  }
};

const initSite = async () => {
  const siteSettings = (await loadJson(settingsPath)) || {};
  await applyPageSettings(siteSettings);
  await createBackgroundAudio(siteSettings);
  await renderLiveFeed(siteSettings);
  setupToyWindows();
};

void initSite();
