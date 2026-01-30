const MOCK_BOOKMARKS = [
    { title: "Google", url: "https://google.com" },
];

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

    const toggleBtn = document.getElementById("bookmarks-toggle");
    const dock = document.getElementById("bookmarks-dock");

    if (toggleBtn && dock) {
        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            dock.classList.toggle("active");
        };
    }

    loadSavedBookmarks();
}



async function loadBookmarksForModal() {
    const listContainer = document.getElementById("bookmarks-list");
    if (!listContainer) return;

    listContainer.textContent = "";
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "loading-text";
    loadingDiv.textContent = "Loading bookmarks...";
    listContainer.appendChild(loadingDiv);

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
    container.textContent = "";

    if (allBookmarks.length === 0) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "empty-text";
        emptyDiv.textContent = "No bookmarks found.";
        container.appendChild(emptyDiv);
        return;
    }

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
    chrome.storage.local.set({ gsos_bookmarks: selectedBookmarks }, () => {
        renderDock();
    });
}

function loadSavedBookmarks() {
    const legacySaved = localStorage.getItem("gsos_bookmarks");

    chrome.storage.local.get(['gsos_bookmarks'], (result) => {
        if (result.gsos_bookmarks) {
            selectedBookmarks = result.gsos_bookmarks;
            renderDock();
        } else if (legacySaved) {
            try {
                selectedBookmarks = JSON.parse(legacySaved);
                chrome.storage.local.set({ gsos_bookmarks: selectedBookmarks });
                localStorage.removeItem("gsos_bookmarks");
                renderDock();
            } catch (e) {
                selectedBookmarks = [];
                renderDock();
            }
        } else {
            selectedBookmarks = [];
            renderDock();
        }
    });
}

function renderDock() {
    const dock = document.getElementById("bookmarks-dock");
    const modal = document.getElementById("bookmarks-modal");
    if (!dock) return;

    dock.innerHTML = "";

    dock.style.display = "flex";

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

        const nativeFavicon = `/_favicon/?pageUrl=${encodeURIComponent(bm.url)}&size=64`;
        img.src = nativeFavicon;
        img.onerror = () => {
            img.src = "assets/images/default-bookmark.png";
        };

        a.appendChild(img);
        dock.appendChild(a);
    });

    const addBtn = document.createElement("div");
    addBtn.className = "dock-item dock-add-btn";
    const span = document.createElement("span");
    span.textContent = "+";
    addBtn.appendChild(span);
    addBtn.title = "Manage Bookmarks";
    addBtn.onclick = openModal;

    dock.appendChild(addBtn);
}
