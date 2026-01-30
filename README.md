# Invinsense Dashboard

Invinsense Dashboard is a security-focused Chrome browser extension that replaces the default "New Tab" page with a personalized, high-performance workspace. It integrates productivity tools—including specialized bookmark management and recent tab tracking—with security-centric features such as curated daily tips and encapsulated content scripts for enhanced privacy and DOM isolation.

## Architecture Overview

The extension is built on a modular, event-driven architecture using Manifest V3. It consists of the following primary architectural layers:

### 1. Dashboard UI (Extension Context)
Located in `index.html` and powered by a modular JavaScript stack (`assets/scripts/`), this layer serves as the primary user interface. It operates within the high-privilege `chrome-extension://` context, allowing direct access to Chrome APIs for storage and bookmark management.

### 2. Background Service Worker (`background.js`)
The background service worker acts as the central orchestrator for data persistence and event tracking. It manages:
- **Domain-based Tab History**: Groups visited URLs by hostname and persists them to `chrome.storage.local`.
- **Transitional URL Filtering**: Automatically excludes authentication and redirect patterns (`/login`, `token=`, etc.) from history to prevent sensitive data leakage.
- **Message Routing**: Handles requests from content scripts to switch or focus existing tabs.

### 3. Content Scripts (`assets/scripts/overlay.js`)
The Recent Tabs Overlay resides in a content script injected into every web page. It uses a **closed Shadow DOM** to ensure maximum isolation between the extension UI and the host webpage context.

### 4. Storage & State Management
- **Persistence**: Managed through `chrome.storage.local` to ensure data survives browser restarts without external synchronization overhead.
- **State Object**: A centralized `State` singleton (`state.js`) provides a reactive bridge between storage operations and UI rendering components.

---

## Technical Features

### Recent Tabs Overlay
- **Trigger**: `Ctrl + Space` global shortcut.
- **Mechanism**: Dynamically fetches domain-grouped history from local storage.
- **Intelligence**: Implements intelligent switching logic. If a selected URL is already open in another tab/window, the extension focuses the existing tab rather than creating a duplicate.

### Local Wallpapers
- **Library**: High-resolution backgrounds hosted locally within the extension package.
- **Selection**: Implements randomized selection on initialization, with optional persistence via a "Static Wallpaper" configuration.
- **Failover**: Automatic fallback to programmatic CSS gradients if local image assets fail to resolve.
- **Persistence**: Supports user-triggered downloads by fetching the image blob and generating a temporary object URL for local saving.

### Security Tips
- **Rotation**: Employs a deterministic rotation algorithm based on the day of the year (`dayOfYear % totalTips`) to ensure a fresh experience every 24 hours.
- **Content**: Pulls from a curated, static library of cybersecurity best practices.
- **Safety**: Renders content strictly via `textContent` to prevent DOM-based XSS from static strings.

### News & RSS Integration
- **Processing**: Fetches data from configured RSS feeds through a JSON proxy.
- **Rendering**: Employs a text-only sanitization strategy (`textContent`) to mitigate risks associated with untrusted HTML content in RSS descriptions.

### Branding & Customization
- **Hidden Configuration**: Secret key sequences (`press U three times` for logo, `press R three times` for RSS) toggle administrative UI panels, allowing professional branding and source customization without cluttering the primary interface.

---

## Security Architecture

### DOM Isolation (Shadow DOM)
The content script overlay is injected into a Host element and attached to a **closed Shadow Root**. This design achieves:
- **CSS Encapsulation**: Host page styles cannot leak into and break the extension's UI.
- **Script Isolation**: Host page scripts cannot traverse the DOM to read or modify the extension's internal UI components.

### Content Security Policy (CSP)
The extension adheres to a strict Manifest V3 CSP:
- `script-src 'self'`: Disallows execution of remote or inline scripts, fundamentally preventing most classes of XSS.
- `object-src 'self'`: Restricts the use of plugins.

### Data Exposure Boundaries
- **No Third-Party Transmission**: All user data (bookmarks, history, settings) is stored locally on the client.
- **Authenticated Path Exclusion**: The background script uses regex pattern matching to ensure URLs containing potential session identifiers or authentication tokens are never recorded in history.

---

## Privacy Considerations

- **Local Storage Only**: No user browsing data or configuration is transmitted to external servers (excluding standard RSS fetch requests).
- **History Normalization**: URLs are normalized (removal of fragments/hashes) to reduce storage footprint and prevent the persistence of transient state data.
- **Minimal Metadata**: Favicons are loaded via the `favicon` permission only when necessary, minimizing exposure to third-party image trackers.

---

## Manifest & Permissions

| Permission | Rationale |
| :--- | :--- |
| `storage` | Required for persisting user settings, wallpapers, and domain-grouped history. |
| `bookmarks` | Enables the integrated bookmark dock and selection modal. |
| `tabs` | Necessary for tracking browsing history and implementing tab switching logic. |
| `favicon` | Used for rendering site identifiers in the Recent Tabs and Bookmarks displays. |
| `<all_urls>` | Required for injecting the `overlay.js` content script and checking existing tab states. |

---

## Development and Maintenance

### State Synchronization
The extension uses a "Load-Modify-Store" pattern. Modules import the `State` object, modify it, and call `saveSettingsToStorage()` from `storage.js`.

### Rendering Patterns
- **Standard UI**: Modular imports handle discrete sections of the `index.html` file.
- **Encapsulated UI**: The `overlay.js` script dynamically creates its own styles and structure within the Shadow Root.

### Error Handling
A defensive programming approach is used throughout. `favicon.onerror` fallbacks ensure UI consistency regardless of site-specific favicon availability, and `try/catch` blocks wrap all `URL` parsing logic.
