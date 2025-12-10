// news.js - News Drawer Management (RSS Feed)

// The Hacker News RSS Feed
const RSS_FEED_URL = "https://feeds.feedburner.com/TheHackersNews";
// RSS to JSON conversion service (handles CORS)
// Free tier returns 10 items max, so we show 5 at a time to enable pagination
const RSS_TO_JSON_API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEED_URL)}`;

let newsData = [];
let displayedCount = 0;
const ITEMS_PER_PAGE = 5;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000;

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
            console.log('📰 Cache expired, reloading news...');
            loadNews();
        } else {
            console.log('📰 Showing cached news');
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
}

async function loadNews() {
    const container = document.getElementById("news-content");
    if (!container) return;

    container.innerHTML = '<div style="text-align:center; padding:20px; color:#fff;">Loading news from The Hacker News...</div>';

    try {
        const response = await fetch(RSS_TO_JSON_API);
        const data = await response.json();

        if (data.status === "ok" && data.items && data.items.length > 0) {
            newsData = data.items.map((item, index) => {
                let date = 'Recent';
                if (item.pubDate) {
                    try {
                        const pubDate = new Date(item.pubDate);
                        date = pubDate.toLocaleDateString('en-US', {
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
                    id: item.guid || `news-${index}`,
                    title: item.title,
                    summary: summary,
                    date: date,
                    source: data.feed?.title || "The Hacker News",
                    icon: icon,
                    link: item.link
                };
            });

            lastFetchTime = Date.now();
            displayedCount = 0;
            renderNewsItems();

        } else {
            throw new Error("Failed to load RSS feed");
        }
    } catch (error) {
        console.error("RSS feed fetch error:", error);
        container.innerHTML = `<div style="text-align:center; padding:20px; color:#ff6b6b;">Error loading news. Please try again later.</div>`;
    }
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

    // Render the new items
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

        card.innerHTML = `
            ${iconHtml}
            <div class="news-info">
                <h4 class="news-title">${item.title}</h4>
                <div class="news-meta">
                    <span class="news-source">${item.source}</span>
                    <span class="news-date">${item.date}</span>
                </div>
                <p class="news-summary">${item.summary}</p>
            </div>
        `;

        container.appendChild(card);
    });

    displayedCount = endIndex;

    // Remove existing Load More button container if any
    const existingBtnContainer = document.getElementById("load-more-container");
    if (existingBtnContainer) {
        existingBtnContainer.remove();
        console.log('🗑️ Removed existing Load More button');
    }

    // Add Load More button if there are more items to show
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

        console.log('✅ Load More button created with', newsData.length - displayedCount, 'remaining items');
    } else {
        console.log('ℹ️ All items displayed, no Load More button needed');
    }
}
