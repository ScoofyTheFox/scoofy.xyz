const linksList = document.querySelector("#links-list");
const linkCount = document.querySelector("#link-count");
const badgeCount = document.querySelector("#badge-count");
const badgeStat = document.querySelector("#badge-stat");
const statHandle = document.querySelector("#stat-handle");
const statCaption = document.querySelector("#stat-caption");
const filterControls = document.querySelector("#filter-controls");
const avatarImage = document.querySelector(".avatar-image");
const avatarFallback = document.querySelector(".avatar-fallback");
const cardShell = document.querySelector(".card");
const profileName = document.querySelector("#profile-name");
const profileHandle = document.querySelector("#profile-handle");
const profileSubtitle = document.querySelector("#profile-subtitle");
const profileBio = document.querySelector("#profile-bio");
const locationChip = document.querySelector("#location-chip");
const locationIcon = document.querySelector("#location-icon");
const locationFallback = document.querySelector("#location-fallback");
const locationLabel = document.querySelector("#location-label");
const visitsChip = document.querySelector("#visits-chip");
const visitsLabel = document.querySelector("#visits-label");
const badgeList = document.querySelector("#badge-list");
const favicon = document.querySelector("#site-favicon");
const cursorDot = document.querySelector("#cursor-dot");
const bgMusic = document.querySelector("#bg-music");
const muteToggle = document.querySelector("#mute-toggle");
const muteLabel = document.querySelector("#mute-label");
const muteIcon = document.querySelector("#mute-icon");
const settingsData = document.querySelector("#settings-data");
const linksData = document.querySelector("#links-data");
const viewToggles = document.querySelectorAll(".view-toggle");
const entryOverlay = document.querySelector("#entry-overlay");
const entryButton = document.querySelector("#entry-button");
const entryTitle = document.querySelector("#entry-title");
const entryCopy = document.querySelector(".entry-copy");
const sidebarToggle = document.querySelector("#sidebar-toggle");
const sidebarPanel = document.querySelector("#sidebar-panel");
const sidebarClose = document.querySelector("#sidebar-close");
const sidebarBackdrop = document.querySelector("#sidebar-backdrop");
const sidebarHome = document.querySelector("#sidebar-home");
const sidebarHomeIcon = document.querySelector("#sidebar-home-icon");
const sidebarHomeLabel = document.querySelector("#sidebar-home-label");
const badgeModal = document.querySelector("#badge-modal");
const badgeModalKicker = document.querySelector("#badge-modal-kicker");
const badgeModalTitle = document.querySelector("#badge-modal-title");
const badgeModalText = document.querySelector("#badge-modal-text");
const badgeModalAction = document.querySelector("#badge-modal-action");
const badgeModalClose = document.querySelector("#badge-modal-close");
const bgVideoWrap = document.querySelector("#bg-video-wrap");
const bgVideo = document.querySelector("#bg-video");
const snowLayer = document.querySelector("#snow-layer");

let appSettings = {
  name: "Scoofy",
  handle: "@scoofy",
  subtitle: "CREATOR HUB",
  bio: "",
  site_label: "SCOOFY.XYZ",
  site_caption: "link hub",
  discord_username: "scoofy",
  profile_gif: "assets/scoofy-icon.gif?v=20260409",
  favicon: "assets/scoofy-icon.gif?v=20260409",
  theme_mode: "light",
  theme_preset: "glossy-sunset",
  glossy: "true",
  depth_level: "strong",
  card_blur: "18",
  cursor_mode: "dot",
  cursor_color: "#d36e43",
  name_gradient_mode: "rainbow",
  icon_color_mode: "masked",
  badges_enabled: "false",
  location_enabled: "true",
  location_label: "Romania",
  location_url: "https://earth.google.com/web/search/Romania",
  location_icon: "assets/location.png",
  visits_enabled: "true",
  visit_start: "1",
  visit_cooldown_hours: "12",
  music_src: "",
  music_list: "",
  music_autoplay: "false",
  music_volume: "0.35",
  shuffle_music: "false",
  bg: "#f4efe7",
  bg_deep: "#d9cdb6",
  panel: "rgba(255, 250, 242, 0.82)",
  text: "#1d1b19",
  muted: "#5d5349",
  accent: "#d36e43",
  accent_2: "#0c7c59",
  entry_enabled: "true",
  entry_title: "Click Anywhere",
  entry_text: "Tap or press any key to open the page.",
  entry_button: "click or press any key",
  categories: {
    all: "All",
    social: "Social",
    content: "Content",
    work: "Work"
  },
  badgeIcons: []
};

let linkSettings = {
  default_target: "_blank",
  view_mode: "buttons",
  list_descriptions: "false"
};

let data = [];
let currentFilter = "all";
let currentView = "buttons";
let musicQueue = [];
let currentTrackIndex = 0;
let cardPointerFrame = null;
let cardPointerState = null;
let cursorFrame = null;
let cursorState = null;
let snowAnimationFrame = null;

const AUDIO_ICON_ON = "assets/volume.png";
const AUDIO_ICON_OFF = "assets/volume-muted.png";
const VISIT_STORAGE_KEY = "scoofy_profile_visits_v1";
const VISIT_LAST_SEEN_KEY = "scoofy_profile_last_seen_v1";

const THEME_PRESETS = {
  "glossy-sunset": {
    bg: "#f4efe7",
    bg_deep: "#d9cdb6",
    panel: "rgba(255, 250, 242, 0.82)",
    text: "#1d1b19",
    muted: "#5d5349",
    accent: "#d36e43",
    accent_2: "#0c7c59",
    shadow: "0 24px 80px rgba(72, 50, 24, 0.16)",
    shine: "rgba(255, 255, 255, 0.42)"
  },
  "glossy-ice": {
    bg: "#edf6fb",
    bg_deep: "#bfd7ea",
    panel: "rgba(245, 252, 255, 0.76)",
    text: "#0f2230",
    muted: "#456072",
    accent: "#0f88c2",
    accent_2: "#2d5bff",
    shadow: "0 28px 90px rgba(28, 71, 112, 0.18)",
    shine: "rgba(255, 255, 255, 0.5)"
  },
  "midnight-glass": {
    bg: "#101826",
    bg_deep: "#25304a",
    panel: "rgba(17, 27, 45, 0.72)",
    text: "#eef4ff",
    muted: "#aebbd4",
    accent: "#7cc6ff",
    accent_2: "#8ef0cf",
    shadow: "0 28px 90px rgba(0, 0, 0, 0.45)",
    shine: "rgba(255, 255, 255, 0.16)"
  },
  "candy-chrome": {
    bg: "#fff1f1",
    bg_deep: "#ffd2d8",
    panel: "rgba(255, 250, 252, 0.82)",
    text: "#331b25",
    muted: "#7e5969",
    accent: "#ff5d8f",
    accent_2: "#ff9f43",
    shadow: "0 26px 84px rgba(163, 72, 104, 0.18)",
    shine: "rgba(255, 255, 255, 0.52)"
  }
};

function parseSectionedText(text) {
  const lines = text.split(/\r?\n/);
  const sections = {};
  let currentSection = "";

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      return;
    }

    if (line.startsWith("--") && line.endsWith("--") && line.length > 4) {
      currentSection = line.slice(2, -2).toLowerCase();
      sections[currentSection] = sections[currentSection] || [];
      return;
    }

    if (!currentSection) {
      return;
    }

    sections[currentSection].push(rawLine);
  });

  return sections;
}

function parseKeyValueLines(lines) {
  const values = {};

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    values[key] = value;
  });

  return values;
}

function parseSettings(text) {
  const sections = parseSectionedText(text);
  const settings = parseKeyValueLines(sections.settings || []);
  settings.categories = parseKeyValueLines(sections.categories || []);

  settings.badgeIcons = (sections.badges || [])
    .map((line) => line.trim())
    .filter(Boolean);

  return settings;
}

function parseLinks(text) {
  const sections = parseSectionedText(text);
  const settings = parseKeyValueLines(sections.settings || []);
  const rawLinks = (sections.links || []).join("\n");
  const blocks = rawLinks
    .split(/\r?\n---\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const links = blocks.map((block, index) => {
    const link = parseKeyValueLines(block.split(/\r?\n/));
    link.featured = String(link.featured).toLowerCase() === "true";
    const parsedOrder = Number.parseInt(link.order, 10);
    link.order = Number.isFinite(parsedOrder) ? parsedOrder : index + 1;
    link.sourceIndex = index;
    return link;
  }).sort((a, b) => {
    if (a.order === b.order) {
      return a.sourceIndex - b.sourceIndex;
    }

    return a.order - b.order;
  });

  return {
    settings,
    links
  };
}

function setProfileContent() {
  document.title = `${appSettings.name} | Links`;

  if (profileName) {
    profileName.textContent = appSettings.name || "Scoofy";
  }

  if (profileHandle) {
    profileHandle.textContent = appSettings.handle || "@scoofy";
  }

  if (profileSubtitle) {
    profileSubtitle.textContent = appSettings.subtitle || "CREATOR HUB";
  }

  if (profileBio) {
    profileBio.textContent = appSettings.bio || "";
  }

  if (statHandle) {
    statHandle.textContent = appSettings.site_label || "SCOOFY.XYZ";
  }

  if (statCaption) {
    statCaption.textContent = appSettings.site_caption || "link hub";
  }

  if (avatarImage) {
    avatarImage.src = appSettings.profile_gif || "assets/scoofy-icon.gif?v=20260409";
  }

  if (favicon) {
    favicon.href = appSettings.favicon || appSettings.profile_gif || "assets/scoofy-icon.gif?v=20260409";
  }

  if (entryTitle) {
      entryTitle.textContent = appSettings.entry_title || "Click Anywhere";
  }

  if (entryCopy) {
    entryCopy.textContent = appSettings.entry_text || "Tap or press any key to open the page.";
  }

  if (entryButton) {
    entryButton.textContent = appSettings.entry_button || "click or press any key";
  }

}

function setupLocationChip() {
  if (!locationChip || !locationLabel) {
    return;
  }

  const enabled = String(appSettings.location_enabled || "true").toLowerCase() === "true";
  const label = String(appSettings.location_label || "").trim();
  const url = String(appSettings.location_url || "").trim();
  const iconPath = String(appSettings.location_icon || "").trim();

  locationChip.hidden = !enabled || !label;

  if (locationChip.hidden) {
    return;
  }

  locationLabel.textContent = label;
  locationChip.href = url || "https://earth.google.com/web/";
  locationChip.target = "_blank";
  locationChip.rel = "noreferrer";
  locationChip.setAttribute("aria-label", `Open location for ${label}`);

  if (locationIcon) {
    locationIcon.hidden = !iconPath;

    if (iconPath) {
      locationIcon.src = iconPath;
      locationIcon.addEventListener("load", () => {
        locationIcon.hidden = false;
        if (locationFallback) {
          locationFallback.hidden = true;
        }
      }, { once: true });

      locationIcon.addEventListener("error", () => {
        locationIcon.hidden = true;
        if (locationFallback) {
          locationFallback.hidden = false;
        }
      }, { once: true });
    }
  }

  if (locationFallback) {
    locationFallback.hidden = Boolean(iconPath);
  }
}

function setupVisitChip() {
  if (!visitsChip || !visitsLabel) {
    return;
  }

  const enabled = String(appSettings.visits_enabled || "true").toLowerCase() === "true";
  visitsChip.hidden = !enabled;

  if (!enabled) {
    return;
  }

  const startingCount = Math.max(Number.parseInt(appSettings.visit_start || "1", 10) || 1, 1);
  const cooldownHours = Math.max(Number.parseFloat(appSettings.visit_cooldown_hours || "12") || 12, 0);
  const cooldownMs = cooldownHours * 60 * 60 * 1000;
  const now = Date.now();

  let count = startingCount;
  let lastSeen = 0;

  try {
    count = Number.parseInt(window.localStorage.getItem(VISIT_STORAGE_KEY) || `${startingCount}`, 10) || startingCount;
    lastSeen = Number.parseInt(window.localStorage.getItem(VISIT_LAST_SEEN_KEY) || "0", 10) || 0;

    if (!lastSeen || now - lastSeen >= cooldownMs) {
      count += 1;
      window.localStorage.setItem(VISIT_STORAGE_KEY, String(count));
      window.localStorage.setItem(VISIT_LAST_SEEN_KEY, String(now));
    }
  } catch (error) {
    count = Math.max(startingCount, 1);
  }

  visitsLabel.textContent = `${count} visit${count === 1 ? "" : "s"}`;
  visitsChip.title = "Browser-based visit count with repeat-view cooldown.";
}

function setupMusic() {
  if (!bgMusic || !muteToggle || !muteLabel) {
    return;
  }

  const parsedList = String(appSettings.music_list || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const fallbackTrack = String(appSettings.music_src || "").trim();
  const playlist = parsedList.length ? parsedList : (fallbackTrack ? [fallbackTrack] : []);

  if (!playlist.length) {
    muteToggle.hidden = true;
    return;
  }

  const shuffleEnabled = String(appSettings.shuffle_music).toLowerCase() === "true";
  musicQueue = [...playlist];

  if (shuffleEnabled && musicQueue.length > 1) {
    for (let i = musicQueue.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [musicQueue[i], musicQueue[randomIndex]] = [musicQueue[randomIndex], musicQueue[i]];
    }
  }

  currentTrackIndex = 0;
  bgMusic.src = musicQueue[currentTrackIndex];
  bgMusic.volume = Math.min(Math.max(Number(appSettings.music_volume || 0.35), 0), 1);
  bgMusic.muted = false;
  bgMusic.autoplay = true;
  bgMusic.loop = musicQueue.length <= 1;
  muteToggle.hidden = false;
  muteLabel.textContent = "Audio";
  muteToggle.setAttribute("aria-pressed", "false");

  if (muteIcon) {
    muteIcon.addEventListener("error", () => {
      muteIcon.hidden = true;
      muteLabel.hidden = false;
    });

    muteIcon.addEventListener("load", () => {
      muteIcon.hidden = false;
      muteLabel.hidden = true;
    });

    if (muteIcon.complete && muteIcon.naturalWidth > 0) {
      muteIcon.hidden = false;
      muteLabel.hidden = true;
    }
  }

  const tryPlay = async () => {
    try {
      await bgMusic.play();
    } catch (error) {
      return false;
    }
    return true;
  };

  const wantsAutoplay = String(appSettings.music_autoplay).toLowerCase() === "true";

  const updateAudioUI = () => {
    const setAudioIcon = (iconPath) => {
      if (!muteIcon) {
        return;
      }

      if (muteIcon.getAttribute("src") !== iconPath) {
        muteIcon.src = iconPath;
      }

      muteIcon.hidden = false;
      muteLabel.hidden = true;
    };

    if (bgMusic.paused) {
      muteToggle.setAttribute("aria-pressed", "true");
      setAudioIcon(AUDIO_ICON_OFF);
      if (!muteIcon || muteIcon.hidden) {
        muteLabel.textContent = "Audio";
      }
      return;
    }

    muteToggle.setAttribute("aria-pressed", bgMusic.muted ? "true" : "false");
    setAudioIcon(bgMusic.muted ? AUDIO_ICON_OFF : AUDIO_ICON_ON);
    if (!muteIcon || muteIcon.hidden) {
      muteLabel.textContent = bgMusic.muted ? "Muted" : "Audio";
    }
  };

  if (wantsAutoplay) {
    (async () => {
      let started = await tryPlay();

      if (!started) {
        bgMusic.muted = true;
        started = await tryPlay();
      }

      updateAudioUI();

      if (!started || bgMusic.muted) {
        const unlockAudio = async () => {
          if (bgMusic.paused) {
            await tryPlay();
          }

          bgMusic.muted = false;
          updateAudioUI();
        };

        window.addEventListener("pointerdown", unlockAudio, { once: true });
        window.addEventListener("keydown", unlockAudio, { once: true });
        window.addEventListener("touchstart", unlockAudio, { once: true });
      }
    })();
  }

  bgMusic.addEventListener("playing", () => {
    updateAudioUI();
  });

  let trackFailureCount = 0;

  bgMusic.addEventListener("error", async () => {
    trackFailureCount += 1;

    if (musicQueue.length > 1 && trackFailureCount < musicQueue.length + 1) {
      currentTrackIndex = (currentTrackIndex + 1) % musicQueue.length;
      bgMusic.src = musicQueue[currentTrackIndex];
      try {
        await bgMusic.play();
      } catch (error) {
      }
      return;
    }

    if (!muteIcon || muteIcon.hidden) {
      muteLabel.textContent = "Audio";
    }
  });

  bgMusic.addEventListener("ended", async () => {
    trackFailureCount = 0;

    if (musicQueue.length <= 1) {
      return;
    }

    currentTrackIndex += 1;

    if (currentTrackIndex >= musicQueue.length) {
      if (shuffleEnabled) {
        const currentTrack = musicQueue[musicQueue.length - 1];
        const nextQueue = [...playlist];
        if (nextQueue.length > 1) {
          for (let i = nextQueue.length - 1; i > 0; i -= 1) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [nextQueue[i], nextQueue[randomIndex]] = [nextQueue[randomIndex], nextQueue[i]];
          }

          if (nextQueue[0] === currentTrack) {
            const swapIndex = 1;
            [nextQueue[0], nextQueue[swapIndex]] = [nextQueue[swapIndex], nextQueue[0]];
          }
        }
        musicQueue = nextQueue;
      }

      currentTrackIndex = 0;
    }

    bgMusic.src = musicQueue[currentTrackIndex];
    try {
      await bgMusic.play();
    } catch (error) {
    }
    updateAudioUI();
  });

  muteToggle.addEventListener("click", async () => {
    if (!bgMusic.src) {
      return;
    }

    if (bgMusic.paused) {
      const started = await tryPlay();
      if (!started) {
        updateAudioUI();
        return;
      }
      bgMusic.muted = false;
      updateAudioUI();
      return;
    }

    bgMusic.muted = !bgMusic.muted;
    updateAudioUI();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden || bgMusic.paused) {
      return;
    }

    updateAudioUI();
  });

  updateAudioUI();
}

function applyTheme() {
  const root = document.documentElement;
  const preset = THEME_PRESETS[(appSettings.theme_preset || "").toLowerCase()] || {};
  root.style.setProperty("--bg", appSettings.bg || preset.bg || "#f4efe7");
  root.style.setProperty("--bg-deep", appSettings.bg_deep || preset.bg_deep || "#d9cdb6");
  root.style.setProperty("--panel", appSettings.panel || preset.panel || "rgba(255, 250, 242, 0.82)");
  root.style.setProperty("--text", appSettings.text || preset.text || "#1d1b19");
  root.style.setProperty("--muted", appSettings.muted || preset.muted || "#5d5349");
  root.style.setProperty("--accent", appSettings.accent || preset.accent || "#d36e43");
  root.style.setProperty("--accent-2", appSettings.accent_2 || preset.accent_2 || "#0c7c59");
  root.style.setProperty("--card-blur", `${appSettings.card_blur || "18"}px`);
  root.style.setProperty("--cursor-color", appSettings.cursor_color || "#d36e43");
  root.style.setProperty("--shine", appSettings.shine || preset.shine || "rgba(255, 255, 255, 0.42)");
  root.dataset.iconMode = (appSettings.icon_color_mode || "masked").toLowerCase();
  root.dataset.nameGradient = (appSettings.name_gradient_mode || "rainbow").toLowerCase();

  const depth = (appSettings.depth_level || "strong").toLowerCase();
  if (depth === "soft") {
    root.style.setProperty("--card-rotate-x", "3deg");
    root.style.setProperty("--card-rotate-y", "4deg");
    root.style.setProperty("--card-lift", "12px");
    root.style.setProperty("--icon-tilt-x", "4deg");
    root.style.setProperty("--icon-tilt-y", "5deg");
    root.style.setProperty("--icon-hover-lift", "-3px");
  } else if (depth === "off") {
    root.style.setProperty("--card-rotate-x", "0deg");
    root.style.setProperty("--card-rotate-y", "0deg");
    root.style.setProperty("--card-lift", "0px");
    root.style.setProperty("--icon-tilt-x", "0deg");
    root.style.setProperty("--icon-tilt-y", "0deg");
    root.style.setProperty("--icon-hover-lift", "0px");
  } else {
    root.style.setProperty("--card-rotate-x", "6deg");
    root.style.setProperty("--card-rotate-y", "8deg");
    root.style.setProperty("--card-lift", "18px");
    root.style.setProperty("--icon-tilt-x", "8deg");
    root.style.setProperty("--icon-tilt-y", "10deg");
    root.style.setProperty("--icon-hover-lift", "-6px");
  }

  if (cardShell) {
    cardShell.classList.toggle("no-gloss", String(appSettings.glossy).toLowerCase() !== "true");
  }

  if ((appSettings.theme_mode || "").toLowerCase() === "dark") {
    root.style.setProperty("--shadow", "0 24px 80px rgba(0, 0, 0, 0.38)");
  } else {
    root.style.setProperty("--shadow", appSettings.shadow || preset.shadow || "0 24px 80px rgba(72, 50, 24, 0.16)");
  }
}

const PLACEHOLDER_LINKS = new Set([
  "https://youtube.com/",
  "https://tiktok.com/",
  "https://www.roblox.com/users/profile",
  "https://instagram.com/",
  "https://patreon.com/",
  "https://pinterest.com/",
  "https://twitter.com/",
  "https://telegram.org/",
  "https://discord.gg/yourinvite",
  "https://bsky.app/",
  "https://twitch.tv/",
  "https://ko-fi.com/",
  "https://buymeacoffee.com/",
  "https://cash.app/",
  "https://open.spotify.com/",
  "https://store.steampowered.com/",
  "https://github.com/",
  "https://linktr.ee/",
  "https://carrd.co/",
  "https://straw.page/",
  "https://refsheet.net/",
  "https://pronouns.page/",
  "https://www.sofurry.com/",
  "https://furrynetwork.com/",
  "https://en.wikifur.com/",
  "https://namemc.com/",
  "https://guns.lol/",
  "https://www.redbubble.com/",
  "https://gumroad.com/",
  "https://example.com/",
  "https://mail.google.com/",
  "https://www.furaffinity.net/"
]);

function isPlaceholderLink(link) {
  return PLACEHOLDER_LINKS.has(String(link.url || "").trim());
}

function renderFilterButtons() {
  if (!filterControls) {
    return;
  }

  filterControls.innerHTML = "";
  const categories = appSettings.categories || { all: "All" };
  const entries = Object.entries(categories);

  entries.forEach(([key, label], index) => {
    const button = document.createElement("button");
    button.className = `filter-pill${index === 0 ? " active" : ""}`;
    button.type = "button";
    button.dataset.filter = key;
    button.textContent = label;
    button.addEventListener("click", () => {
      filterControls.querySelectorAll(".filter-pill").forEach((pill) => {
        pill.classList.remove("active");
      });
      button.classList.add("active");
      renderLinks(key);
    });
    filterControls.appendChild(button);
  });
}

function renderBadges() {
  if (!badgeList) {
    return;
  }

  badgeList.innerHTML = "";
  const badgesEnabled = String(appSettings.badges_enabled || "false").toLowerCase() === "true";
  badgeList.hidden = !badgesEnabled;
  if (badgeStat) {
    badgeStat.hidden = !badgesEnabled;
  }

  if (!badgesEnabled) {
    if (badgeCount) {
      badgeCount.textContent = "00";
    }
    return;
  }

  const icons = Array.isArray(appSettings.badgeIcons) ? appSettings.badgeIcons : [];

  icons.forEach((badgeEntry, index) => {
    const [iconPathRaw, labelRaw, thirdRaw, fourthRaw, fifthRaw, sixthRaw] = badgeEntry.split("|");
    const iconPath = (iconPathRaw || "").trim();
    const label = (labelRaw || "").trim() || `Badge ${index + 1}`;
    let modalText = "";
    let action = "message";
    let value = "";
    let actionLabel = "";

    const third = (thirdRaw || "").trim();
    const fourth = (fourthRaw || "").trim();
    const fifth = (fifthRaw || "").trim();
    const sixth = (sixthRaw || "").trim();

    if (third.startsWith("http://") || third.startsWith("https://") || third.startsWith("mailto:")) {
      action = "link";
      value = third;
      actionLabel = fourth || "";
    } else {
      modalText = third;
      action = fourth || "message";
      value = fifth || "";
      actionLabel = sixth || "";
    }

    const tooltipText = modalText || label;
    const badge = document.createElement("button");
    badge.className = "badge reveal";
    badge.type = "button";
    badge.setAttribute("aria-label", label);
    badge.dataset.label = label;
    badge.dataset.modalText = modalText;
    badge.dataset.action = action;
    badge.dataset.value = value;
    badge.dataset.actionLabel = actionLabel;
    badge.innerHTML = `
      <img src="${iconPath}" alt="" loading="lazy">
      <span class="badge-fallback" hidden>${String(index + 1).padStart(2, "0")}</span>
      <span class="badge-tooltip">${tooltipText}</span>
    `;

    const image = badge.querySelector("img");
    const fallback = badge.querySelector(".badge-fallback");
    image.addEventListener("error", () => {
      image.hidden = true;
      fallback.hidden = false;
    });

    const hasCustomText = Boolean(modalText);
    const hasActionValue = Boolean(value);
    const directAction = action === "toggle_entry" || action === "toggle_music" || (action === "link" && hasActionValue);
    const actionable = hasCustomText || directAction;

    if (hasCustomText) {
      badge.addEventListener("click", () => {
        openBadgeModal({
          label,
          modalText: badge.dataset.modalText,
          action: badge.dataset.action,
          value: badge.dataset.value,
          actionLabel: badge.dataset.actionLabel
        });
      });
    } else if (directAction) {
      badge.addEventListener("click", () => {
        runBadgeAction({
          label,
          modalText: "",
          action: badge.dataset.action,
          value: badge.dataset.value,
          actionLabel: badge.dataset.actionLabel
        });
      });
    } else if (!actionable) {
      badge.style.cursor = "default";
    }

    badgeList.appendChild(badge);
  });

  if (badgeCount) {
    badgeCount.textContent = String(icons.length).padStart(2, "0");
  }
}

function closeBadgeModal() {
  if (!badgeModal) {
    return;
  }

  badgeModal.hidden = true;
  document.body.classList.remove("overlay-active");
}

function runBadgeAction({ action, value }) {
  const normalizedAction = String(action || "message").toLowerCase();

  if (normalizedAction === "link" && value) {
    window.open(value, "_blank", "noreferrer");
    return;
  }

  if (normalizedAction === "toggle_entry") {
    const isHidden = entryOverlay && entryOverlay.classList.contains("hidden");
    if (entryOverlay) {
      entryOverlay.classList.toggle("hidden", !isHidden);
      document.body.classList.toggle("overlay-active", isHidden);
    }
    return;
  }

  if (normalizedAction === "toggle_music" && bgMusic && bgMusic.src) {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        bgMusic.muted = false;
      }).catch(() => {
      });
      return;
    }

    bgMusic.muted = !bgMusic.muted;
  }
}

function openBadgeModal({ label, modalText, action, value, actionLabel }) {
  if (!badgeModal || !badgeModalTitle || !badgeModalText || !badgeModalAction) {
    return;
  }

  const normalizedAction = String(action || "message").toLowerCase();
  const hasCustomText = Boolean(String(modalText || "").trim());
  const hasActionValue = Boolean(String(value || "").trim());

  if (!hasCustomText && normalizedAction === "message" && !hasActionValue) {
    return;
  }

  badgeModalKicker.textContent = "Badge";
  badgeModalTitle.textContent = label || "Badge Info";
  badgeModalText.textContent = modalText || "";
  badgeModalAction.hidden = true;
  badgeModalAction.textContent = actionLabel || "Open";
  badgeModalAction.onclick = null;

  if (normalizedAction === "link" && value) {
    badgeModalAction.hidden = false;
    badgeModalAction.textContent = actionLabel || "Open Link";
    badgeModalAction.onclick = () => {
      runBadgeAction({ action: normalizedAction, value });
      closeBadgeModal();
    };
  } else if (normalizedAction === "toggle_entry") {
    badgeModalAction.hidden = false;
    badgeModalAction.textContent = actionLabel || "Toggle Intro";
    badgeModalAction.onclick = () => {
      runBadgeAction({ action: normalizedAction, value });
      closeBadgeModal();
    };
  } else if (normalizedAction === "toggle_music") {
    badgeModalAction.hidden = false;
    badgeModalAction.textContent = actionLabel || "Toggle Music";
    badgeModalAction.onclick = () => {
      runBadgeAction({ action: normalizedAction, value });
      closeBadgeModal();
    };
  }

  badgeModal.hidden = false;
  document.body.classList.add("overlay-active");
}

function renderViewToggles() {
  viewToggles.forEach((toggle) => {
    toggle.classList.toggle("active", toggle.dataset.view === currentView);
  });
}

function buildLinkCard(link, index) {
  const isCopy = (link.type || "web").toLowerCase() === "copy";
  const isClosed = !isCopy && isPlaceholderLink(link);
  const isExpandableCopy = isCopy && currentView === "list";
  const metaLabel = isCopy
    ? (isExpandableCopy ? "" : (link.copy_label || "Copy"))
    : "";
  const metaValue = isClosed ? "Closed" : "";
  const card = document.createElement(isExpandableCopy ? "article" : (isCopy ? "button" : "a"));
  card.className = `link-card reveal${link.featured ? " featured" : ""}${isExpandableCopy ? " copy-expandable" : ""}`;
  card.dataset.category = link.category || "all";
  card.setAttribute("aria-label", `${link.title} - ${link.description}`);

  if (isCopy) {
    card.dataset.copyValue = link.copy_value || "";
    card.dataset.copySuccess = link.copy_success || "copied";
    card.dataset.copyIdle = link.copy_idle || "tap to copy";
    card.dataset.copyError = link.copy_error || "copy failed";
    if (!isExpandableCopy) {
      card.type = "button";
    }
  } else {
    card.href = link.url || "#";
    card.target = (link.url || "").startsWith("mailto:") ? "_self" : (linkSettings.default_target || "_blank");
    card.rel = (link.url || "").startsWith("mailto:") ? "" : "noreferrer";
  }

  const fallbackText = (link.title || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  card.innerHTML = `
    <div class="link-card-main">
      <div class="link-icon">
        <img src="${link.icon}" alt="${link.title} icon" loading="lazy">
        <span class="link-icon-fallback" hidden>${fallbackText}</span>
      </div>
      <div class="link-copy">
        <strong>${link.title}</strong>
        <span>${link.description}</span>
      </div>
    </div>
    <div class="link-meta">
      <small>${metaLabel}</small>
      <b>${isExpandableCopy ? "▾" : metaValue}</b>
    </div>
  `;

  if (isExpandableCopy) {
    const details = document.createElement("div");
    details.className = "copy-dropdown";
    details.hidden = true;
    details.innerHTML = `
      <div class="copy-dropdown-inner">
        <input class="copy-value-field" type="text" readonly value="${card.dataset.copyValue}">
        <button class="copy-action-button" type="button">${link.copy_label || "Copy"}</button>
      </div>
    `;
    card.appendChild(details);
  }

  const image = card.querySelector("img");
  const fallback = card.querySelector(".link-icon-fallback");
  image.addEventListener("error", () => {
    image.hidden = true;
    fallback.hidden = false;
  });

  if (currentView === "buttons") {
    let frame = null;
    let pointerState = null;

    card.addEventListener("pointermove", (event) => {
      pointerState = {
        x: event.clientX,
        y: event.clientY
      };

      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        const x = pointerState.x - bounds.left;
        const y = pointerState.y - bounds.top;
        const maxRotateX = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--icon-tilt-x")) || 0;
        const maxRotateY = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--icon-tilt-y")) || 0;
        const rotateX = ((y / bounds.height) - 0.5) * -maxRotateX * 2;
        const rotateY = ((x / bounds.width) - 0.5) * maxRotateY * 2;
        card.style.transform = `translateY(-3px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        frame = null;
      });
    });

    card.addEventListener("pointerleave", () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
      card.style.transform = "";
    });
  }

  if (isExpandableCopy) {
    const meta = card.querySelector(".link-meta small");
    const metaValueNode = card.querySelector(".link-meta b");
    const details = card.querySelector(".copy-dropdown");
    const copyButton = card.querySelector(".copy-action-button");
    const valueField = card.querySelector(".copy-value-field");
    const toggleExpand = () => {
      const expanded = card.classList.toggle("expanded");
      if (details) {
        details.hidden = !expanded;
      }
      if (metaValueNode) {
        metaValueNode.textContent = expanded ? "▴" : "▾";
      }
      if (meta) {
        meta.textContent = expanded ? (card.dataset.copyIdle || "expand to copy") : "";
      }
    };

    card.addEventListener("click", (event) => {
      if (event.target instanceof HTMLElement && event.target.closest(".copy-action-button, .copy-value-field")) {
        return;
      }
      toggleExpand();
    });

    if (valueField) {
      valueField.addEventListener("click", () => {
        valueField.select();
      });
    }

    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(card.dataset.copyValue || "");
          if (meta) {
            meta.textContent = card.dataset.copySuccess || "copied";
          }
        } catch (error) {
          if (meta) {
            meta.textContent = card.dataset.copyError || "copy failed";
          }
        }

        if (valueField) {
          valueField.select();
        }
      });
    }
  } else if (isCopy) {
    const meta = card.querySelector("small");
    card.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(card.dataset.copyValue || "");
        if (meta) {
          meta.textContent = card.dataset.copySuccess || "copied";
        }
      } catch (error) {
        if (meta) {
          meta.textContent = card.dataset.copyError || "copy failed";
        }
      }

      window.setTimeout(() => {
        if (meta) {
          meta.textContent = card.dataset.copyIdle || "tap to copy";
        }
      }, 1800);
    });
  }

  if (currentView === "list" && !isCopy && !isClosed) {
    const meta = card.querySelector(".link-meta");
    if (meta) {
      meta.hidden = true;
    }
  }

  return card;
}

function renderLinks(filter = "all") {
  if (!linksList) {
    return;
  }

  currentFilter = filter;
  linksList.innerHTML = "";
  linksList.classList.toggle("list-view", currentView === "list");
  linksList.classList.toggle(
    "list-descriptions-enabled",
    String(linkSettings.list_descriptions).toLowerCase() === "true"
  );

  const visibleLinks = data.filter((link) => {
    return filter === "all" || link.category === filter;
  });

  visibleLinks.forEach((link, index) => {
    linksList.appendChild(buildLinkCard(link, index));
  });

  if (linkCount) {
    linkCount.textContent = String(visibleLinks.length).padStart(2, "0");
  }

  setupRevealAnimations();
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal:not(.visible)");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 70}ms`;
    revealObserver.observe(item);
  });
}

async function fetchTextFile(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.text();
}

async function loadTemplates() {
  let settingsText = String(window.PLAYGROUND_SETTINGS_TEXT || "").trim()
    || (settingsData ? settingsData.textContent : "");
  let linksText = String(window.PLAYGROUND_LINKS_TEXT || "").trim()
    || (linksData ? linksData.textContent : "");

  if (!String(window.PLAYGROUND_SETTINGS_TEXT || "").trim() || !String(window.PLAYGROUND_LINKS_TEXT || "").trim()) {
    const [externalSettings, externalLinks] = await Promise.allSettled([
      fetchTextFile("settings.txt"),
      fetchTextFile("links.txt")
    ]);

    if (externalSettings.status === "fulfilled" && externalSettings.value.trim()) {
      settingsText = externalSettings.value;
    }

    if (externalLinks.status === "fulfilled" && externalLinks.value.trim()) {
      linksText = externalLinks.value;
    }
  }

  appSettings = {
    ...appSettings,
    ...parseSettings(settingsText)
  };

  const parsedLinks = parseLinks(linksText);
  linkSettings = {
    ...linkSettings,
    ...parsedLinks.settings
  };
  data = parsedLinks.links;
  currentView = (linkSettings.view_mode || "buttons").toLowerCase();
}

if (avatarImage && avatarFallback) {
  avatarImage.addEventListener("error", () => {
    avatarImage.hidden = true;
    avatarFallback.hidden = false;
  });
}

if (cardShell) {
  cardShell.addEventListener("pointermove", (event) => {
    cardPointerState = {
      x: event.clientX,
      y: event.clientY
    };

    if (cardPointerFrame) {
      return;
    }

    cardPointerFrame = window.requestAnimationFrame(() => {
      const bounds = cardShell.getBoundingClientRect();
      const x = cardPointerState.x - bounds.left;
      const y = cardPointerState.y - bounds.top;
      const maxRotateX = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--card-rotate-x")) || 0;
      const maxRotateY = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--card-rotate-y")) || 0;
      const lift = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--card-lift")) || 0;
      const rotateX = ((y / bounds.height) - 0.5) * -maxRotateX * 2;
      const rotateY = ((x / bounds.width) - 0.5) * maxRotateY * 2;
      cardShell.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      cardShell.style.boxShadow = `${-rotateY * 1.2}px ${lift + rotateX * -0.6}px 56px rgba(0, 0, 0, 0.24)`;
      cardPointerFrame = null;
    });
  });

  cardShell.addEventListener("pointerleave", () => {
    if (cardPointerFrame) {
      window.cancelAnimationFrame(cardPointerFrame);
      cardPointerFrame = null;
    }
    cardShell.style.transform = "";
    cardShell.style.boxShadow = "";
  });
}

function setupCursor() {
  const enabled = (appSettings.cursor_mode || "").toLowerCase() === "dot";
  document.body.classList.toggle("cursor-dot-enabled", enabled);

  if (!cursorDot) {
    return;
  }

  if (!enabled) {
    cursorDot.classList.remove("visible");
    return;
  }

  window.addEventListener("pointermove", (event) => {
    cursorState = {
      x: event.clientX,
      y: event.clientY
    };

    if (cursorFrame) {
      return;
    }

    cursorFrame = window.requestAnimationFrame(() => {
      cursorDot.classList.add("visible");
      cursorDot.style.left = `${cursorState.x}px`;
      cursorDot.style.top = `${cursorState.y}px`;
      cursorFrame = null;
    });
  });

  window.addEventListener("pointerdown", () => {
    cursorDot.classList.add("active");
  });

  window.addEventListener("pointerup", () => {
    cursorDot.classList.remove("active");
  });
}

function setupSnow() {
  if (!snowLayer) {
    return;
  }

  const enabled = String(appSettings.snow_enabled || "false").toLowerCase() === "true";

  if (!enabled) {
    snowLayer.hidden = true;
    if (snowAnimationFrame) {
      window.cancelAnimationFrame(snowAnimationFrame);
      snowAnimationFrame = null;
    }
    return;
  }

  const ctx = snowLayer.getContext("2d");
  if (!ctx) {
    return;
  }

  snowLayer.hidden = false;

  const particles = [];
  const settled = [];
  const particleCount = 90;
  let width = 0;
  let height = 0;
  let floorY = 0;

  const resizeSnow = () => {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    floorY = height - 8;
    snowLayer.width = Math.floor(width * dpr);
    snowLayer.height = Math.floor(height * dpr);
    snowLayer.style.width = `${width}px`;
    snowLayer.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const spawnParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * -height,
    r: 1 + Math.random() * 2.2,
    vy: 0.35 + Math.random() * 0.9,
    vx: -0.25 + Math.random() * 0.5,
    drift: Math.random() * Math.PI * 2
  });

  resizeSnow();
  particles.length = 0;
  settled.length = 0;

  for (let i = 0; i < particleCount; i += 1) {
    particles.push(spawnParticle());
  }

  const tick = () => {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255, 245, 255, 0.9)";

    settled.forEach((flake) => {
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
      ctx.fill();
    });

    particles.forEach((flake, index) => {
      flake.drift += 0.02;
      flake.x += flake.vx + Math.sin(flake.drift) * 0.18;
      flake.y += flake.vy;

      if (flake.y >= floorY) {
        settled.push({
          x: flake.x,
          y: floorY - Math.random() * 3,
          r: flake.r
        });

        if (settled.length > 240) {
          settled.shift();
        }

        particles[index] = spawnParticle();
        particles[index].y = -6;
      }

      if (flake.x < -8) {
        flake.x = width + 8;
      } else if (flake.x > width + 8) {
        flake.x = -8;
      }

      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
      ctx.fill();
    });

    snowAnimationFrame = window.requestAnimationFrame(tick);
  };

  window.addEventListener("resize", resizeSnow);
  tick();
}

function openSidebar() {
  if (!sidebarPanel || !sidebarToggle || !sidebarBackdrop) {
    return;
  }

  sidebarPanel.classList.add("open");
  sidebarPanel.setAttribute("aria-hidden", "false");
  sidebarToggle.setAttribute("aria-expanded", "true");
  sidebarBackdrop.hidden = false;
  document.body.classList.add("sidebar-open");
}

function closeSidebar() {
  if (!sidebarPanel || !sidebarToggle || !sidebarBackdrop) {
    return;
  }

  sidebarPanel.classList.remove("open");
  sidebarPanel.setAttribute("aria-hidden", "true");
  sidebarToggle.setAttribute("aria-expanded", "false");
  sidebarBackdrop.hidden = true;
  document.body.classList.remove("sidebar-open");
}

viewToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    currentView = toggle.dataset.view || "buttons";
    renderViewToggles();
    renderLinks(currentFilter);
  });
});

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    const isOpen = sidebarPanel && sidebarPanel.classList.contains("open");
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

if (sidebarClose) {
  sidebarClose.addEventListener("click", closeSidebar);
}

if (sidebarBackdrop) {
  sidebarBackdrop.addEventListener("click", closeSidebar);
}

if (sidebarHome) {
  sidebarHome.addEventListener("click", () => {
    currentFilter = "all";
    currentView = (linkSettings.view_mode || "buttons").toLowerCase();
    renderViewToggles();
    renderLinks("all");

    if (filterControls) {
      filterControls.querySelectorAll(".filter-pill").forEach((pill, index) => {
        pill.classList.toggle("active", index === 0);
      });
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    closeSidebar();
  });
}

if (sidebarHomeIcon && sidebarHomeLabel) {
  sidebarHomeIcon.addEventListener("load", () => {
    sidebarHomeIcon.hidden = false;
  });

  sidebarHomeIcon.addEventListener("error", () => {
    sidebarHomeIcon.hidden = true;
    sidebarHomeLabel.hidden = false;
  });

  if (sidebarHomeIcon.complete && sidebarHomeIcon.naturalWidth > 0) {
    sidebarHomeIcon.hidden = false;
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
    closeBadgeModal();
  }
});

if (badgeModalClose) {
  badgeModalClose.addEventListener("click", closeBadgeModal);
}

if (badgeModal) {
  badgeModal.addEventListener("click", (event) => {
    if (event.target === badgeModal) {
      closeBadgeModal();
    }
  });
}

if (bgVideoWrap && bgVideo) {
  bgVideo.addEventListener("loadeddata", () => {
    bgVideoWrap.hidden = false;
  });

  bgVideo.addEventListener("error", () => {
    bgVideoWrap.hidden = true;
  });
}

async function init() {
  try {
    await loadTemplates();
  } catch (error) {
    if (profileBio) {
      profileBio.textContent = "Could not load the embedded site settings.";
    }
  }

  setProfileContent();
  setupLocationChip();
  setupVisitChip();
  applyTheme();
  renderFilterButtons();
  renderViewToggles();
  renderBadges();
  renderLinks();
  setupCursor();
  setupMusic();
  setupSnow();

  const entryEnabled = String(appSettings.entry_enabled).toLowerCase() === "true";
  document.body.classList.toggle("overlay-active", entryEnabled);

  if (entryOverlay && entryButton) {
    if (!entryEnabled) {
      entryOverlay.classList.add("hidden");
    } else {
      const closeOverlay = async () => {
        if (bgMusic && bgMusic.src) {
          try {
            await bgMusic.play();
            bgMusic.muted = false;
          } catch (error) {
          }
        }

        entryOverlay.classList.add("hidden");
        document.body.classList.remove("overlay-active");
      };

      entryOverlay.addEventListener("click", closeOverlay, { once: true });
      document.addEventListener("keydown", async (event) => {
        event.preventDefault();
        await closeOverlay();
      }, { once: true });
    }
  }
}

init();
