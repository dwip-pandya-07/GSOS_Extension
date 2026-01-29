const MAX_RECENT_DOMAINS = 10;
const MAX_PAGES_PER_DOMAIN = 15;

// --------------------
// Extension Icon Click
// --------------------
chrome.action.onClicked.addListener(async (tab) => {
    const dashboardUrl = chrome.runtime.getURL("index.html");

    if (tab.url === dashboardUrl) return;

    chrome.tabs.update(tab.id, { url: dashboardUrl });
});

// --------------------
// Helper: Normalization & Transitional
// --------------------
function normalizeUrl(url) {
    try {
        const u = new URL(url);
        // Normalize: protocol + host + pathname (exclude hash/search for grouping pages)
        // Note: keeping search params for now as meaningful unique pages (e.g. search queries)
        // But removing hash/fragment.
        return u.origin + u.pathname + u.search;
    } catch {
        return url;
    }
}

function isTransitionalUrl(url) {
    try {
        const u = new URL(url);

        const transitionalPaths = [
            '/login', '/auth', '/callback', '/signup',
            '/signin', '/logout', '/oauth', '/redirect'
        ];

        const transitionalParams = [
            'code', 'token', 'session', 'redirect',
            'auth', 'access_token', 'id_token', 'state'
        ];

        const hasPath = transitionalPaths.some(p =>
            u.pathname.toLowerCase().includes(p)
        );

        const hasParam = transitionalParams.some(param =>
            u.searchParams.has(param)
        );

        return hasPath || hasParam;
    } catch {
        return false;
    }
}

// --------------------
// Recent Tabs Tracking (Domain-based with Page History)
// --------------------
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status !== 'complete' ||
        !tab.url ||
        !tab.url.startsWith('http')
    ) return;

    const dashboardUrl = chrome.runtime.getURL("index.html");
    if (tab.url === dashboardUrl) return;

    if (isTransitionalUrl(tab.url)) return;

    let urlObj;
    try {
        urlObj = new URL(tab.url);
    } catch {
        return;
    }

    const hostname = urlObj.hostname;
    const normalizedUrl = normalizeUrl(tab.url);

    chrome.storage.local.get(['recentTabs'], (result) => {
        let recentTabs = result.recentTabs || [];

        // Find domain grouping
        const domainIndex = recentTabs.findIndex(
            item => item.hostname === hostname
        );

        const pageData = {
            url: tab.url,
            normalizedUrl: normalizedUrl,
            title: tab.title || hostname,
            timestamp: Date.now()
        };

        if (domainIndex !== -1) {
            const domainEntry = recentTabs[domainIndex];

            // Update domain metadata
            domainEntry.favicon = tab.favIconUrl || domainEntry.favicon || '';
            domainEntry.lastVisited = Date.now();

            // Update page history within domain
            const existingPageIndex = domainEntry.pages.findIndex(
                p => p.normalizedUrl === normalizedUrl
            );

            if (existingPageIndex !== -1) {
                // Update existing page
                domainEntry.pages.splice(existingPageIndex, 1);
            }

            domainEntry.pages.unshift(pageData);

            // Limit pages per domain
            if (domainEntry.pages.length > MAX_PAGES_PER_DOMAIN) {
                domainEntry.pages = domainEntry.pages.slice(0, MAX_PAGES_PER_DOMAIN);
            }

            // Move domain to top (most recent domain)
            recentTabs.splice(domainIndex, 1);
            recentTabs.unshift(domainEntry);
        } else {
            // New domain
            const newDomain = {
                hostname: hostname,
                favicon: tab.favIconUrl || '',
                lastVisited: Date.now(),
                pages: [pageData]
            };
            recentTabs.unshift(newDomain);
        }

        // Limit total domains
        if (recentTabs.length > MAX_RECENT_DOMAINS) {
            recentTabs = recentTabs.slice(0, MAX_RECENT_DOMAINS);
        }

        chrome.storage.local.set({ recentTabs });
    });
});

// --------------------
// Content Script Message Handling
// --------------------
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "openTab" && message.url) {
        // Normalize search URL to check for existing tabs
        const targetUrl = message.url;

        // Query all tabs to see if this URL is already open
        const tabs = await chrome.tabs.query({});
        const existingTab = tabs.find(t => t.url === targetUrl);

        if (existingTab) {
            // Switch to existing tab
            await chrome.tabs.update(existingTab.id, { active: true });
            await chrome.windows.update(existingTab.windowId, { focused: true });
        } else {
            // Use current behavior: update the tab that sent the message
            chrome.tabs.update(sender.tab.id, { url: targetUrl });
        }
    }
});
