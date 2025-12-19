const MAX_RECENT_TABS = 10;

// --------------------
// Extension Icon Click
// --------------------
chrome.action.onClicked.addListener(async (tab) => {
    const dashboardUrl = chrome.runtime.getURL("index.html");

    if (tab.url === dashboardUrl) return;

    chrome.tabs.update(tab.id, { url: dashboardUrl });
});

// --------------------
// Helper: Transitional URL Detection
// --------------------
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
// Recent Tabs Tracking (Domain-based)
// --------------------
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status !== 'complete' ||
        !tab.url ||
        !tab.url.startsWith('http')
    ) return;

    const dashboardUrl = chrome.runtime.getURL("index.html");
    if (tab.url === dashboardUrl) return;

    let urlObj;
    try {
        urlObj = new URL(tab.url);
    } catch {
        return;
    }

    const hostname = urlObj.hostname;

    const pageData = {
        url: tab.url,
        title: tab.title || hostname,
        favicon: tab.favIconUrl || '',
        timestamp: Date.now(),
        hostname,
        isTransitional: isTransitionalUrl(tab.url)
    };

    chrome.storage.local.get(['recentTabs'], (result) => {
        let recentTabs = result.recentTabs || [];

        const existingIndex = recentTabs.findIndex(
            item => item.hostname === hostname
        );

        if (existingIndex !== -1) {
            const existing = recentTabs[existingIndex];

            // Replace transitional OR always update for same domain
            recentTabs.splice(existingIndex, 1);
        }

        // Add updated entry to top
        recentTabs.unshift(pageData);

        // Limit size
        if (recentTabs.length > MAX_RECENT_TABS) {
            recentTabs = recentTabs.slice(0, MAX_RECENT_TABS);
        }

        chrome.storage.local.set({ recentTabs });
    });
});
