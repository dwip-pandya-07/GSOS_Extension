// ui.js - UI Helper Functions
import { BRAND_LOGOS } from "./config.js";

export function loadRandomLogo() {
    const logoEl = document.getElementById("brand-logo");
    if (logoEl) {
        logoEl.src = BRAND_LOGOS[Math.floor(Math.random() * BRAND_LOGOS.length)];
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