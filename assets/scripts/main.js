// main.js - Main Application Entry Point
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
    // Load saved settings
    await loadSettingsFromStorage();

    // Start clock and date
    startClock();

    // Load initial content
    loadWallpaper();
    loadGreeting();
    loadTip();
    loadRandomLogo();

    // Initialize UI components
    initDrawer();
    initNewsDrawer();
    initSearch();
    initBookmarks();
    initLogoActivation();
    initRecentTabs();
    initShortcuts();
    initHelp();
}

// Start the application
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}