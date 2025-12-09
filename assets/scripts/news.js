// news.js - News Drawer Management

const API_KEY = "pub_9eba8c0188e5406292ff74e0edac2a8c";
// Base URL without pagination
const API_BASE_URL = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&category=technology,business,world&&qInTitle=cybersecurity
`;

let newsData = [];
let nextPageToken = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

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

        // Initial load only if empty
        if (newsData.length === 0) {
            loadNews(); // initial fetch
        } else {
            renderNewsItems(newsData);
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

async function loadNews(pageToken = null) {
    const container = document.getElementById("news-content");
    if (!container) return;

    // Determine URL
    let url = API_BASE_URL;
    if (pageToken) {
        url += `&page=${pageToken}`;
    }

    // Prepare container or button state
    // If initial load and empty container, show big loader
    // If loading more, show spinner on button

    let loadMoreBtn = document.getElementById("load-more-btn");

    if (!pageToken) {
        // Initial load UI
        if (newsData.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:#fff;">Loading news...</div>';
        }
    } else {
        // Load more UI
        if (loadMoreBtn) {
            loadMoreBtn.textContent = "Loading...";
            loadMoreBtn.disabled = true;
        }
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "success" && data.results) {
            // Transform new items
            const newItems = data.results.map(item => ({
                id: item.article_id,
                title: item.title,
                summary: item.description ? item.description : (item.content ? item.content.slice(0, 100) + "..." : "No description available."),
                date: item.pubDate ? item.pubDate.split(' ')[0] : 'Recent',
                source: item.source_id,
                icon: item.image_url ? item.image_url : null,
                link: item.link
            }));

            // Filter duplicates if any (simple check by ID)
            const existingIds = new Set(newsData.map(n => n.id));
            const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));

            if (!pageToken) {
                // Initial load: replace data
                newsData = uniqueNewItems;
            } else {
                // Append data
                newsData = [...newsData, ...uniqueNewItems];
            }

            // Update next page token
            nextPageToken = data.nextPage || null;
            lastFetchTime = Date.now();

            // Re-render all list (simplest approach for now) or append.
            // Re-rendering entire list ensures order and correct button placement.
            renderNewsItems(newsData);

        } else {
            throw new Error("Failed to load news");
        }
    } catch (error) {
        console.error("News fetch error:", error);
        if (!pageToken && newsData.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:20px; color:#ff6b6b;">Error loading news. Please try again later.</div>`;
        } else if (loadMoreBtn) {
            loadMoreBtn.textContent = "Error. Try again.";
            loadMoreBtn.disabled = false;
        }
    }
}

function renderNewsItems(items) {
    const container = document.getElementById("news-content");
    if (!container) return;

    container.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("a");
        card.className = "news-card drawer-item";
        card.href = item.link;
        card.target = "_blank";
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

    // Append "Load More" button if there is a next page
    if (nextPageToken) {
        const btnContainer = document.createElement("div");
        btnContainer.style.textAlign = "center";
        btnContainer.style.padding = "20px";

        const btn = document.createElement("button");
        btn.id = "load-more-btn";
        btn.className = "load-more-btn";
        btn.textContent = "Load More";
        btn.onclick = () => loadNews(nextPageToken);

        btnContainer.appendChild(btn);
        container.appendChild(btnContainer);
    }
}
