import { loadSettingsFromStorage } from "./storage.js";
import { startClock } from "./clock.js";
import { loadTip } from "./tips.js";
import { loadWallpaper } from "./wallpaper.js";
import { loadRandomLogo, loadGreeting } from "./ui.js";
import { initSearch } from "./search.js";
import { initBookmarks } from "./bookmarks.js";
import { initDrawer } from "./drawer.js";
import { initNewsDrawer } from "./news.js";
import { initLogoActivation } from "./logo-activation.js";
import { initRecentTabs } from "./recent-tabs.js";
import { initShortcuts } from "./shortcuts.js";
import { initHelp } from "./help.js";


async function init() {
    await loadSettingsFromStorage();
    startClock();
    loadWallpaper();
    loadGreeting();
    loadTip();
    loadRandomLogo();

    initDrawer();
    initNewsDrawer();
    initSearch();
    initBookmarks();
    initLogoActivation();
    initRecentTabs();
    initShortcuts();
    initHelp();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}