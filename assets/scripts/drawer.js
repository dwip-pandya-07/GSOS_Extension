// drawer.js - Settings Drawer Management
import State from "./state.js";
import { showNotification } from "./utils.js";
import { saveSettingsToStorage } from "./storage.js";
import { loadWallpaper, downloadWallpaper } from "./wallpaper.js";
import { toggleLikeWallpaper } from "./likes.js";
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

    // Static wallpaper toggle
    const staticToggle = document.getElementById("static-wallpaper-toggle");
    if (staticToggle) {
        staticToggle.checked = State.isStaticWallpaper;
        staticToggle.onchange = (e) => {
            if (e.target.checked && State.currentWallpaperUrl) {
                State.isStaticWallpaper = true;
                State.staticWallpaperUrl = State.currentWallpaperUrl;
                State.staticWallpaperId = State.currentWallpaperId;
                showNotification("Wallpaper pinned", "success");
            } else {
                State.isStaticWallpaper = false;
                State.staticWallpaperUrl = State.staticWallpaperId = null;
                showNotification("Static wallpaper disabled", "info");
                loadWallpaper();
            }
            saveSettingsToStorage();
        };
    }

    // Like button
    const likeBtn = document.getElementById("main-like-button");
    if (likeBtn) {
        likeBtn.onclick = toggleLikeWallpaper;
    }

    // Only liked toggle
    const onlyToggle = document.getElementById("only-liked-toggle");
    if (onlyToggle) {
        onlyToggle.onchange = (e) => {
            if (State.likedWallpapers.length === 0) {
                e.target.checked = false;
                showNotification("Like some wallpapers first!", "warning");
                return;
            }
            State.onlyShowLiked = e.target.checked;
            showNotification(
                State.onlyShowLiked
                    ? "Showing only favorites"
                    : "Showing all wallpapers",
                "success"
            );
            loadWallpaper();
            saveSettingsToStorage();
        };
    }

    // Download button
    const downloadBtn = document.getElementById("download-wallpaper");
    if (downloadBtn) {
        downloadBtn.onclick = downloadWallpaper;
    }

    // Time format toggle
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

    // Logo upload functionality
    const logoFileInput = document.getElementById("logo-file-input");
    const logoUploadBtn = document.getElementById("logo-upload-btn");
    const logoRemoveBtn = document.getElementById("logo-remove-btn");
    const logoPreview = document.getElementById("logo-preview");
    const logoPreviewImg = document.getElementById("logo-preview-img");

    // Show file picker when upload button is clicked
    if (logoUploadBtn && logoFileInput) {
        logoUploadBtn.onclick = () => {
            logoFileInput.click();
        };

        // Handle file selection
        logoFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                showNotification("Please upload a valid image (PNG, JPG, or SVG)", "warning");
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showNotification("Image size should be less than 2MB", "warning");
                return;
            }

            // Convert to base64 and save
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Image = event.target.result;
                State.customLogoUrl = base64Image;
                saveSettingsToStorage();

                // Update logo display
                const brandLogo = document.getElementById("brand-logo");
                if (brandLogo) {
                    brandLogo.src = base64Image;
                }

                // Show preview and remove button
                if (logoPreviewImg && logoPreview) {
                    logoPreviewImg.src = base64Image;
                    logoPreview.style.display = "block";
                }
                if (logoRemoveBtn) {
                    logoRemoveBtn.style.display = "inline-flex";
                }

                showNotification("Custom logo uploaded successfully!", "success");
            };
            reader.readAsDataURL(file);
        };
    }

    // Handle logo removal
    if (logoRemoveBtn) {
        logoRemoveBtn.onclick = () => {
            State.customLogoUrl = null;
            saveSettingsToStorage();

            // Reset to default logo
            const brandLogo = document.getElementById("brand-logo");
            if (brandLogo) {
                brandLogo.src = BRAND_LOGOS[0];
            }

            // Hide preview and remove button
            if (logoPreview) {
                logoPreview.style.display = "none";
            }
            logoRemoveBtn.style.display = "none";

            // Clear file input
            if (logoFileInput) {
                logoFileInput.value = "";
            }

            // Hide the entire logo upload section
            const logoUploadSection = document.getElementById("logo-upload-section");
            if (logoUploadSection) {
                logoUploadSection.style.display = "none";
            }

            showNotification("Custom logo removed", "info");
        };
    }

    // Initialize preview if custom logo exists
    if (State.customLogoUrl && logoPreviewImg && logoPreview && logoRemoveBtn) {
        logoPreviewImg.src = State.customLogoUrl;
        logoPreview.style.display = "block";
        logoRemoveBtn.style.display = "inline-flex";
    }
}