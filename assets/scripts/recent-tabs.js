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

        container.innerHTML = '';

        if (recentTabs.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'recent-tab-empty';
            emptyMsg.textContent = 'No recent sites';
            container.appendChild(emptyMsg);
            return;
        }

        recentTabs.forEach(domain => {
            const latestPage = domain.pages[0];
            const item = document.createElement('div');
            item.className = 'recent-tab-item';
            item.title = latestPage.title;

            const faviconUrl = `/_favicon/?pageUrl=${encodeURIComponent(latestPage.url)}&size=32`;
            const simpleName = getSimpleDomainName(domain.hostname);

            // Structure: main -> favicon-wrapper (img), info (title, domain), actions (toggle?, close)
            const main = document.createElement('div');
            main.className = 'recent-tab-main';

            const favWrapper = document.createElement('div');
            favWrapper.className = 'recent-tab-favicon-wrapper';
            const img = document.createElement('img');
            img.src = domain.favicon || faviconUrl;
            img.className = 'recent-tab-favicon';
            img.onerror = () => {
                if (img.src !== faviconUrl) {
                    img.src = faviconUrl;
                } else {
                    img.src = '/icons/icon16.png';
                }
            };
            favWrapper.appendChild(img);

            const info = document.createElement('div');
            info.className = 'recent-tab-info';
            const titleSpan = document.createElement('span');
            titleSpan.className = 'recent-tab-title';
            titleSpan.textContent = simpleName;
            const domainSpan = document.createElement('span');
            domainSpan.className = 'recent-tab-domain';
            domainSpan.textContent = domain.hostname;
            info.appendChild(titleSpan);
            info.appendChild(domainSpan);

            const actions = document.createElement('div');
            actions.className = 'recent-tab-actions';

            if (domain.pages.length > 1) {
                const historyToggle = document.createElement('button');
                historyToggle.className = 'recent-tab-history-toggle';
                historyToggle.title = 'View page history';
                historyToggle.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                `;
                historyToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const panel = item.querySelector('.recent-tab-history-panel');
                    const isVisible = panel.style.display !== 'none';
                    panel.style.display = isVisible ? 'none' : 'block';
                    historyToggle.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
                });
                actions.appendChild(historyToggle);
            }

            const closeBtn = document.createElement('button');
            closeBtn.className = 'recent-tab-close';
            closeBtn.title = 'Remove site';
            closeBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            `;
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                chrome.storage.local.get(['recentTabs'], (result) => {
                    let recentTabs = result.recentTabs || [];
                    recentTabs = recentTabs.filter(d => d.hostname !== domain.hostname);
                    chrome.storage.local.set({ recentTabs });
                });
            });
            actions.appendChild(closeBtn);

            main.appendChild(favWrapper);
            main.appendChild(info);
            main.appendChild(actions);

            const historyPanel = document.createElement('div');
            historyPanel.className = 'recent-tab-history-panel';
            historyPanel.style.display = 'none';
            const historyList = document.createElement('div');
            historyList.className = 'history-list';

            domain.pages.forEach(page => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.setAttribute('data-url', page.url);
                historyItem.title = page.title;
                const pageTitleSpan = document.createElement('span');
                pageTitleSpan.className = 'history-item-title';
                pageTitleSpan.textContent = page.title;
                historyItem.appendChild(pageTitleSpan);

                historyItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handlePageNavigation(page.url, domain.hostname);
                });
                historyList.appendChild(historyItem);
            });

            historyPanel.appendChild(historyList);
            item.appendChild(main);
            item.appendChild(historyPanel);

            item.addEventListener('click', () => {
                handlePageNavigation(latestPage.url, domain.hostname);
            });

            container.appendChild(item);
        });
    });
}

function handlePageNavigation(url, hostname) {
    chrome.tabs.query({}, (tabs) => {
        // First try to find exact URL match
        const exactMatch = tabs.find(t => t.url === url);
        if (exactMatch) {
            chrome.tabs.update(exactMatch.id, { active: true });
            chrome.windows.update(exactMatch.windowId, { focused: true });
            return;
        }

        // If no exact match, try to find hostname match
        const domainMatch = tabs.find(t => {
            try {
                return new URL(t.url).hostname === hostname;
            } catch {
                return false;
            }
        });

        if (domainMatch) {
            chrome.tabs.update(domainMatch.id, { url: url, active: true });
            chrome.windows.update(domainMatch.windowId, { focused: true });
        } else {
            chrome.tabs.create({ url: url });
        }
    });
}

function getSimpleDomainName(hostname) {
    if (!hostname) return 'Unknown';

    // Remove www.
    let name = hostname.replace(/^www\./, '');

    // Get the first part before the first dot
    name = name.split('.')[0];

    // Capitalize
    return name.charAt(0).toUpperCase() + name.slice(1);
}
