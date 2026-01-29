export function initShortcuts() {
    document.addEventListener('keydown', (e) => {
        const activeElement = document.activeElement;
        const isInput = activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable;

        if (isInput) return;

        if (e.shiftKey) {
            const key = e.key.toLowerCase();

            switch (key) {
                case 's':
                    e.preventDefault();
                    toggleSettings();
                    break;
                case 'n':
                    e.preventDefault();
                    toggleNews();
                    break;
                case 'b':
                    e.preventDefault();
                    toggleBookmarks();
                    break;
                case 'h':
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
