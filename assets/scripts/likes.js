// likes.js - Like System Management
import State from "./state.js";
import { showNotification } from "./utils.js";
import { saveSettingsToStorage } from "./storage.js";
import { loadWallpaper } from "./wallpaper.js";

export function updateMainLikeButton() {
    const btn = document.getElementById("main-like-button");
    if (!btn) return;

    const outline = btn.querySelector(".heart-outline");
    const fill = btn.querySelector(".heart-fill");

    if (!State.currentWallpaperId) {
        btn.classList.remove("liked");
        if (outline) outline.style.display = "block";
        if (fill) fill.style.display = "none";
        return;
    }

    const isLiked = State.likedWallpapers.some(
        (w) => w.id === State.currentWallpaperId
    );
    if (isLiked) {
        btn.classList.add("liked");
        if (outline) outline.style.display = "none";
        if (fill) fill.style.display = "block";
    } else {
        btn.classList.remove("liked");
        if (outline) outline.style.display = "block";
        if (fill) fill.style.display = "none";
    }
}

export function toggleLikeWallpaper() {
    if (!State.currentWallpaperId || !State.currentWallpaperUrl) {
        showNotification("Cannot like backup wallpapers", "warning");
        return;
    }

    const exists = State.likedWallpapers.some(
        (w) => w.id === State.currentWallpaperId
    );

    if (exists) {
        State.likedWallpapers = State.likedWallpapers.filter(
            (w) => w.id !== State.currentWallpaperId
        );
        showNotification("Removed from favorites", "info");
    } else {
        State.likedWallpapers.push({
            id: State.currentWallpaperId,
            url: State.currentWallpaperUrl,
        });
        showNotification("Added to favorites!", "success");
    }

    updateMainLikeButton();
    updateOnlyLikedToggleState();
    saveSettingsToStorage();

    if (State.onlyShowLiked && State.likedWallpapers.length === 0) {
        loadWallpaper();
    }
}

export function updateOnlyLikedToggleState() {
    const toggle = document.getElementById("only-liked-toggle");
    if (!toggle) return;

    if (State.likedWallpapers.length === 0) {
        State.onlyShowLiked = false;
        toggle.checked = false;
        toggle.disabled = true;
    } else {
        toggle.disabled = false;
        toggle.checked = State.onlyShowLiked;
    }
}