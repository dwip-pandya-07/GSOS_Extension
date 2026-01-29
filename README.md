# Invinsense Dashboard

A premium, security-focused Chrome extension that transforms your "New Tab" page into a high-performance productivity dashboard. Featuring dynamic wallpapers, real-time cybersecurity news, smart bookmarks, and daily security awareness tips.

## 🌟 Key Features

### 🎨 Dynamic Wallpaper System
- **Intelligent Sources**: Integrates with custom Laravel backends, and local high-quality backups.
- **Smart Fallback**: Multi-tier loading system ensures you always have a beautiful background, even offline.
- **Personalized Gallery**: Heart/Like system to favorite wallpapers.
- **Glassmorphism UI**: Controls and widgets feature modern frosted glass effects with backdrop blur.
- **Privacy First**: All wallpaper preferences and likes are stored locally via Chrome Storage API.

### 🖼️ Brand Customization
- **Logo Control**: Support for local file uploads (PNG, JPG, SVG) and direct URL-based logo loading.
- **Secret Activation**: Press **"U"** three times consecutively to reveal the secret Branding & Logo configuration panel.
- **Live Preview**: See branding changes instantly before saving.
- **Persistent States**: Your custom branding persists across browser restarts and syncs with    your profile.

### 📰 Advanced Cybersecurity News
- **Multi-Feed Support**: Configure up to **10 custom RSS feeds** to stay updated with your preferred sources.
- **Priority Distribution**: Intelligent algorithm weights articles based on your feed order, ensuring top sources get more visibility.
- **Secret Access**: Press **"R"** three times consecutively to reveal the RSS Configuration panel in the settings drawer.
- **Optimized Performance**: News items are cached for 15 minutes to minimize network requests and improve load speed.
- **Rich Content**: Article cards include thumbnails, source attribution, and simplified summaries.

### 🔖 Smart Bookmarks & Navigation
- **Persistent Dock**: A sleek, auto-hiding dock for your most-used bookmarks.
- **Quick Selection**: Modal interface to easily select which Chrome bookmarks appear in your dock.
- **Favicon Integration**: Real-time fetching of high-resolution favicons for clear visual identification.
- **Smart Tracking**: The "Recent Tabs" floating panel automatically tracks your most visited sites, filtering out transitional pages (login, auth, etc.) for a cleaner history.
- **Global Recent Tabs Overlay**: A keyboard-triggered, centered modal available on **every website** to jump between your recently visited domains instantly.

### 🔍 Search Integration
- **Command Center**: Integrated Google Search bar with clean iconography.
- **Keyboard Friendly**: Instant focus and search capability directly from the dashboard center.

### 🔒 Security Awareness
- **Daily Tips**: Rotating collection of 20+ professional security best practices.
- **Dynamic Learning**: Tips update based on daily algorithms or direct API fetches.
- **Broad Coverage**: Spans password security, MFA, phishing, encryption, and physical security.

### ⏰ Time & Precision
- **Holographic Clock**: Large, high-visibility time and date display with seconds precision.
- **Smart Greetings**: Personalized greetings based on your local time of day.
- **Customizable Format**: Toggle between 12-hour and 24-hour formats with a single switch.

## 📁 Project Structure

```
Invinsense_Extension/
├── assets/
│   ├── images/               # Core brand assets and default icons
│   ├── scripts/              # Modular ES6 JavaScript Architecture
│   │   ├── main.js           # Application entry point & coordination
│   │   ├── config.js         # Global constants and API endpoints
│   │   ├── state.js          # Centralized reactive state management
│   │   ├── storage.js        # Abstraction layer for Chrome Storage API
│   │   ├── wallpaper.js      # Multi-source wallpaper logic
│   │   ├── clock.js          # Reactive time and date engine
│   │   ├── tips.js           # Security tip rotation & API handling
│   │   ├── news.js           # RSS aggregation & priority distribution
│   │   ├── bookmarks.js      # Chrome Bookmark API integration
│   │   ├── recent-tabs.js    # Domain tracking & history UI
│   │   ├── search.js         # Integrated search functionality
│   │   ├── logo-activation.js# Secret feature handling (U-U-U)
│   │   ├── ui.js             # UI components and interaction helpers
│   │   ├── utils.js          # Shared utility functions
│   │   ├── likes.js          # Wallpaper favorite system
│   │   ├── overlay.js        # Global Recent Tabs Overlay logic
│   │   └── shortcuts.js      # Global keyboard shortcut handler
│   └── style/
│       ├── style.css         # Modern CSS with variables and animations
│       └── overlay.css       # Premium styles for the Global Overlay
├── backup/                   # High-resolution fallback wallpapers
├── icons/                    # Multi-size extension icons
├── background.js             # Service worker for background tasks & tab tracking
├── index.html                # Main dashboard entry point
├── manifest.json             # Extension manifest (v3)
└── README.md                 # Documentation
```

## 🚀 Getting Started

### Installation (Developer Mode)
1.  **Download/Clone** the repository to your local machine.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **"Developer mode"** in the top right corner.
4.  Click **"Load unpacked"** and select the root folder of this project.
5.  Open a new tab to see Invinsense in action!

## 🔧 Configuration & Secrets

### Secret Menus
Invinsense hides advanced configuration to maintain a clean aesthetic:
- **Logo/Branding Utility**: Tap the `U` key **3 times** quickly.
- **RSS Feed Manager**: Tap the `R` key **3 times** quickly.

## ⌨️ Essential Keyboard Shortcuts
Streamline your workflow with these global and dashboard-specific shortcuts (Works when not in an input field):

### 🌐 Global (Any Website)
- **`Ctrl + Shift + H`**: Toggle the **Global Recent Tabs Overlay**. Use it to jump between sites without touching your address bar.

### 🏠 Dashboard Specific
- **`Shift + S`**: Toggle Settings Drawer
- **`Shift + N`**: Toggle RSS News Panel
- **`Shift + B`**: Toggle Bookmarks Extension
- **`Shift + L`**: Like/Heart the current wallpaper
- **`Escape`**: Close any open overlay or modal

### Wallpaper APIs
To enable external wallpaper sources, update `assets/scripts/config.js`:
- **Laravel Backend**: Configure `LARAVEL_WALLPAPER_API` for custom backend integration.

## 🎨 Design Philosophy

### Visual Excellence
- **Glassmorphism**: Extensive use of `backdrop-filter: blur()` for a premium, airy feel.
- **Micro-animations**: Subtle transitions on hover and state changes (Scale, Fade, Slide).
- **Responsive Core**: Fluid layout adjusts from 4K monitors down to mobile viewport sizes.
- **Inter Typography**: Uses the Inter font family for maximum readability and a modern tech aesthetic.

### Technical Excellence
- **Manifest V3**: Fully compliant with the latest Chrome Extension standards.
- **ES6 Modules**: Clean, tree-shakeable, and maintainable code structure.
- **Lazy Loading**: Assets and widgets load progressively to ensure <1s initial dashboard render.

## 🔄 Version History

### Version 2.2.0 (Latest)
- **New**: Global "Recent Tabs" Overlay triggered via `Ctrl + Shift + H` on any website.
- **New**: Intelligent Navigation (switches to existing tabs instead of opening duplicates).
- **New**: Premium Glassmorphism UI for centered modals with smooth scale animations.
- **Refined**: Comprehensive Keyboard Shortcut mapping for ultimate power-user efficiency.
- **Improved**: Favicon fallback mechanism for better visual recognition across all sites.

### Version 2.1.0
- **New**: Integrated Google Search bar in the center console.
- **New**: Recent Tabs panel with domain-based tracking and smart filtering.
- **New**: Multi-RSS support with priority-based interleaving.
- **Improved**: Logo configuration now supports both local files and URLs.
- **Improved**: Enhanced storage logic for faster load times.
- **Fixed**: Bookmark favicon resolution and transition issues.

### Version 2.0.0
- Refactored core to ES6 Modules.
- Implemented Glassmorphism UI design system.
- Added secret activation triggers for advanced features.
- Migrated to Manifest V3.
- Added dynamic wallpaper & Security Tip system.

### Version 1.0.0
- Initial release with core backup wallpaper and static security tip functionality.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request


## 🆘 Support

For support, feature requests, or bug reports:
- Create an issue in the GitHub repository
- Contact the development team
- Check the troubleshooting section below

## 🔧 Troubleshooting

### Common Issues

**Wallpapers not loading:**
- Check internet connection
- Verify API keys are correct
- Ensure backup images are in `/backup/` folder

**Settings not saving:**
- Check Chrome storage permissions
- Clear extension data and reload
- Verify manifest permissions

**Extension not appearing:**
- Ensure Developer Mode is enabled
- Check for manifest.json errors
- Reload the extension

---

**Invinsense Dashboard** - Elevating your browsing experience with security and style.