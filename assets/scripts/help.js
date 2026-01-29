// help.js - Help Guide Interaction Logic

export function initHelp() {
    const helpToggle = document.getElementById('help-toggle');
    const helpDrawer = document.getElementById('help-drawer');
    const helpClose = document.getElementById('help-close');
    const overlay = document.getElementById('drawer-overlay');

    if (!helpToggle || !helpDrawer || !helpClose || !overlay) return;

    function openHelp() {
        helpDrawer.classList.add('open');
        overlay.classList.add('active');
        // Close other drawers if open
        document.getElementById('settings-drawer')?.classList.remove('open');
        document.getElementById('news-drawer')?.classList.remove('open');
    }

    function closeHelp() {
        helpDrawer.classList.remove('open');
        // Only hide overlay if no other drawer is open
        const newsDrawer = document.getElementById('news-drawer');
        const settingsDrawer = document.getElementById('settings-drawer');
        if (!newsDrawer?.classList.contains('open') && !settingsDrawer?.classList.contains('open')) {
            overlay.classList.remove('active');
        }
    }

    helpToggle.addEventListener('click', toggleHelp);
    helpClose.addEventListener('click', closeHelp);

    // Close on overlay click
    overlay.addEventListener('click', () => {
        if (helpDrawer.classList.contains('open')) {
            closeHelp();
        }
    });

    // Handle ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && helpDrawer.classList.contains('open')) {
            closeHelp();
        }
    });
}

export function toggleHelp() {
    const helpDrawer = document.getElementById('help-drawer');
    const overlay = document.getElementById('drawer-overlay');

    if (helpDrawer.classList.contains('open')) {
        helpDrawer.classList.remove('open');
        // Only hide overlay if no other drawer is open
        const newsDrawer = document.getElementById('news-drawer');
        const settingsDrawer = document.getElementById('settings-drawer');
        if (!newsDrawer?.classList.contains('open') && !settingsDrawer?.classList.contains('open')) {
            overlay.classList.remove('active');
        }
    } else {
        helpDrawer.classList.add('open');
        overlay.classList.add('active');
        // Close other drawers
        document.getElementById('settings-drawer')?.classList.remove('open');
        document.getElementById('news-drawer')?.classList.remove('open');
    }
}

// Auto-init if loaded as module
initHelp();
