import State from "./state.js";

export async function loadSettingsFromStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get(
            [
                "isStaticWallpaper",
                "staticWallpaperUrl",
                "is12HourFormat",
                "selectedBookmarks",
                "customLogoUrl",
            ],
            (data) => {
                State.isStaticWallpaper = data.isStaticWallpaper || false;
                State.staticWallpaperUrl = data.staticWallpaperUrl || null;
                State.is12HourFormat = data.is12HourFormat || false;

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
        is12HourFormat: State.is12HourFormat,
        selectedBookmarks: State.selectedBookmarks,
        customLogoUrl: State.customLogoUrl,
    });
}