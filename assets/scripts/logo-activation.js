let keyPressCount = 0;
let lastKeyPressTime = 0;
const TIMEOUT_MS = 2000;
const TARGET_KEY = 'u';
const REQUIRED_PRESSES = 3;

export function initLogoActivation() {
    document.addEventListener('keydown', (e) => {
        const currentTime = Date.now();

        if (currentTime - lastKeyPressTime > TIMEOUT_MS || e.key.toLowerCase() !== TARGET_KEY) {
            keyPressCount = 0;
        }

        if (e.key.toLowerCase() === TARGET_KEY) {
            keyPressCount++;
            lastKeyPressTime = currentTime;
            if (keyPressCount === REQUIRED_PRESSES) {
                const logoUploadSection = document.getElementById('logo-upload-section');

                if (logoUploadSection) {
                    const currentDisplay = window.getComputedStyle(logoUploadSection).display;
                    const isHidden = currentDisplay === 'none';

                    logoUploadSection.style.display = isHidden ? 'flex' : 'none';
                }

                keyPressCount = 0;
            }
        }
    });
}
