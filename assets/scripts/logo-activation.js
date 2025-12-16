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
}
