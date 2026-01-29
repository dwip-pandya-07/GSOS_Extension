// tips.js - Security Tips Management
import { SECURITY_TIPS } from "./config.js";

export async function loadTip() {
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    const tip = SECURITY_TIPS[dayOfYear % SECURITY_TIPS.length];
    document.getElementById("tip").textContent = `"${tip}"`;
}