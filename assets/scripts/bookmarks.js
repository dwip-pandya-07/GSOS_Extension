// bookmarks.js - Bookmarks Management

const MOCK_BOOKMARKS = [
    { title: "Google", url: "https://google.com" },
    { title: "YouTube", url: "https://youtube.com" },
    { title: "GitHub", url: "https://github.com" },
    { title: "Stack Overflow", url: "https://stackoverflow.com" },
    { title: "Gmail", url: "https://mail.google.com" },
    { title: "LinkedIn", url: "https://linkedin.com" },
    { title: "Reddit", url: "https://reddit.com" },
    { title: "Twitter", url: "https://twitter.com" }
];

let allBookmarks = [];
let selectedBookmarks = [];
// Context menu state
let contextMenu = null;

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
            e.stopPropagation(); // Prevent closing immediately
            dock.classList.toggle("active");
        };
    }

    // Close dock when clicking outside
    document.addEventListener("click", (e) => {
        if (dock && dock.classList.contains("active")) {
            if (!dock.contains(e.target) && e.target !== toggleBtn) {
                dock.classList.remove("active");
            }
        }
        hideContextMenu();
    });

    // Initialize custom context menu
    createContextMenu();

    // Close context menu on click elsewhere
    document.addEventListener("click", () => hideContextMenu());

    // Load saved bookmarks on init
    loadSavedBookmarks();
}

function createContextMenu() {
    // Remove existing if any
    const existing = document.getElementById("bookmark-context-menu");
    if (existing) existing.remove();

    contextMenu = document.createElement("div");
    contextMenu.id = "bookmark-context-menu";
    contextMenu.className = "context-menu";
    contextMenu.innerHTML = `
        <div class="context-menu-item" id="ctx-remove">
            <span>🗑️</span> Remove
        </div>
    `;
    document.body.appendChild(contextMenu);
}

function showContextMenu(x, y, url) {
    if (!contextMenu) return;

    // Position
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.classList.add("active");

    // Handle action
    const removeBtn = contextMenu.querySelector("#ctx-remove");
    removeBtn.onclick = (e) => {
        e.stopPropagation(); // Prevent document click from immediately hiding
        removeBookmark(url);
        hideContextMenu();
    };
}

function hideContextMenu() {
    if (contextMenu) {
        contextMenu.classList.remove("active");
    }
}

function removeBookmark(url) {
    selectedBookmarks = selectedBookmarks.filter(b => b.url !== url);
    localStorage.setItem("gsos_bookmarks", JSON.stringify(selectedBookmarks));
    renderDock();
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

        // Context menu listener
        a.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            showContextMenu(e.pageX, e.pageY, bm.url);
        });

        // Use Google Favicon service for consistent icons
        const iconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(bm.url)}`;

        const img = document.createElement("img");
        img.src = iconUrl;
        img.alt = bm.title;
        img.onerror = () => { img.src = "assets/images/default-bookmark.png"; };

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
