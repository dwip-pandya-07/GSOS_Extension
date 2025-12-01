// CONFIGURATION
const UNSPLASH_KEY = "GjKAaKJOy1oBXxnoo4rHRuyM4KPWhT8iZIWcn2xuc9I";
const USE_UNSPLASH = false; // Set to true to use Unsplash instead
// const LARAVEL_WALLPAPER_API = "http://127.0.0.1:8000/api/wallpapers"; // Change when live

// Brand logos
const brandLogos = [
  "/assets/images/invinsense_white.png",
];

// Security tips
const securityTips = [
  "Never share your passwords with anyone.",
  "Use multi-factor authentication whenever possible.",
  "Avoid clicking unknown links in emails.",
  "Keep your software updated to prevent vulnerabilities.",
  "Lock your screen when away from your device.",
  "Use strong, unique passwords for each account.",
  "Enable two-factor authentication on all accounts.",
  "Be cautious of phishing emails and suspicious links.",
  "Encrypt sensitive data before transmission.",
  "Review account activity and login history regularly.",
  "Use a VPN for secure browsing on public Wi-Fi.",
  "Back up important data to secure locations.",
  "Avoid using public USB charging stations.",
  "Implement principle of least privilege.",
  "Never leave sensitive documents unattended.",
  "Use password managers to store credentials securely.",
  "Verify sender identity before responding to requests.",
  "Be wary of social engineering attempts.",
  "Regularly audit your third-party app permissions.",
  "Use encrypted messaging apps for sensitive conversations.",
];

// Fallback local images
const backupImages = Array.from(
  { length: 15 },
  (_, i) => `backup/image${i + 1}.png`
);

// ========================================
// State Variables
// ========================================
let currentWallpaperUrl = null;
let currentWallpaperId = null;
let likedWallpapers = []; // Array of { id: string, url: string }
let isStaticWallpaper = false;
let staticWallpaperUrl = null;
let staticWallpaperId = null;
let is12HourFormat = false;
let onlyShowLiked = false;

// ========================================
// Loader
// ========================================
function hideLoader() {
  const loader = document.getElementById("loader");
  const container = document.getElementById("main-container");
  if (!loader || !container) return;
  container.classList.add("loaded");
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.5s ease";
    setTimeout(() => (loader.style.display = "none"), 500);
  }, 100);
}

// ========================================
// Clock & Date
// ========================================
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  if (is12HourFormat) {
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    document.getElementById(
      "time"
    ).textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
  } else {
    hours = String(hours).padStart(2, "0");
    document.getElementById(
      "time"
    ).textContent = `${hours}:${minutes}:${seconds}`;
  }
}

function updateDate() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.getElementById("date").textContent = now.toLocaleDateString(
    "en-US",
    options
  );
}

// ========================================
// Wallpaper Loading
// ========================================
async function loadWallpaper() {
  // 1. Pinned wallpaper
  if (isStaticWallpaper && staticWallpaperUrl) {
    setWallpaper(staticWallpaperUrl, staticWallpaperId);
    return;
  }

  // 2. Only show liked wallpapers
  if (onlyShowLiked && likedWallpapers.length > 0) {
    const random =
      likedWallpapers[Math.floor(Math.random() * likedWallpapers.length)];
    setWallpaper(random.url, random.id);
    return;
  }

  // 3. Use Laravel API or Unsplash
  if (USE_UNSPLASH) {
    await loadFromUnsplash();
  } else {
    await loadFromLaravel();
  }
}

// Laravel API loader
async function loadFromLaravel() {
  try {
    const res = await fetch(LARAVEL_WALLPAPER_API);
    if (!res.ok) throw new Error("Laravel API error");

    const json = await res.json();
    if (!json.status || json.count === 0) throw new Error("No wallpapers");

    const wallpapers = json.data;
    const selected = selectWeightedWallpaper(wallpapers);
    preloadAndSet(selected.url, selected.id);
  } catch (err) {
    console.warn("Laravel failed → fallback", err);
    loadBackupWallpaper();
  }
}

// Unsplash fallback
async function loadFromUnsplash() {
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=nature,landscape,mountain,abstract,minimal&orientation=landscape&client_id=${UNSPLASH_KEY}`
    );
    if (!res.ok) throw new Error("Unsplash failed");

    const data = await res.json();
    preloadAndSet(data.urls.full, data.id);
  } catch (err) {
    console.warn("Unsplash failed → backup", err);
    loadBackupWallpaper();
  }
}

// Weighted selection (prefers liked ones)
function selectWeightedWallpaper(wallpapers) {
  if (!onlyShowLiked && likedWallpapers.length > 0 && Math.random() < 0.6) {
    const liked = wallpapers.filter((w) =>
      likedWallpapers.some((l) => l.id === w.id)
    );
    if (liked.length > 0) {
      return liked[Math.floor(Math.random() * liked.length)];
    }
  }
  return wallpapers[Math.floor(Math.random() * wallpapers.length)];
}

// Preload & set wallpaper
function preloadAndSet(url, id) {
  const img = new Image();
  img.onload = () => {
    setWallpaper(url, id);
    hideLoader();
  };
  img.onerror = () => loadBackupWallpaper();
  img.src = url;
}

// Local backup
function loadBackupWallpaper() {
  const path = backupImages[Math.floor(Math.random() * backupImages.length)];
  const img = new Image();
  img.onload = () => {
    setWallpaper(path);
    hideLoader();
  };
  img.onerror = setFallbackGradient;
  img.src = path;
}

function setFallbackGradient() {
  const bg = document.getElementById("bg");
  bg.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  bg.style.opacity = "1";
  currentWallpaperUrl = null;
  currentWallpaperId = null;
  updateMainLikeButton();
  hideLoader();
}

function setWallpaper(url, id = null) {
  const bg = document.getElementById("bg");
  bg.style.backgroundImage = `url('${url}')`;
  bg.style.opacity = "1";
  currentWallpaperUrl = url;
  currentWallpaperId = id;
  updateMainLikeButton();
  hideLoader();
}

// ========================================
// Like System (Heart Button)
// ========================================
function updateMainLikeButton() {
  const btn = document.getElementById("main-like-button");
  const outline = btn.querySelector(".heart-outline");
  const fill = btn.querySelector(".heart-fill");

  if (!currentWallpaperId) {
    btn.classList.remove("liked");
    outline.style.display = "block";
    fill.style.display = "none";
    return;
  }

  const isLiked = likedWallpapers.some((w) => w.id === currentWallpaperId);
  if (isLiked) {
    btn.classList.add("liked");
    outline.style.display = "none";
    fill.style.display = "block";
  } else {
    btn.classList.remove("liked");
    outline.style.display = "block";
    fill.style.display = "none";
  }
}

function toggleLikeWallpaper() {
  if (!currentWallpaperId || !currentWallpaperUrl) {
    showNotification("Cannot like backup wallpapers", "warning");
    return;
  }

  const exists = likedWallpapers.some((w) => w.id === currentWallpaperId);

  if (exists) {
    likedWallpapers = likedWallpapers.filter(
      (w) => w.id !== currentWallpaperId
    );
    showNotification("Removed from favorites", "info");
  } else {
    likedWallpapers.push({ id: currentWallpaperId, url: currentWallpaperUrl });
    showNotification("Added to favorites!", "success");
  }

  updateMainLikeButton();
  updateOnlyLikedToggleState();
  saveSettingsToStorage();

  if (onlyShowLiked && likedWallpapers.length === 0) {
    loadWallpaper();
  }
}

// ========================================
// "Show Only Liked" Toggle
// ========================================
function updateOnlyLikedToggleState() {
  const toggle = document.getElementById("only-liked-toggle");
  if (likedWallpapers.length === 0) {
    onlyShowLiked = false;
    toggle.checked = false;
    toggle.disabled = true;
  } else {
    toggle.disabled = false;
    toggle.checked = onlyShowLiked;
  }
}

// ========================================
// Download
// ========================================
async function downloadWallpaper() {
  if (!currentWallpaperUrl) {
    showNotification("No wallpaper to download", "warning");
    return;
  }
  try {
    showNotification("Downloading...", "info");
    const res = await fetch(currentWallpaperUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GSOS_${Date.now()}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("Downloaded!", "success");
  } catch {
    showNotification("Download failed", "error");
  }
}

// ========================================
// Notifications
// ========================================
function showNotification(message, type = "info") {
  document.querySelectorAll(".notification").forEach((n) => n.remove());
  const n = document.createElement("div");
  n.className = `notification notification-${type}`;
  n.textContent = message;
  n.style.cssText = `
    position:fixed;top:20px;right:20px;z-index:10000;
    padding:16px 24px;border-radius:12px;color:white;
    font-weight:500;box-shadow:0 4px 16px rgba(0,0,0,0.3);
    background:rgba(50,50,50,0.95);animation:slideIn 0.4s ease-out;
  `;
  if (type === "success") n.style.background = "rgba(76, 175, 80, 0.95)";
  if (type === "error") n.style.background = "rgba(244, 67, 54, 0.95)";
  if (type === "warning") n.style.background = "rgba(255, 152, 0, 0.95)";
  document.body.appendChild(n);
  setTimeout(() => {
    n.style.animation = "slideOut 0.4s ease-in";
    setTimeout(() => n.remove(), 400);
  }, 3000);
}

document.head.insertAdjacentHTML(
  "beforeend",
  `
  <style>
    @keyframes slideIn { from {transform:translateX(100px);opacity:0} to {transform:translateX(0);opacity:1} }
    @keyframes slideOut { from {transform:translateX(0);opacity:1} to {transform:translateX(100px);opacity:0} }
  </style>
`
);

// ========================================
// UI Helpers
// ========================================
function loadRandomLogo() {
  document.getElementById("brand-logo").src =
    brandLogos[Math.floor(Math.random() * brandLogos.length)];
}

function loadGreeting() {
  const hour = new Date().getHours();
  const greet =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  document.getElementById("greeting").textContent = greet;
}

function getDailyTip() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return securityTips[dayOfYear % securityTips.length];
}

function loadTip() {
  document.getElementById("tip").textContent = `"${getDailyTip()}"`;
}

// ========================================
// Drawer & Settings
// ========================================
function initDrawer() {
  const drawer = document.getElementById("settings-drawer");
  const toggle = document.getElementById("drawer-toggle");
  const close = document.getElementById("drawer-close");
  const overlay = document.getElementById("drawer-overlay");

  toggle.onclick = () => {
    drawer.classList.add("open");
    overlay.classList.add("active");
  };
  close.onclick = overlay.onclick = () => {
    drawer.classList.remove("open");
    overlay.classList.remove("active");
  };

  // Static wallpaper
  const staticToggle = document.getElementById("static-wallpaper-toggle");
  staticToggle.checked = isStaticWallpaper;
  staticToggle.onchange = (e) => {
    if (e.target.checked && currentWallpaperUrl) {
      isStaticWallpaper = true;
      staticWallpaperUrl = currentWallpaperUrl;
      staticWallpaperId = currentWallpaperId;
      showNotification("Wallpaper pinned", "success");
    } else {
      isStaticWallpaper = false;
      staticWallpaperUrl = staticWallpaperId = null;
      showNotification("Static wallpaper disabled", "info");
      loadWallpaper();
    }
    saveSettingsToStorage();
  };

  // Like button
  document.getElementById("main-like-button").onclick = toggleLikeWallpaper;

  // Only liked toggle
  const onlyToggle = document.getElementById("only-liked-toggle");
  onlyToggle.onchange = (e) => {
    if (likedWallpapers.length === 0) {
      e.target.checked = false;
      showNotification("Like some wallpapers first!", "warning");
      return;
    }
    onlyShowLiked = e.target.checked;
    showNotification(
      onlyShowLiked ? "Showing only favorites" : "Showing all wallpapers",
      "success"
    );
    loadWallpaper();
    saveSettingsToStorage();
  };

  // Download
  document.getElementById("download-wallpaper").onclick = downloadWallpaper;

  // Time format
  const timeToggle = document.getElementById("time-format-toggle");
  const timeLabel = document.getElementById("time-format-label");
  timeToggle.checked = is12HourFormat;
  timeLabel.textContent = is12HourFormat ? "12-hour format" : "24-hour format";
  timeToggle.onchange = (e) => {
    is12HourFormat = e.target.checked;
    timeLabel.textContent = is12HourFormat
      ? "12-hour format"
      : "24-hour format";
    updateClock();
    saveSettingsToStorage();
  };
}

// ========================================
// Storage
// ========================================
async function loadSettingsFromStorage() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      [
        "isStaticWallpaper",
        "staticWallpaperUrl",
        "staticWallpaperId",
        "likedWallpapers",
        "is12HourFormat",
        "onlyShowLiked",
      ],
      (data) => {
        isStaticWallpaper = data.isStaticWallpaper || false;
        staticWallpaperUrl = data.staticWallpaperUrl || null;
        staticWallpaperId = data.staticWallpaperId || null;
        is12HourFormat = data.is12HourFormat || false;
        onlyShowLiked = data.onlyShowLiked || false;

        // Keep only valid liked wallpapers with URLs
        likedWallpapers = Array.isArray(data.likedWallpapers)
          ? data.likedWallpapers.filter((w) => w && w.id && w.url)
          : [];

        resolve();
      }
    );
  });
}

function saveSettingsToStorage() {
  chrome.storage.sync.set({
    isStaticWallpaper,
    staticWallpaperUrl,
    staticWallpaperId,
    likedWallpapers,
    is12HourFormat,
    onlyShowLiked,
  });
}

// ========================================
// Init
// ========================================
async function init() {
  await loadSettingsFromStorage();
  updateClock();
  updateDate();
  setInterval(updateClock, 1000);

  loadWallpaper();
  loadGreeting();
  loadTip();
  loadRandomLogo();

  initDrawer();
  updateMainLikeButton();
  updateOnlyLikedToggleState();
}

// Start
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
