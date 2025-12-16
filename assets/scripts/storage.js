// storage.js - Chrome Storage Management
import State from "./state.js";

export async function loadSettingsFromStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get(
            [
                "isStaticWallpaper",
                "staticWallpaperUrl",
                "staticWallpaperId",
                "likedWallpapers",
                "is12HourFormat",
                "onlyShowLiked",
                "selectedBookmarks",
                "customLogoUrl",
            ],
            (data) => {
                State.isStaticWallpaper = data.isStaticWallpaper || false;
                State.staticWallpaperUrl = data.staticWallpaperUrl || null;
                State.staticWallpaperId = data.staticWallpaperId || null;
                State.is12HourFormat = data.is12HourFormat || false;
                State.onlyShowLiked = data.onlyShowLiked || false;

                State.likedWallpapers = Array.isArray(data.likedWallpapers)
                    ? data.likedWallpapers.filter((w) => w && w.id && w.url)
                    : [];

                State.selectedBookmarks = Array.isArray(data.selectedBookmarks)
                    ? data.selectedBookmarks.filter((b) => b && b.id && b.url)
                    : [];

                State.customLogoUrl = data.customLogoUrl || null;

                resolve();
            }
        );
    });
}

export function saveSettingsToStorage() {
    chrome.storage.local.set({
        isStaticWallpaper: State.isStaticWallpaper,
        staticWallpaperUrl: State.staticWallpaperUrl,
        staticWallpaperId: State.staticWallpaperId,
        likedWallpapers: State.likedWallpapers,
        is12HourFormat: State.is12HourFormat,
        onlyShowLiked: State.onlyShowLiked,
        selectedBookmarks: State.selectedBookmarks,
        customLogoUrl: State.customLogoUrl,
    });
}