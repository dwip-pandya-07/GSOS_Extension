// drawer.js - Settings Drawer Management
import State from "./state.js";
import { showNotification } from "./utils.js";
import { saveSettingsToStorage } from "./storage.js";
import { loadWallpaper, downloadWallpaper } from "./wallpaper.js";
import { toggleLikeWallpaper } from "./likes.js";
import { updateClock } from "./clock.js";

export function initDrawer() {
    const drawer = document.getElementById("settings-drawer");
    const toggle = document.getElementById("drawer-toggle");
    const close = document.getElementById("drawer-close");
    const overlay = document.getElementById("drawer-overlay");

    if (!drawer || !toggle || !close || !overlay) return;

    toggle.onclick = () => {
        drawer.classList.add("open");
        overlay.classList.add("active");
    };

    close.onclick = overlay.onclick = () => {
        drawer.classList.remove("open");
        overlay.classList.remove("active");
    };

    // Static wallpaper toggle
    const staticToggle = document.getElementById("static-wallpaper-toggle");
    if (staticToggle) {
        staticToggle.checked = State.isStaticWallpaper;
        staticToggle.onchange = (e) => {
            if (e.target.checked && State.currentWallpaperUrl) {
                State.isStaticWallpaper = true;
                State.staticWallpaperUrl = State.currentWallpaperUrl;
                State.staticWallpaperId = State.currentWallpaperId;
                showNotification("Wallpaper pinned", "success");
            } else {
                State.isStaticWallpaper = false;
                State.staticWallpaperUrl = State.staticWallpaperId = null;
                showNotification("Static wallpaper disabled", "info");
                loadWallpaper();
            }
            saveSettingsToStorage();
        };
    }

    // Like button
    const likeBtn = document.getElementById("main-like-button");
    if (likeBtn) {
        likeBtn.onclick = toggleLikeWallpaper;
    }

    // Only liked toggle
    const onlyToggle = document.getElementById("only-liked-toggle");
    if (onlyToggle) {
        onlyToggle.onchange = (e) => {
            if (State.likedWallpapers.length === 0) {
                e.target.checked = false;
                showNotification("Like some wallpapers first!", "warning");
                return;
            }
            State.onlyShowLiked = e.target.checked;
            showNotification(
                State.onlyShowLiked
                    ? "Showing only favorites"
                    : "Showing all wallpapers",
                "success"
            );
            loadWallpaper();
            saveSettingsToStorage();
        };
    }

    // Download button
    const downloadBtn = document.getElementById("download-wallpaper");
    if (downloadBtn) {
        downloadBtn.onclick = downloadWallpaper;
    }

    // Time format toggle
    const timeToggle = document.getElementById("time-format-toggle");
    const timeLabel = document.getElementById("time-format-label");
    if (timeToggle && timeLabel) {
        timeToggle.checked = State.is12HourFormat;
        timeLabel.textContent = State.is12HourFormat
            ? "12-hour format"
            : "24-hour format";
        timeToggle.onchange = (e) => {
            State.is12HourFormat = e.target.checked;
            timeLabel.textContent = State.is12HourFormat
                ? "12-hour format"
                : "24-hour format";
            updateClock();
            saveSettingsToStorage();
        };
    }
}