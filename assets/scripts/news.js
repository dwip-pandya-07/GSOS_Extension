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
        console.warn("News drawer elements not found");
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

    rssFeedsSection.innerHTML = `
        <div class="drawer-item-header" style="width: 100%;">
            <div class="drawer-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 11a9 9 0 0 1 9 9"></path>
                    <path d="M4 4a16 16 0 0 1 16 16"></path>
                    <circle cx="5" cy="19" r="1"></circle>
                </svg>
            </div>
            <div class="drawer-item-info">
                <h4>RSS Feeds Configuration</h4>
                <p>Add up to 10 feeds (priority order)</p>
            </div>
        </div>
        <div class="rss-feeds-list" style="margin-top: 16px;">
            ${Array.from({ length: 10 }, (_, i) => `
                <div class="rss-feed-input-wrapper" style="margin-bottom: 8px;">
                    <input 
                        type="url" 
                        id="rss-feed-${i + 1}" 
                        class="rss-feed-input"
                        placeholder="Feed ${i + 1} URL (Priority: ${10 - i})"
                        style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-size: 13px;"
                    />
                </div>
            `).join('')}
        </div>
        <div style="margin-top: 12px; display: flex; gap: 8px;">
            <button id="save-rss-feeds" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; font-size: 13px;">
                Save Feeds
            </button>
            <button id="reset-rss-feeds" style="flex: 1; padding: 10px; background: rgba(244, 67, 54, 0.2); border: 1px solid rgba(244, 67, 54, 0.3); border-radius: 8px; color: white; font-weight: 600; cursor: pointer; font-size: 13px;">
                Reset
            </button>
        </div>
    `;

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
    try {
        const savedFeeds = localStorage.getItem("rss-feeds");
        if (savedFeeds) {
            const feeds = JSON.parse(savedFeeds);
            feeds.forEach((url, index) => {
                const input = document.getElementById(`rss-feed-${index + 1}`);
                if (input && url) {
                    input.value = url;
                }
            });
        } else {
            // Set default feed in first position
            const firstInput = document.getElementById("rss-feed-1");
            if (firstInput) {
                firstInput.value = DEFAULT_RSS_FEED;
            }
        }
    } catch (error) {
        console.error("Error loading saved feeds:", error);
    }
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

    localStorage.setItem("rss-feeds", JSON.stringify(feeds));

    // Clear cache to force reload with new feeds
    newsData = [];
    lastFetchTime = 0;

    alert("RSS Feeds saved successfully! News will reload on next open.");

    // Close the settings drawer
    closeSettingsDrawer();
}

function resetRSSFeeds() {
    if (confirm("Reset all RSS feeds to default?")) {
        localStorage.removeItem("rss-feeds");

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

        // Close the settings drawer
        closeSettingsDrawer();
    }
}

function getConfiguredFeeds() {
    try {
        const savedFeeds = localStorage.getItem("rss-feeds");
        if (savedFeeds) {
            const feeds = JSON.parse(savedFeeds);
            return feeds.filter(url => url && url.trim());
        }
    } catch (error) {
        console.error("Error reading feeds:", error);
    }
    return [DEFAULT_RSS_FEED];
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

    container.innerHTML = '<div style="text-align:center; padding:20px; color:#fff;">Loading news...</div>';

    const feeds = getConfiguredFeeds();

    try {
        // Fetch all feeds in parallel
        const feedPromises = feeds.map(feedUrl =>
            fetch(`${RSS_TO_JSON_BASE}${encodeURIComponent(feedUrl)}`)
                .then(res => res.json())
                .catch(err => {
                    console.error(`Failed to fetch ${feedUrl}:`, err);
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
        console.error("RSS feed fetch error:", error);
        container.innerHTML = `<div style="text-align:center; padding:20px; color:#ff6b6b;">Error loading news. Please check your RSS feeds.</div>`;
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
        container.innerHTML = '<div style="text-align:center; padding:20px; color:#fff;">No news available.</div>';
        return;
    }

    if (displayedCount === 0) {
        container.innerHTML = "";
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

        let iconHtml = '<div class="news-icon">📰</div>';
        if (item.icon) {
            iconHtml = `<div class="news-icon" style="background-image: url('${item.icon}'); background-size: cover; background-position: center;"></div>`;
        }

        // Add feed indicator badge
        const feedBadge = `<span style="font-size: 10px; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; margin-left: 8px;">Feed ${item.feedIndex + 1}</span>`;

        card.innerHTML = `
            ${iconHtml}
            <div class="news-info">
                <h4 class="news-title">${item.title}</h4>
                <p class="news-summary">${item.summary}</p>
                <div style="font-size: 11px; opacity: 0.6; margin-top: 4px;">
                    ${item.source} • ${item.date} ${feedBadge}
                </div>
            </div>
        `;

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
        btn.textContent = `Load More (${newsData.length - displayedCount} remaining)`;
        btn.onclick = () => renderNewsItems();

        btnContainer.appendChild(btn);
        container.appendChild(btnContainer);
    }
}