// recent-tabs.js - Recent Tabs UI Logic

const CLEAR_RECENT_TABS_ON_DASHBOARD_REFRESH = false;

export function initRecentTabs() {
    const container = document.getElementById('recent-tabs-list');
    if (!container) return;

    // Clear history on dashboard refresh if enabled
    if (CLEAR_RECENT_TABS_ON_DASHBOARD_REFRESH) {
        chrome.storage.local.set({ recentTabs: [] });
    }

    renderRecentTabs();

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.recentTabs) {
            renderRecentTabs();
        }
    });
}

export function renderRecentTabs() {
    const container = document.getElementById('recent-tabs-list');
    if (!container) return;

    chrome.storage.local.get(['recentTabs'], (result) => {
        let recentTabs = result.recentTabs || [];

        // Hide transitional pages from UI
        recentTabs = recentTabs.filter(tab => !tab.isTransitional);

        container.innerHTML = '';

        if (recentTabs.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'recent-tab-empty';
            emptyMsg.textContent = 'No recent sites';
            container.appendChild(emptyMsg);
            return;
        }

        recentTabs.forEach(tab => {
            const item = document.createElement('div');
            item.className = 'recent-tab-item';
            item.title = tab.title;

            const faviconUrl =
                tab.favicon ||
                `https://www.google.com/s2/favicons?domain=${tab.hostname}&sz=32`;

            item.innerHTML = `
                <div class="recent-tab-favicon-wrapper">
                    <img
                        src="${faviconUrl}"
                        class="recent-tab-favicon"
                        onerror="this.src='/icons/icon16.png'"
                    />
                </div>
                <div class="recent-tab-info">
                    <span class="recent-tab-title">${tab.title}</span>
                    <span class="recent-tab-domain">${tab.hostname}</span>
                </div>
            `;

            item.addEventListener('click', () => {
                // Navigate in same tab (dashboard tab)
                window.location.href = tab.url;
            });

            container.appendChild(item);
        });
    });
}
