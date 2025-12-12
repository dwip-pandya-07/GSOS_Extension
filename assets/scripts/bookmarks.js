// bookmarks.js - Bookmarks Management

const MOCK_BOOKMARKS = [
    { title: "Google", url: "https://google.com" },
];

// Custom icon mapping for specific URLs
const CUSTOM_ICONS = {
    "https://invinsense-launcher.netlify.app/dashboard": "assets/images/invinsense.svg",
    "https://invinsense-launcher.netlify.app/xdr": "assets/images/icn-xdr.svg",
    "https://invinsense-launcher.netlify.app/xdr-plus": "assets/images/icn-dxr-plus.svg",
    "https://invinsense-launcher.netlify.app/oxdr": "assets/images/icn-oxdr.svg",
    "https://invinsense-launcher.netlify.app/gsos": "assets/images/icn-gsos.svg",
    "https://invinsense-launcher.netlify.app/pulse": "assets/images/icn-pulse.svg"
};

let allBookmarks = [];
let selectedBookmarks = [];

export function initBookmarks() {
    const modal = document.getElementById("bookmarks-modal");
    const closeBtn = document.getElementById("bookmarks-modal-close");
    const saveBtn = document.getElementById("save-bookmarks-btn");
    const selectAllBtn = document.getElementById("select-all-btn");
    const deselectAllBtn = document.getElementById("deselect-all-btn");

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.remove("active");
        };
    }

    if (saveBtn) {
        saveBtn.onclick = () => {
            saveSelection();
            modal.classList.remove("active");
        };
    }

    if (selectAllBtn) {
        selectAllBtn.onclick = () => selectAll(true);
    }

    if (deselectAllBtn) {
        deselectAllBtn.onclick = () => selectAll(false);
    }

    // Top-right toggle button action
    const toggleBtn = document.getElementById("bookmarks-toggle");
    const dock = document.getElementById("bookmarks-dock");

    if (toggleBtn && dock) {
        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            // Toggle dock visibility only when clicking the bookmark icon
            dock.classList.toggle("active");
        };
    }

    // Load saved bookmarks on init
    loadSavedBookmarks();
}



async function loadBookmarksForModal() {
    const listContainer = document.getElementById("bookmarks-list");
    if (!listContainer) return;

    listContainer.innerHTML = '<div class="loading-text">Loading bookmarks...</div>';

    // Fetch bookmarks
    if (chrome && chrome.bookmarks && chrome.bookmarks.getTree) {
        try {
            const tree = await chrome.bookmarks.getTree();
            allBookmarks = parseBookmarks(tree);
        } catch (e) {
            console.warn("Error fetching bookmarks", e);
            allBookmarks = MOCK_BOOKMARKS;
        }
    } else {
        allBookmarks = MOCK_BOOKMARKS;
    }

    renderModalList(listContainer);
}

function parseBookmarks(nodes) {
    let results = [];
    nodes.forEach(node => {
        if (node.url) {
            results.push({ title: node.title, url: node.url });
        }
        if (node.children) {
            results = results.concat(parseBookmarks(node.children));
        }
    });
    return results;
}

function renderModalList(container) {
    container.innerHTML = "";

    if (allBookmarks.length === 0) {
        container.innerHTML = '<div class="empty-text">No bookmarks found.</div>';
        return;
    }

    // Load checked state
    const savedUrls = new Set(selectedBookmarks.map(b => b.url));

    allBookmarks.forEach(b => {
        const item = document.createElement("div");
        item.className = "bookmark-item-select";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = savedUrls.has(b.url);
        checkbox.value = b.url;

        const info = document.createElement("div");
        info.className = "bookmark-info";

        const title = document.createElement("span");
        title.className = "bookmark-title";
        title.textContent = b.title || b.url;

        const url = document.createElement("span");
        url.className = "bookmark-url";
        url.textContent = b.url;

        info.appendChild(title);
        info.appendChild(url);

        item.appendChild(checkbox);
        item.appendChild(info);

        // Click on row toggles checkbox
        item.onclick = (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
        };

        container.appendChild(item);
    });
}

function selectAll(shouldSelect) {
    const listContainer = document.getElementById("bookmarks-list");
    if (!listContainer) return;

    const checkboxes = listContainer.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(cb => cb.checked = shouldSelect);
}

function saveSelection() {
    const listContainer = document.getElementById("bookmarks-list");
    if (!listContainer) return;

    const checkboxes = listContainer.querySelectorAll("input[type='checkbox']:checked");
    const newSelection = [];

    checkboxes.forEach(cb => {
        const url = cb.value;
        const bm = allBookmarks.find(b => b.url === url);
        if (bm) newSelection.push(bm);
    });

    selectedBookmarks = newSelection;
    localStorage.setItem("gsos_bookmarks", JSON.stringify(selectedBookmarks));
    renderDock();
}

function loadSavedBookmarks() {
    const saved = localStorage.getItem("gsos_bookmarks");
    if (saved) {
        try {
            selectedBookmarks = JSON.parse(saved);
        } catch (e) {
            selectedBookmarks = [];
        }
    }
    renderDock();
}

function renderDock() {
    const dock = document.getElementById("bookmarks-dock");
    const modal = document.getElementById("bookmarks-modal");
    if (!dock) return;

    dock.innerHTML = "";

    // Always show dock now since it contains the Add button
    dock.style.display = "flex";

    // Method to toggle modal
    const openModal = () => {
        if (modal) {
            modal.classList.add("active");
            loadBookmarksForModal();
        }
    };

    selectedBookmarks.forEach(bm => {
        const a = document.createElement("a");
        a.href = bm.url;
        a.target = "_blank";
        a.className = "dock-item";
        a.title = bm.title;

        const img = document.createElement("img");
        img.alt = bm.title;

        // Check if URL has a custom icon mapping
        if (CUSTOM_ICONS[bm.url]) {
            img.src = CUSTOM_ICONS[bm.url];
            // Fallback to Google favicon if custom icon fails to load
            img.onerror = () => {
                const iconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(bm.url)}`;
                img.src = iconUrl;
                img.onerror = () => {
                    img.src = "assets/images/default-bookmark.png";
                };
            };
        } else {
            // Use Google Favicon service for URLs without custom icons
            const iconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(bm.url)}`;
            img.src = iconUrl;
            img.onerror = () => {
                img.src = "assets/images/default-bookmark.png";
            };
        }

        a.appendChild(img);
        dock.appendChild(a);
    });

    // Add "Manage/Add" button at the end
    const addBtn = document.createElement("div");
    addBtn.className = "dock-item dock-add-btn";
    addBtn.innerHTML = "<span>+</span>";
    addBtn.title = "Manage Bookmarks";
    addBtn.onclick = openModal;

    dock.appendChild(addBtn);
}
