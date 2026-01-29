import State from "./state.js";
import { showNotification } from "./utils.js";
import { saveSettingsToStorage } from "./storage.js";
import { loadWallpaper, downloadWallpaper } from "./wallpaper.js";
import { updateClock } from "./clock.js";
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

    const setCustomLogo = (url) => {
        State.customLogoUrl = url;
        saveSettingsToStorage();

        const brandLogo = document.getElementById("brand-logo");
        if (brandLogo) {
            brandLogo.src = url;
        }

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

            const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                showNotification("Please upload a valid image (PNG, JPG, or SVG)", "warning");
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                showNotification("Image size should be less than 2MB", "warning");
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setCustomLogo(event.target.result);
                showNotification("Custom logo uploaded successfully!", "success");
            };
            reader.readAsDataURL(file);
        };
    }

    if (loadUrlBtn && logoUrlInput) {
        const handleUrlLoad = () => {
            const url = logoUrlInput.value.trim();
            if (!url) return;

            try {
                new URL(url);
            } catch (e) {
                showNotification("Please enter a valid URL", "warning");
                return;
            }

            const originalContent = Array.from(loadUrlBtn.childNodes);
            loadUrlBtn.textContent = "Loading...";
            loadUrlBtn.disabled = true;

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                setCustomLogo(url);
                showNotification("Logo loaded from URL!", "success");
                loadUrlBtn.textContent = "";
                originalContent.forEach(node => loadUrlBtn.appendChild(node));
                loadUrlBtn.disabled = false;
            };
            img.onerror = () => {
                showNotification("Failed to load image. Check URL or CORS.", "error");
                loadUrlBtn.textContent = "";
                originalContent.forEach(node => loadUrlBtn.appendChild(node));
                loadUrlBtn.disabled = false;
            };
            img.src = url;
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
