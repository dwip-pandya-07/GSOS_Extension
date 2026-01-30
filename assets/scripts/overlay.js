(function () {
    const HOST_ID = 'invinsense-overlay-host';
    const CONTAINER_ID = 'invinsense-recent-tabs-overlay-container';
    const LIST_ID = 'invinsense-recent-tabs-list';
    const BLUR_ID = 'invinsense-blur-overlay';

    let shadowRoot = null;
    let overlayContainer = null;
    let blurOverlay = null;
    let isVisible = false;

    async function createOverlay() {
        if (shadowRoot) return;

        const host = document.createElement('div');
        host.id = HOST_ID;
        document.documentElement.appendChild(host);

        shadowRoot = host.attachShadow({ mode: 'closed' });

        // Add Styles
        const styleLink = document.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = chrome.runtime.getURL('assets/style/overlay.css');
        shadowRoot.appendChild(styleLink);

        blurOverlay = document.createElement('div');
        blurOverlay.id = BLUR_ID;
        blurOverlay.addEventListener('click', () => {
            if (isVisible) toggleOverlay();
        });
        shadowRoot.appendChild(blurOverlay);

        overlayContainer = document.createElement('div');
        overlayContainer.id = CONTAINER_ID;

        const listContainer = document.createElement('div');
        listContainer.id = LIST_ID;
        overlayContainer.appendChild(listContainer);

        shadowRoot.appendChild(overlayContainer);
    }

    async function toggleOverlay() {
        const activeElement = document.activeElement;
        if (activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        )) {
            return;
        }

        if (!shadowRoot) {
            await createOverlay();
        }

        isVisible = !isVisible;

        if (isVisible) {
            await updateRecentTabs();
            blurOverlay.classList.add('active-pointer');
            overlayContainer.classList.add('visible');
            blurOverlay.classList.add('visible');
        } else {
            overlayContainer.classList.remove('visible');
            blurOverlay.classList.remove('visible');
            setTimeout(() => {
                if (!isVisible) blurOverlay.classList.remove('active-pointer');
            }, 400);
        }
    }

    async function updateRecentTabs() {
        if (!shadowRoot) return;
        const list = shadowRoot.getElementById(LIST_ID);
        if (!list) return;

        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }

        if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'invinsense-empty-msg';
            emptyMsg.textContent = 'Extension context invalidated. Please refresh the page.';
            list.appendChild(emptyMsg);
            return;
        }

        try {
            const result = await chrome.storage.local.get(['recentTabs']);
            const recentTabs = result.recentTabs || [];

            recentTabs.forEach(domainData => {
                const page = domainData.pages[0];
                if (!page) return;

                const item = document.createElement('div');
                item.className = 'invinsense-tab-item';
                item.title = page.title;

                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'invinsense-tab-favicon-wrapper';

                const favicon = document.createElement('img');
                favicon.className = 'invinsense-tab-favicon';
                const storedFavicon = domainData.favicon;
                const googleFavicon = `https://www.google.com/s2/favicons?domain=${domainData.hostname}&sz=32`;

                favicon.src = storedFavicon || googleFavicon;
                favicon.alt = '';

                favicon.onerror = () => {
                    if (favicon.src !== googleFavicon) {
                        favicon.src = googleFavicon;
                    } else {
                        favicon.src = chrome.runtime.getURL('/icons/icon16.png');
                    }
                };

                imgWrapper.appendChild(favicon);
                item.appendChild(imgWrapper);

                const info = document.createElement('div');
                info.className = 'invinsense-tab-info';

                const title = document.createElement('span');
                title.className = 'invinsense-tab-title';
                title.textContent = page.title;
                info.appendChild(title);

                const domain = document.createElement('span');
                domain.className = 'invinsense-tab-domain';
                domain.textContent = domainData.hostname;
                info.appendChild(domain);

                item.appendChild(info);

                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                        chrome.runtime.sendMessage({ action: 'openTab', url: page.url });
                    }
                    toggleOverlay();
                });

                list.appendChild(item);
            });

            if (recentTabs.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'invinsense-empty-msg';
                emptyMsg.textContent = 'No recent tabs found.';
                list.appendChild(emptyMsg);
            }
        } catch (e) {
            console.warn('Invinsense: Failed to update recent tabs:', e);
        }
    }

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.code === 'Space') {
            e.preventDefault();
            toggleOverlay();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isVisible) {
            toggleOverlay();
        }
    });

})();
