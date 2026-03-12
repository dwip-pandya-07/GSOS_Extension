# Invinsense Dashboard

Invinsense Dashboard is a security-focused Chrome browser extension that replaces the default "New Tab" page with a personalized, high-performance workspace. It integrates advanced productivity tools—including specialized bookmark management and recent tab tracking—with security-centric features such as curated daily tips and encapsulated content scripts for enhanced privacy and DOM isolation.

---

## 🚀 Key Features

### 🛡️ Security-First Design
- **Daily Security Tips**: A rotating library of cybersecurity best practices, providing a fresh tip every 24 hours based on a deterministic rotation algorithm.
- **Transitional URL Filtering**: Automatically detects and excludes sensitive URLs (login pages, callback handlers, tokens, and session identifiers) from history to prevent data leakage.
- **Text-Only Sanitization**: All external content (tips, news) is rendered using `textContent` to provide inherent protection against DOM-based XSS attacks.
- **DOM Isolation (Shadow DOM)**: The Recent Tabs Overlay uses a **closed Shadow Root** to ensure maximum isolation between the extension UI and the host webpage context, preventing host-script interference.
- **Strict CSP**: Adheres to a rigid Manifest V3 Content Security Policy (`script-src 'self'`), fundamentally blocking unauthorized script execution.

### 📦 Productivity & Utility
- **Recent Tabs Overlay (`Ctrl + Space`)**: A global shortcut that triggers a powerful search overlay on any website, allowing instant navigation across recently visited pages.
- **Domain-Grouped History**: Intelligently groups browsing history by host, making it easier to discover pages within large domains.
- **Intelligent Tab Switching**: Automatically focuses existing tabs/windows for requested URLs instead of creating duplicates.
- **Integrated Bookmark Dock**: A sleek, accessible dock with site icons (favicons), featuring a selection modal for bulk management of dashboard shortcuts.
- **Google Search Integration**: A minimalist search bar available directly on the dashboard.

### 🖼️ Personalization & Branding
- **Local Wallpaper Library**: High-resolution, locally-hosted backgrounds with randomized selection on initialization.
- **Wallpaper Management**: Supports static wallpaper locking and user-triggered high-res downloads via blob processing.
- **Custom Branding**: Features "Powered by infopercept consulting pvt ltd" attribution and support for custom brand logo uploads.
- **Hidden Admin Panels**: Shift-based or sequence-based triggers reveal administrative panels for professional branding and source customization.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Space` | Toggle Recent Tabs Overlay (on any page) |
| `Shift + S` | Toggle Settings Drawer |
| `Shift + N` | Toggle News Drawer |
| `Shift + B` | Toggle Bookmarks Dock |
| `Shift + H` | Toggle Help & Shortcuts Guide |
| `Esc` | Close any active Drawer or Modal |
| `U` (3 times) | Reveal Custom Logo Upload Panel (in settings) |
| `R` (3 times) | Reveal RSS Configuration Panel (in news) |

---

## 🛠️ Architecture Overview

The extension is built on a modular, event-driven architecture using Manifest V3:

### 1. Dashboard UI (`index.html`)
The primary interface, powered by a modular JavaScript stack (`assets/scripts/`). It operates within the high-privilege `chrome-extension://` context for direct API access.

### 2. Background Service Worker (`background.js`)
The central orchestrator for data persistence and event tracking:
- **State Management**: Manages domain-based history and persists it to `chrome.storage.local`.
- **Security Logic**: Implements URL normalization and transitional filtering regex.
- **Message Routing**: Handles inter-context communication between content scripts and the extension core.

### 3. Content Scripts (`assets/scripts/overlay.js`)
Injected into every web page to provide the `Ctrl + Space` functionality. Uses encapsulation through the **Shadow DOM** to prevent CSS leakage and host-script traversal.

---

## 🔒 Privacy & Data Boundaries

- **100% Local Storage**: No user browsing data, bookmarks, or configurations are transmitted to external servers (except for RSS fetch requests directly to identified feed providers).
- **History Normalization**: URLs are normalized (fragments/hashes removed) to reduce storage footprint and avoid persisting transient state data.
- **Zero Third-Party Tracking**: The extension does not utilize analytics or telemetry of any kind.

---

## ⚙️ Permissions

| Permission | Rationale |
| :--- | :--- |
| `storage` | Persisting user settings, wallpaper choices, and domain-grouped history. |
| `bookmarks` | Enabling the integrated bookmark dock and selection modal. |
| `tabs` | Tracking browsing history (with filtering) and implementing tab switching logic. |
| `favicon` | Rendering site identifiers in the Recent Tabs and Bookmarks displays. |
| `<all_urls>` | Injecting the overlay content script and monitoring existing tab states. |

---

© 2026 infopercept consulting pvt ltd. All rights reserved.
