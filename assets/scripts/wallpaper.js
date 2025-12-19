// wallpaper.js - Wallpaper Loading and Management
import State from "./state.js";
import { CONFIG, BACKUP_IMAGES } from "./config.js";
import { hideLoader } from "./utils.js";
import { updateMainLikeButton } from "./likes.js";

function setWallpaper(url, id = null) {
    const bg = document.getElementById("bg");
    bg.style.backgroundImage = `url('${url}')`;
    bg.style.opacity = "1";
    State.currentWallpaperUrl = url;
    State.currentWallpaperId = id;
    updateMainLikeButton();
    hideLoader();
}

function setFallbackGradient() {
    const bg = document.getElementById("bg");
    bg.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    bg.style.opacity = "1";
    State.currentWallpaperUrl = null;
    State.currentWallpaperId = null;
    updateMainLikeButton();
    hideLoader();
}

function loadBackupWallpaper() {
    const path = BACKUP_IMAGES[Math.floor(Math.random() * BACKUP_IMAGES.length)];
    const img = new Image();
    img.onload = () => {
        setWallpaper(path);
        hideLoader();
    };
    img.onerror = setFallbackGradient;
    img.src = path;
}

function preloadLikedWallpaper(url, id, triedIds = []) {
    const img = new Image();
    img.onload = () => {
        setWallpaper(url, id);
        hideLoader();
    };
    img.onerror = () => {
        triedIds.push(id);
        const remaining = State.likedWallpapers.filter(
            (w) => !triedIds.includes(w.id)
        );
        if (remaining.length > 0) {
            const next = remaining[Math.floor(Math.random() * remaining.length)];
            preloadLikedWallpaper(next.url, next.id, triedIds);
        } else {
            setFallbackGradient();
        }
    };
    img.src = url;
}

function preloadAndSet(url, id) {
    const img = new Image();
    img.onload = () => {
        setWallpaper(url, id);
        hideLoader();
    };
    img.onerror = () => loadBackupWallpaper();
    img.src = url;
}

async function loadFromLaravel() {
    try {
        const res = await fetch(CONFIG.LARAVEL_WALLPAPER_API);
        if (!res.ok) throw new Error("Laravel API error");

        const json = await res.json();
        if (!json.status || json.count === 0) throw new Error("No wallpapers");

        const wallpapers = json.data;
        const selected = wallpapers[Math.floor(Math.random() * wallpapers.length)];
        preloadAndSet(selected.url, selected.id);
    } catch (err) {
        loadBackupWallpaper();
    }
}

async function loadFromUnsplash() {
    try {
        const res = await fetch(
            `https://api.unsplash.com/photos/random?query=nature,landscape,mountain,abstract,minimal&orientation=landscape&client_id=${CONFIG.UNSPLASH_KEY}`
        );
        if (!res.ok) throw new Error("Unsplash failed");

        const data = await res.json();
        preloadAndSet(data.urls.full, data.id);
    } catch (err) {
        loadBackupWallpaper();
    }
}

export async function loadWallpaper() {
    if (State.isStaticWallpaper && State.staticWallpaperUrl) {
        setWallpaper(State.staticWallpaperUrl, State.staticWallpaperId);
        return;
    }

    if (State.onlyShowLiked && State.likedWallpapers.length > 0) {
        const random =
            State.likedWallpapers[
            Math.floor(Math.random() * State.likedWallpapers.length)
            ];
        preloadLikedWallpaper(random.url, random.id);
        return;
    }

    if (CONFIG.USE_UNSPLASH) {
        await loadFromUnsplash();
    } else {
        await loadFromLaravel();
    }
}

export async function downloadWallpaper() {
    if (!State.currentWallpaperUrl) {
        const { showNotification } = await import("./utils.js");
        showNotification("No wallpaper to download", "warning");
        return;
    }
    try {
        const { showNotification } = await import("./utils.js");
        showNotification("Downloading...", "info");
        const res = await fetch(State.currentWallpaperUrl);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Invinsense_${Date.now()}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification("Downloaded!", "success");
    } catch {
        const { showNotification } = await import("./utils.js");
        showNotification("Download failed", "error");
    }
}