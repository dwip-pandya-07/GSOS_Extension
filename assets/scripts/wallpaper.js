// wallpaper.js - Wallpaper Loading and Management
import State from "./state.js";
import { BACKUP_IMAGES } from "./config.js";
import { hideLoader } from "./utils.js";

function setWallpaper(url) {
    const bg = document.getElementById("bg");
    bg.style.backgroundImage = `url('${url}')`;
    bg.style.opacity = "1";
    State.currentWallpaperUrl = url;
    hideLoader();
}

function setFallbackGradient() {
    const bg = document.getElementById("bg");
    bg.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    bg.style.opacity = "1";
    State.currentWallpaperUrl = null;
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

export function loadWallpaper() {
    if (State.isStaticWallpaper && State.staticWallpaperUrl) {
        setWallpaper(State.staticWallpaperUrl);
        return;
    }

    loadBackupWallpaper();
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
        a.download = `Invinsense_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification("Downloaded!", "success");
    } catch {
        const { showNotification } = await import("./utils.js");
        showNotification("Download failed", "error");
    }
}
