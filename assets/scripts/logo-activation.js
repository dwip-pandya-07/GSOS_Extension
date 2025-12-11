// logo-activation.js - Secret Key Detection for Logo Upload Feature
let keyPressCount = 0;
let lastKeyPressTime = 0;
const TIMEOUT_MS = 2000; // Reset counter after 2 seconds of inactivity
const TARGET_KEY = 'u';
const REQUIRED_PRESSES = 3;

export function initLogoActivation() {
    // Listen for keypress events
    document.addEventListener('keydown', (e) => {
        const currentTime = Date.now();

        // Reset counter if timeout exceeded or different key pressed
        if (currentTime - lastKeyPressTime > TIMEOUT_MS || e.key.toLowerCase() !== TARGET_KEY) {
            keyPressCount = 0;
        }

        // Check if the pressed key is 'U' (case-insensitive)
        if (e.key.toLowerCase() === TARGET_KEY) {
            keyPressCount++;
            lastKeyPressTime = currentTime;
            console.log(`Key 'U' pressed ${keyPressCount} time(s)`);

            // If pressed 3 times, toggle the logo upload section
            if (keyPressCount === REQUIRED_PRESSES) {
                const logoUploadSection = document.getElementById('logo-upload-section');

                if (logoUploadSection) {
                    // Check computed style or inline style
                    const currentDisplay = window.getComputedStyle(logoUploadSection).display;
                    const isHidden = currentDisplay === 'none';

                    logoUploadSection.style.display = isHidden ? 'flex' : 'none';

                    console.log(`🎨 Logo upload feature ${isHidden ? 'activated' : 'deactivated'}!`);
                } else {
                    console.error('Logo upload section not found in DOM');
                }

                // Reset counter
                keyPressCount = 0;
            }
        }
    });

    // Initialize file upload handler
    initFileUpload();

    // Initialize URL input handler
    initUrlInput();
}

function initFileUpload() {
    const fileInput = document.getElementById('logo-file-input');
    const uploadBtn = document.getElementById('logo-upload-btn');
    const removeBtn = document.getElementById('logo-remove-btn');
    const preview = document.getElementById('logo-preview');
    const previewImg = document.getElementById('logo-preview-img');

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImg.src = event.target.result;
                    preview.style.display = 'block';
                    removeBtn.style.display = 'flex';

                    // Update the main logo
                    updateMainLogo(event.target.result);
                    console.log('✅ Logo uploaded from file');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            previewImg.src = '';
            preview.style.display = 'none';
            removeBtn.style.display = 'none';
            fileInput.value = '';
            document.getElementById('logo-url-input').value = '';

            // Reset to default logo
            resetMainLogo();
            console.log('🗑️ Logo removed');
        });
    }
}

function initUrlInput() {
    const urlInput = document.getElementById('logo-url-input');
    const loadUrlBtn = document.getElementById('load-url-btn');
    const preview = document.getElementById('logo-preview');
    const previewImg = document.getElementById('logo-preview-img');
    const removeBtn = document.getElementById('logo-remove-btn');
    const fileInput = document.getElementById('logo-file-input');

    if (loadUrlBtn && urlInput) {
        loadUrlBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (url) {
                loadImageFromUrl(url);
            }
        });

        // Also allow Enter key to load image
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const url = urlInput.value.trim();
                if (url) {
                    loadImageFromUrl(url);
                }
            }
        });
    }

    function loadImageFromUrl(url) {
        console.log('Loading image from URL:', url);

        // Validate URL format
        try {
            new URL(url);
        } catch (e) {
            console.error('Invalid URL format');
            alert('Please enter a valid URL');
            return;
        }

        // Show loading state
        const originalHTML = loadUrlBtn.innerHTML;
        loadUrlBtn.innerHTML = 'Loading...';
        loadUrlBtn.disabled = true;

        const img = new Image();

        img.onload = () => {
            console.log('✅ Image loaded successfully from URL');

            previewImg.src = url;
            preview.style.display = 'block';
            removeBtn.style.display = 'flex';
            fileInput.value = '';

            // Update the main logo
            updateMainLogo(url);

            // Reset button
            loadUrlBtn.innerHTML = originalHTML;
            loadUrlBtn.disabled = false;
        };

        img.onerror = () => {
            console.error('❌ Failed to load image from URL');
            alert('Failed to load image. Please check the URL and try again.\n\nMake sure:\n- The URL is correct\n- The image is publicly accessible\n- CORS is enabled on the server');

            // Reset button
            loadUrlBtn.innerHTML = originalHTML;
            loadUrlBtn.disabled = false;
        };

        img.crossOrigin = 'anonymous';
        img.src = url;
    }
}

function updateMainLogo(src) {
    const mainLogo = document.querySelector('.logo-container .logo');
    if (mainLogo) {
        mainLogo.src = src;
        console.log('Main logo updated');
    }
}

function resetMainLogo() {
    const mainLogo = document.querySelector('.logo-container .logo');
    if (mainLogo) {
        // Reset to original logo (update this path to your default logo)
        mainLogo.src = 'logo.png';
        console.log('Main logo reset to default');
    }
}