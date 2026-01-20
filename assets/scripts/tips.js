// tips.js - Security Tips Management
import { CONFIG, SECURITY_TIPS } from "./config.js";

function loadFallbackTip() {
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    const tip = SECURITY_TIPS[dayOfYear % SECURITY_TIPS.length];
    document.getElementById("tip").textContent = `"${tip}"`;
}

export async function loadTip() {
    try {
        const res = await fetch(CONFIG.LARAVEL_TIP_API);

        if (!res.ok) {
            throw new Error("API request failed");
        }

        const data = await res.json();

        if (data && typeof data.tip === 'string') {
            document.getElementById("tip").textContent = `"${data.tip}"`;
        } else {
            loadFallbackTip();
        }
    } catch (error) {
        console.warn("Failed to load tip from API, using fallback:", error);
        loadFallbackTip();
    }
}