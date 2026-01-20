// news.js - Enhanced News Drawer with Priority RSS Feeds

// Default RSS Feed (fallback)
const DEFAULT_RSS_FEED = "https://feeds.feedburner.com/TheHackersNews";
const RSS_TO_JSON_BASE = "https://api.rss2json.com/v1/api.json?rss_url=";

let newsData = [];
let displayedCount = 0;
const ITEMS_PER_PAGE = 10;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000;

// Priority weights for distribution (feeds 1-10)
// Feed 1 gets most articles, Feed 10 gets least
const PRIORITY_WEIGHTS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

export function initNewsDrawer() {
    const drawer = document.getElementById("news-drawer");
    const toggle = document.getElementById("news-toggle");
    const close = document.getElementById("news-close");
    const overlay = document.getElementById("drawer-overlay");

    if (!drawer || !toggle || !close || !overlay) {
        return;
    }

    toggle.onclick = () => {
        const settingsDrawer = document.getElementById("settings-drawer");
        if (settingsDrawer && settingsDrawer.classList.contains("open")) {
            settingsDrawer.classList.remove("open");
        }

        drawer.classList.add("open");
        toggle.classList.add("moved");
        overlay.classList.add("active");

        const now = Date.now();
        if (newsData.length === 0) {
            loadNews();
        } else if ((now - lastFetchTime) > CACHE_DURATION) {
            loadNews();
        } else {
            renderNewsItems();
        }
    };

    close.onclick = () => {
        drawer.classList.remove("open");
        toggle.classList.remove("moved");
        overlay.classList.remove("active");
    };

    overlay.addEventListener('click', () => {
        drawer.classList.remove("open");
        toggle.classList.remove("moved");
    });

    initRSSFeedsUI();
}

function initRSSFeedsUI() {
    // Create RSS Feeds section in settings drawer
    const settingsDrawer = document.getElementById("settings-drawer");
    if (!settingsDrawer) return;

    const drawerContent = settingsDrawer.querySelector(".drawer-content");
    if (!drawerContent) return;

    // Create RSS Feeds section (hidden by default)
    const rssFeedsSection = document.createElement("div");
    rssFeedsSection.id = "rss-feeds-section";
    rssFeedsSection.className = "drawer-item";
    rssFeedsSection.style.display = "none";
    rssFeedsSection.style.flexDirection = "column";
    rssFeedsSection.style.alignItems = "stretch";

    // Create header
    const header = document.createElement("div");
    header.className = "drawer-item-header";
    header.style.width = "100%";
    header.innerHTML = `
        <div class="drawer-item-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 11a9 9 0 0 1 9 9"></path>
                <path d="M4 4a16 16 0 0 1 16 16"></path>
                <circle cx="5" cy="19" r="1"></circle>
            </svg>
        </div>
    `;
    const headerInfo = document.createElement("div");
    headerInfo.className = "drawer-item-info";
    const headerTitle = document.createElement("h4");
    headerTitle.textContent = "RSS Feeds Configuration";
    const headerDesc = document.createElement("p");
    headerDesc.textContent = "Add up to 10 feeds (priority order)";
    headerInfo.appendChild(headerTitle);
    headerInfo.appendChild(headerDesc);
    header.appendChild(headerInfo);

    // Create inputs list
    const feedsList = document.createElement("div");
    feedsList.className = "rss-feeds-list";
    feedsList.style.marginTop = "16px";

    for (let i = 0; i < 10; i++) {
        const wrapper = document.createElement("div");
        wrapper.className = "rss-feed-input-wrapper";
        wrapper.style.marginBottom = "8px";
        const input = document.createElement("input");
        input.type = "url";
        input.id = `rss-feed-${i + 1}`;
        input.className = "rss-feed-input";
        input.placeholder = `Feed ${i + 1} URL (Priority: ${10 - i})`;
        input.style.width = "100%";
        input.style.padding = "10px";
        input.style.background = "rgba(255,255,255,0.05)";
        input.style.border = "1px solid rgba(255,255,255,0.1)";
        input.style.borderRadius = "8px";
        input.style.color = "white";
        input.style.fontSize = "13px";
        wrapper.appendChild(input);
        feedsList.appendChild(wrapper);
    }

    // Create buttons
    const btnContainer = document.createElement("div");
    btnContainer.style.marginTop = "12px";
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "8px";

    const saveBtn = document.createElement("button");
    saveBtn.id = "save-rss-feeds";
    saveBtn.style.flex = "1";
    saveBtn.style.padding = "10px";
    saveBtn.style.background = "linear-gradient(135deg, #4caf50 0%, #45a049 100%)";
    saveBtn.style.border = "none";
    saveBtn.style.borderRadius = "8px";
    saveBtn.style.color = "white";
    saveBtn.style.fontWeight = "600";
    saveBtn.style.cursor = "pointer";
    saveBtn.style.fontSize = "13px";
    saveBtn.textContent = "Save Feeds";

    const resetBtn = document.createElement("button");
    resetBtn.id = "reset-rss-feeds";
    resetBtn.style.flex = "1";
    resetBtn.style.padding = "10px";
    resetBtn.style.background = "rgba(244, 67, 54, 0.2)";
    resetBtn.style.border = "1px solid rgba(244, 67, 54, 0.3)";
    resetBtn.style.borderRadius = "8px";
    resetBtn.style.color = "white";
    resetBtn.style.fontWeight = "600";
    resetBtn.style.cursor = "pointer";
    resetBtn.style.fontSize = "13px";
    resetBtn.textContent = "Reset";

    btnContainer.appendChild(saveBtn);
    btnContainer.appendChild(resetBtn);

    rssFeedsSection.appendChild(header);
    rssFeedsSection.appendChild(feedsList);
    rssFeedsSection.appendChild(btnContainer);

    // Insert before the last item (or at the end)
    drawerContent.appendChild(rssFeedsSection);

    // Load saved feeds
    loadSavedFeeds();

    // Setup event listeners
    document.getElementById("save-rss-feeds")?.addEventListener("click", saveRSSFeeds);
    document.getElementById("reset-rss-feeds")?.addEventListener("click", resetRSSFeeds);

    // Setup 'R' key listener for revealing the section
    setupRSSFeedsReveal();
}

let rKeyPressCount = 0;
let rKeyTimeout = null;

function setupRSSFeedsReveal() {
    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "r") {
            rKeyPressCount++;

            clearTimeout(rKeyTimeout);
            rKeyTimeout = setTimeout(() => {
                rKeyPressCount = 0;
            }, 1000);

            if (rKeyPressCount === 3) {
                const rssFeedsSection = document.getElementById("rss-feeds-section");
                if (rssFeedsSection) {
                    rssFeedsSection.style.display = "flex";
                }
                rKeyPressCount = 0;
            }
        }
    });
}

function loadSavedFeeds() {
    const legacySaved = localStorage.getItem("rss-feeds");

    chrome.storage.local.get(['rss_feeds'], (result) => {
        let feeds = [];
        if (result.rss_feeds) {
            feeds = result.rss_feeds;
        } else if (legacySaved) {
            try {
                feeds = JSON.parse(legacySaved);
                chrome.storage.local.set({ rss_feeds: feeds });
                localStorage.removeItem("rss-feeds");
            } catch (e) {
                console.error("Migration error", e);
            }
        }

        if (feeds.length > 0) {
            feeds.forEach((url, index) => {
                const input = document.getElementById(`rss-feed-${index + 1}`);
                if (input && url) {
                    input.value = url;
                }
            });
        } else {
            const firstInput = document.getElementById("rss-feed-1");
            if (firstInput) {
                firstInput.value = DEFAULT_RSS_FEED;
            }
        }
    });
}

function saveRSSFeeds() {
    const feeds = [];
    for (let i = 1; i <= 10; i++) {
        const input = document.getElementById(`rss-feed-${i}`);
        if (input && input.value.trim()) {
            feeds.push(input.value.trim());
        } else {
            feeds.push("");
        }
    }

    chrome.storage.local.set({ rss_feeds: feeds }, () => {
        // Clear cache to force reload with new feeds
        newsData = [];
        lastFetchTime = 0;
        alert("RSS Feeds saved successfully! News will reload on next open.");
        closeSettingsDrawer();
    });
}

function resetRSSFeeds() {
    if (confirm("Reset all RSS feeds to default?")) {
        chrome.storage.local.remove("rss_feeds", () => {
            // Reset inputs
            for (let i = 1; i <= 10; i++) {
                const input = document.getElementById(`rss-feed-${i}`);
                if (input) {
                    input.value = i === 1 ? DEFAULT_RSS_FEED : "";
                }
            }

            // Clear cache
            newsData = [];
            lastFetchTime = 0;
            closeSettingsDrawer();
        });
    }
}

async function getConfiguredFeeds() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['rss_feeds'], (result) => {
            if (result.rss_feeds) {
                resolve(result.rss_feeds.filter(url => url && url.trim()));
            } else {
                // Check legacy as fallback for immediate use before loadSavedFeeds runs
                const legacySaved = localStorage.getItem("rss-feeds");
                if (legacySaved) {
                    try {
                        const feeds = JSON.parse(legacySaved);
                        resolve(feeds.filter(url => url && url.trim()));
                        return;
                    } catch (e) { }
                }
                resolve([DEFAULT_RSS_FEED]);
            }
        });
    });
}

function closeSettingsDrawer() {
    const settingsDrawer = document.getElementById("settings-drawer");
    const drawerToggle = document.getElementById("drawer-toggle");
    const overlay = document.getElementById("drawer-overlay");

    if (settingsDrawer) {
        settingsDrawer.classList.remove("open");
    }
    if (overlay) {
        overlay.classList.remove("active");
    }
}

async function loadNews() {
    const container = document.getElementById("news-content");
    if (!container) return;

    container.textContent = "";
    const loadingDiv = document.createElement("div");
    loadingDiv.style.textAlign = "center";
    loadingDiv.style.padding = "20px";
    loadingDiv.style.color = "#fff";
    loadingDiv.textContent = "Loading news...";
    container.appendChild(loadingDiv);

    const feeds = await getConfiguredFeeds();

    try {
        // Fetch all feeds in parallel
        const feedPromises = feeds.map(feedUrl =>
            fetch(`${RSS_TO_JSON_BASE}${encodeURIComponent(feedUrl)}`)
                .then(res => res.json())
                .catch(err => {
                    console.error(`${feedUrl}:`, err);
                    return null;
                })
        );

        const feedResults = await Promise.all(feedPromises);

        // Process and weight articles by feed priority
        const allArticles = [];

        feedResults.forEach((data, feedIndex) => {
            if (data && data.status === "ok" && data.items) {
                const weight = PRIORITY_WEIGHTS[feedIndex] || 1;
                const items = data.items.slice(0, 10); // Max 10 items per feed

                items.forEach((item, itemIndex) => {
                    const article = processArticle(item, feedIndex, data.feed);
                    article.priority = weight;
                    article.feedIndex = feedIndex;
                    allArticles.push(article);
                });
            }
        });

        if (allArticles.length === 0) {
            throw new Error("No articles loaded from any feed");
        }

        // Sort by priority (higher weight = higher priority) and date
        newsData = allArticles.sort((a, b) => {
            if (b.priority !== a.priority) {
                return b.priority - a.priority;
            }
            return new Date(b.rawDate) - new Date(a.rawDate);
        });

        // Apply weighted distribution to ensure variety
        newsData = distributeByPriority(newsData);

        lastFetchTime = Date.now();
        displayedCount = 0;
        renderNewsItems();

    } catch (error) {
        console.error(error);
        container.textContent = "";
        const errorDiv = document.createElement("div");
        errorDiv.style.textAlign = "center";
        errorDiv.style.padding = "20px";
        errorDiv.style.color = "#ff6b6b";
        errorDiv.textContent = "Yet to Configure the RSS Feeds ";
        container.appendChild(errorDiv);
    }
}

function processArticle(item, feedIndex, feedInfo) {
    let date = 'Recent';
    let rawDate = new Date();

    if (item.pubDate) {
        try {
            rawDate = new Date(item.pubDate);
            date = rawDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            date = item.pubDate.split(' ')[0];
        }
    }

    let icon = null;
    if (item.thumbnail) {
        icon = item.thumbnail;
    } else if (item.enclosure && item.enclosure.link) {
        icon = item.enclosure.link;
    }

    let summary = item.description || item.content || "No description available.";
    summary = summary.replace(/<[^>]*>/g, '').trim();
    if (summary.length > 150) {
        summary = summary.substring(0, 150) + '...';
    }

    return {
        id: item.guid || `news-${feedIndex}-${Date.now()}`,
        title: item.title,
        summary: summary,
        date: date,
        rawDate: rawDate,
        source: feedInfo?.title || `Feed ${feedIndex + 1}`,
        icon: icon,
        link: item.link,
        priority: 0,
        feedIndex: feedIndex
    };
}

function distributeByPriority(articles) {
    // Group articles by feed
    const feedGroups = {};
    articles.forEach(article => {
        if (!feedGroups[article.feedIndex]) {
            feedGroups[article.feedIndex] = [];
        }
        feedGroups[article.feedIndex].push(article);
    });

    // Interleave articles based on priority
    const distributed = [];
    const maxRounds = Math.max(...Object.values(feedGroups).map(g => g.length));

    for (let round = 0; round < maxRounds; round++) {
        // Sort feed indices by priority (highest first)
        const sortedFeeds = Object.keys(feedGroups).sort((a, b) => {
            const priorityA = PRIORITY_WEIGHTS[parseInt(a)] || 0;
            const priorityB = PRIORITY_WEIGHTS[parseInt(b)] || 0;
            return priorityB - priorityA;
        });

        sortedFeeds.forEach(feedIndex => {
            const group = feedGroups[feedIndex];
            if (group && group.length > round) {
                distributed.push(group[round]);
            }
        });
    }

    return distributed;
}

function renderNewsItems() {
    const container = document.getElementById("news-content");
    if (!container) return;

    if (newsData.length === 0) {
        container.textContent = "";
        const emptyDiv = document.createElement("div");
        emptyDiv.style.textAlign = "center";
        emptyDiv.style.padding = "20px";
        emptyDiv.style.color = "#fff";
        emptyDiv.textContent = "No news available.";
        container.appendChild(emptyDiv);
        return;
    }

    if (displayedCount === 0) {
        container.textContent = "";
    }

    const startIndex = displayedCount;
    const endIndex = Math.min(displayedCount + ITEMS_PER_PAGE, newsData.length);
    const itemsToShow = newsData.slice(startIndex, endIndex);

    itemsToShow.forEach(item => {
        const card = document.createElement("a");
        card.className = "news-card drawer-item";
        card.href = item.link;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.style.textDecoration = "none";
        card.style.display = "flex";

        const iconDiv = document.createElement("div");
        iconDiv.className = "news-icon";
        if (item.icon) {
            iconDiv.style.backgroundImage = `url('${item.icon}')`;
            iconDiv.style.backgroundSize = "cover";
            iconDiv.style.backgroundPosition = "center";
        } else {
            iconDiv.textContent = "📰";
        }

        const infoDiv = document.createElement("div");
        infoDiv.className = "news-info";

        const titleH4 = document.createElement("h4");
        titleH4.className = "news-title";
        titleH4.textContent = item.title;

        const summaryP = document.createElement("p");
        summaryP.className = "news-summary";
        summaryP.textContent = item.summary;

        const dateDiv = document.createElement("div");
        dateDiv.className = "news-date";
        dateDiv.textContent = item.date;

        infoDiv.appendChild(titleH4);
        infoDiv.appendChild(summaryP);
        infoDiv.appendChild(dateDiv);

        card.appendChild(iconDiv);
        card.appendChild(infoDiv);

        container.appendChild(card);
    });

    displayedCount = endIndex;

    // Remove existing Load More button
    const existingBtnContainer = document.getElementById("load-more-container");
    if (existingBtnContainer) {
        existingBtnContainer.remove();
    }

    // Add Load More button if there are more items
    if (displayedCount < newsData.length) {
        const btnContainer = document.createElement("div");
        btnContainer.id = "load-more-container";
        btnContainer.style.textAlign = "center";
        btnContainer.style.padding = "20px";

        const btn = document.createElement("button");
        btn.id = "load-more-news-btn";
        btn.className = "load-more-btn";
        btn.textContent = `Load More`;
        btn.onclick = () => renderNewsItems();

        btnContainer.appendChild(btn);
        container.appendChild(btnContainer);
    }
}