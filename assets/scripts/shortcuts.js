// shortcuts.js - Global Keyboard Shortcuts

export function initShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only trigger if not in an input field
        const activeElement = document.activeElement;
        const isInput = activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable;

        if (isInput) return;

        // We use Shift + Key as requested
        if (e.shiftKey) {
            const key = e.key.toLowerCase();

            switch (key) {
                case 's': // Shift + S: Settings
                    e.preventDefault();
                    toggleSettings();
                    break;
                case 'n': // Shift + N: News
                    e.preventDefault();
                    toggleNews();
                    break;
                case 'b': // Shift + B: Bookmarks
                    e.preventDefault();
                    toggleBookmarks();
                    break;
                case 'l': // Shift + L: Like Wallpaper
                    e.preventDefault();
                    toggleLike();
                    break;
                case 'h': // Shift + H: Help
                    e.preventDefault();
                    toggleHelpGuidance();
                    break;
            }
        }
    });
}

function toggleSettings() {
    const drawer = document.getElementById('settings-drawer');
    if (drawer) {
        if (drawer.classList.contains('open')) {
            document.getElementById('drawer-close')?.click();
        } else {
            document.getElementById('drawer-toggle')?.click();
        }
    }
}

function toggleNews() {
    const newsDrawer = document.getElementById('news-drawer');
    if (newsDrawer) {
        if (newsDrawer.classList.contains('open')) {
            document.getElementById('news-close')?.click();
        } else {
            document.getElementById('news-toggle')?.click();
        }
    }
}

function toggleBookmarks() {
    document.getElementById('bookmarks-toggle')?.click();
}

function toggleLike() {
    document.getElementById('main-like-button')?.click();
}

function toggleHelpGuidance() {
    const helpDrawer = document.getElementById('help-drawer');
    if (helpDrawer) {
        if (helpDrawer.classList.contains('open')) {
            document.getElementById('help-close')?.click();
        } else {
            document.getElementById('help-toggle')?.click();
        }
    }
}
