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
                <button class="recent-tab-close" title="Remove from recent tabs">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;

            const closeBtn = item.querySelector('.recent-tab-close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                chrome.storage.local.get(['recentTabs'], (result) => {
                    let recentTabs = result.recentTabs || [];
                    recentTabs = recentTabs.filter(t => t.hostname !== tab.hostname);
                    chrome.storage.local.set({ recentTabs });
                });
            });

            item.addEventListener('click', () => {
                // Enhancement: Check if tab/site is already open
                chrome.tabs.query({}, (tabs) => {
                    const existingTab = tabs.find(t => {
                        try {
                            const tabUrl = new URL(t.url);
                            return tabUrl.hostname === tab.hostname;
                        } catch {
                            return false;
                        }
                    });

                    if (existingTab) {
                        // Redirect user to that tab
                        chrome.tabs.update(existingTab.id, { active: true });
                        chrome.windows.update(existingTab.windowId, { focused: true });
                    } else {
                        // Open in new tab
                        chrome.tabs.create({ url: tab.url });
                    }
                });
            });

            container.appendChild(item);
        });
    });
}
