import { BRAND_LOGOS } from "./config.js";
import { handleError } from "./utils.js";
import State from "./state.js";

let currentLogoObjectUrl = null;

function dataURItoBlob(dataURI) {
    try {
        if (!dataURI || !dataURI.startsWith('data:image/')) {
            throw new Error("Invalid or unsafe logo data format.");
        }

        const parts = dataURI.split(',');
        if (parts.length < 2) throw new Error("Malformed data URI.");

        const byteString = atob(parts[1]);
        const mimeString = parts[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    } catch (e) {
        handleError(e, true);
        return null;
    }
}

export function loadRandomLogo() {
    const logoEl = document.getElementById("brand-logo");
    if (logoEl) {
        if (State.customLogoUrl) {
            try {
                if (currentLogoObjectUrl) {
                    URL.revokeObjectURL(currentLogoObjectUrl);
                    currentLogoObjectUrl = null;
                }

                const blob = dataURItoBlob(State.customLogoUrl);
                if (blob) {
                    currentLogoObjectUrl = URL.createObjectURL(blob);
                    logoEl.src = currentLogoObjectUrl;
                } else {
                    logoEl.src = BRAND_LOGOS[0];
                }
            } catch (e) {
                handleError(e, true);
                logoEl.src = BRAND_LOGOS[0];
            }
        } else {
            if (currentLogoObjectUrl) {
                URL.revokeObjectURL(currentLogoObjectUrl);
                currentLogoObjectUrl = null;
            }
            logoEl.src = BRAND_LOGOS[Math.floor(Math.random() * BRAND_LOGOS.length)];
        }
    }
}

export function loadGreeting() {
    const greetingEl = document.getElementById("greeting");
    if (!greetingEl) return;

    const hour = new Date().getHours();
    const greet =
        hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    greetingEl.textContent = greet;
}