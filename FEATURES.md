# Features Overview: Invinsense Dashboard

Invinsense Dashboard is a high-performance, security-centric Chrome extension designed to replace the standard "New Tab" page with a productive and secure workspace.

## 🚀 Core Dashboard Features
- **Custom New Tab Page**: Replaces the default browser home with a streamlined, premium interface.
- **Dynamic Clock & Greeting**: Real-time digital clock with personalized greetings based on the time of day.
- **Premium UI Design**: Built with modern CSS (glassmorphism), a clean typography system (`Outfit`), and smooth micro-animations.

## 🛡️ Security-Centric Functionality
- **Daily Security Tips**: A rotating library of cybersecurity best practices, providing a fresh tip every 24 hours.
- **Transitional URL Filtering**: Automatically detects and excludes sensitive URLs (login pages, password resets, tokens) from your history to prevent data leakage.
- **Text-Only Sanitization**: All external content (tips, news) is rendered using `textContent` to provide natural protection against DOM-based XSS attacks.
- **Privacy-First Architecture**: Zero third-party tracking. All user data, including bookmarks and history, stays 100% local on your machine.

## 📦 Productivity Suite
- **Integrated Bookmark Dock**: A sleek, accessible dock for your most-used bookmarks, featuring site icons (favicons) and quick-launch capabilities.
- **Recent Tabs Overlay (`Ctrl + Space`)**: A system-wide shortcut that triggers a powerful search overlay on any website, allowing you to quickly jump between recently visited pages.
- **Domain-Grouped History**: Intelligently groups your browsing history by domain, making it easier to find specific pages within a large site.
- **Intelligent Tab Switching**: If a requested page is already open in another tab or window, the extension focuses the existing tab instead of creating a duplicate.

## 🖼️ Visual Personalization
- **High-Resolution Wallpapers**: A curated collection of local, high-performance background images.
- **Randomized Selection**: Displays a fresh wallpaper on every new tab or browser restart.
- **Download Capability**: Allows users to download the current high-res background for personal use.
- **FAILSAFE Gradients**: Automatically falls back to high-quality CSS gradients if local image assets fail to resolve, ensuring a consistent UI.

## 📰 Information & Feeds
- **RSS News Integration**: Real-time cybersecurity news feeds integrated directly into the dashboard.
- **Sanitized Processing**: News descriptions are processed through a sanitization layer to ensure safe rendering of external HTML content.

## ⚙️ Advanced Features & Controls
- **Hidden Admin Panels**: Secure configuration panels that are toggled via secret key sequences (e.g., logo activation, RSS source management).
- **Centralized Status Dashboard**: A premium implementation-tracking page (`centralized.html`) for monitoring tool status, issues, and development progress.

## 🛠️ Technical Prowess
- **Manifest V3**: Built on the latest, most secure Chrome extension platform.
- **Shadow DOM Isolation**: The Recent Tabs Overlay uses a closed Shadow DOM to ensure extension styles and scripts never interfere with (or are exposed to) the websites you visit.
- **Strict Content Security Policy (CSP)**: High-security policy prevents unauthorized script execution.
