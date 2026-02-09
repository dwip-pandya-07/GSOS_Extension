import State from "./state.js";
import { showNotification } from "./utils.js";
import { saveSettingsToStorage } from "./storage.js";
import { loadWallpaper, downloadWallpaper } from "./wallpaper.js";
import { updateClock } from "./clock.js";
import { handleError } from "./utils.js";
import { BRAND_LOGOS } from "./config.js";

export function initDrawer() {
    const drawer = document.getElementById("settings-drawer");
    const toggle = document.getElementById("drawer-toggle");
    const close = document.getElementById("drawer-close");
    const overlay = document.getElementById("drawer-overlay");

    if (!drawer || !toggle || !close || !overlay) return;

    toggle.onclick = () => {
        drawer.classList.add("open");
        overlay.classList.add("active");
    };

    close.onclick = overlay.onclick = () => {
        drawer.classList.remove("open");
        overlay.classList.remove("active");
    };

    const staticToggle = document.getElementById("static-wallpaper-toggle");
    if (staticToggle) {
        staticToggle.checked = State.isStaticWallpaper;
        staticToggle.onchange = (e) => {
            if (e.target.checked && State.currentWallpaperUrl) {
                State.isStaticWallpaper = true;
                State.staticWallpaperUrl = State.currentWallpaperUrl;
                showNotification("Wallpaper pinned", "success");
            } else {
                State.isStaticWallpaper = false;
                State.staticWallpaperUrl = null;
                showNotification("Static wallpaper disabled", "info");
                loadWallpaper();
            }
            saveSettingsToStorage();
        };
    }

    const downloadBtn = document.getElementById("download-wallpaper");
    if (downloadBtn) {
        downloadBtn.onclick = downloadWallpaper;
    }

    const timeToggle = document.getElementById("time-format-toggle");
    const timeLabel = document.getElementById("time-format-label");
    if (timeToggle && timeLabel) {
        timeToggle.checked = State.is12HourFormat;
        timeLabel.textContent = State.is12HourFormat
            ? "12-hour format"
            : "24-hour format";
        timeToggle.onchange = (e) => {
            State.is12HourFormat = e.target.checked;
            timeLabel.textContent = State.is12HourFormat
                ? "12-hour format"
                : "24-hour format";
            updateClock();
            saveSettingsToStorage();
        };
    }

    const logoFileInput = document.getElementById("logo-file-input");
    const logoUploadBtn = document.getElementById("logo-upload-btn");
    const logoRemoveBtn = document.getElementById("logo-remove-btn");
    const logoPreview = document.getElementById("logo-preview");
    const logoPreviewImg = document.getElementById("logo-preview-img");
    const logoUrlInput = document.getElementById("logo-url-input");
    const loadUrlBtn = document.getElementById("load-url-btn");

    const MAX_LOGO_SIZE = 2 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

    const setCustomLogo = (url) => {
        State.customLogoUrl = url;
        saveSettingsToStorage();

        import('./ui.js').then(module => {
            module.loadRandomLogo();
        });

        if (logoPreviewImg && logoPreview) {
            logoPreviewImg.src = url;
            logoPreview.style.display = "block";
        }
        if (logoRemoveBtn) {
            logoRemoveBtn.style.display = "inline-flex";
        }

        if (logoFileInput) logoFileInput.value = "";
        if (logoUrlInput) logoUrlInput.value = "";
    };

    if (logoUploadBtn && logoFileInput) {
        logoUploadBtn.onclick = () => {
            logoFileInput.click();
        };

        logoFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!ALLOWED_TYPES.includes(file.type)) {
                showNotification("Invalid file type. Only PNG and JPG are allowed.", "warning");
                return;
            }

            if (file.size > MAX_LOGO_SIZE) {
                showNotification("Image size must be less than 2MB.", "warning");
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setCustomLogo(event.target.result); // Store as Base64
                showNotification("Custom logo uploaded successfully!", "success");
            };
            reader.readAsDataURL(file);
        };
    }

    if (loadUrlBtn && logoUrlInput) {
        const handleUrlLoad = async () => {
            const urlInput = logoUrlInput.value.trim();
            if (!urlInput) return;

            // 1. Strict URL and Protocol Validation
            let url;
            try {
                url = new URL(urlInput);
            } catch (e) {
                handleError(new Error("Please enter a valid logo URL."));
                return;
            }

            if (url.protocol !== 'https:') {
                handleError(new Error("Logo URL must use HTTPS."));
                return;
            }

            if (url.port && url.port !== '443') {
                handleError(new Error("Non-standard ports are not allowed."));
                return;
            }

            if (urlInput.length > 2048) {
                handleError(new Error("URL is too long."));
                return;
            }

            const originalContent = Array.from(loadUrlBtn.childNodes);
            loadUrlBtn.textContent = "Loading...";
            loadUrlBtn.disabled = true;

            try {
                // 2. Fetch and Validate Content
                const response = await fetch(urlInput);

                if (!response.ok) {
                    throw new Error("Unable to download image from the provided URL.");
                }

                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes("svg")) {
                    throw new Error("SVG images are not allowed only PNG and JPG are allowed.");
                }

                if (!contentType || !ALLOWED_TYPES.some(type => contentType.startsWith(type))) {
                    throw new Error("URL does not point to a valid image.");
                }

                // 3. Size Validation
                const blob = await response.blob();
                if (blob.size > MAX_LOGO_SIZE) {
                    throw new Error("Image size must be less than 2MB.");
                }

                // 4. Convert to Base64 for Storage
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCustomLogo(reader.result);
                    showNotification("Logo loaded from URL!", "success");
                    resetBtnState();
                };
                reader.onerror = () => {
                    throw new Error("Unable to download image from the provided URL.");
                };
                reader.readAsDataURL(blob);

            } catch (error) {
                // Map fetch/network errors to "Unable to download"
                const msg = error.message === "Failed to fetch" ? "Unable to download image from the provided URL." : error.message;
                handleError(new Error(msg));
                resetBtnState();
            }

            function resetBtnState() {
                loadUrlBtn.textContent = "";
                originalContent.forEach(node => loadUrlBtn.appendChild(node));
                loadUrlBtn.disabled = false;
            }
        };

        loadUrlBtn.onclick = handleUrlLoad;
        logoUrlInput.onkeydown = (e) => {
            if (e.key === "Enter") handleUrlLoad();
        };
    }

    if (logoRemoveBtn) {
        logoRemoveBtn.onclick = () => {
            State.customLogoUrl = null;
            saveSettingsToStorage();

            const brandLogo = document.getElementById("brand-logo");
            if (brandLogo) {
                brandLogo.src = BRAND_LOGOS[0];
            }

            if (logoPreview) {
                logoPreview.style.display = "none";
            }
            logoRemoveBtn.style.display = "none";

            if (logoFileInput) logoFileInput.value = "";
            if (logoUrlInput) logoUrlInput.value = "";

            showNotification("Custom logo removed", "info");
        };
    }

    if (State.customLogoUrl && logoPreviewImg && logoPreview && logoRemoveBtn) {
        logoPreviewImg.src = State.customLogoUrl;
        logoPreview.style.display = "block";
        logoRemoveBtn.style.display = "inline-flex";
    }
}
