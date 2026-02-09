import { DEV_MODE } from "./config.js";

export function showNotification(message, type = "info") {
    document.querySelectorAll(".notification").forEach((n) => n.remove());
    const n = document.createElement("div");
    n.className = `notification notification-${type}`;
    n.textContent = message;
    n.style.cssText = `
    position:fixed;top:20px;right:20px;z-index:10000;
    padding:16px 24px;border-radius:12px;color:white;
    font-weight:500;box-shadow:0 4px 16px rgba(0,0,0,0.3);
    background:rgba(50,50,50,0.95);animation:slideIn 0.4s ease-out;
  `;
    if (type === "success") n.style.background = "rgba(76, 175, 80, 0.95)";
    if (type === "error") n.style.background = "rgba(244, 67, 54, 0.95)";
    if (type === "warning") n.style.background = "rgba(255, 152, 0, 0.95)";
    document.body.appendChild(n);
    setTimeout(() => {
        n.style.animation = "slideOut 0.4s ease-in";
        setTimeout(() => n.remove(), 400);
    }, 3000);
}

/**
 * Production-safe error handler
 * @param {Error|any} error - The error object to handle
 * @param {boolean} silent - If true, no UI notification is shown
 */
export function handleError(error, silent = false) {
    if (DEV_MODE) {
        console.error("DEBUG:", error);
    }

    if (!silent) {
        let displayMessage = "An unexpected error occurred. Please try again.";


        if (error && error.message) {
            const msg = error.message;
            // Refined regex to avoid masking legitimate English "at" while catching stack trace "at "
            const isTechnical = /stack|TypeError|ReferenceError|SyntaxError|\[object|{|at\s+.*\.js:/.test(msg);

            if (!isTechnical) {
                displayMessage = msg;
            }
        }

        showNotification(displayMessage, "error");
    }
}

export function hideLoader() {
    const loader = document.getElementById("loader");
    const container = document.getElementById("main-container");
    if (!loader || !container) return;
    container.classList.add("loaded");
    setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.transition = "opacity 0.5s ease";
        setTimeout(() => (loader.style.display = "none"), 500);
    }, 100);
}

if (!document.querySelector('style[data-notification-styles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-notification-styles', 'true');
    style.textContent = `
    @keyframes slideIn { from {transform:translateX(100px);opacity:0} to {transform:translateX(0);opacity:1} }
    @keyframes slideOut { from {transform:translateX(0);opacity:1} to {transform:translateX(100px);opacity:0} }
  `;
    document.head.appendChild(style);
}