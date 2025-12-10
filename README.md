# GSOS Extension

A Chrome extension that provides a **Security Awareness Dashboard** with dynamic wallpapers, daily security tips, and customizable settings. GSOS (Governance, Security, Operations & Safety) transforms your new tab experience into an informative and visually appealing security-focused dashboard.

## 🌟 Features

### 🎨 Dynamic Wallpapers
- **Multiple Sources**: Supports Unsplash API, Laravel backend, and local backup images
- **Smart Loading**: Automatic fallback system ensures wallpapers always load
- **Like System**: Heart button to favorite wallpapers you love
- **Static Mode**: Pin your favorite wallpaper to keep it fixed
- **Favorites Only**: Toggle to show only your liked wallpapers

### 🖼️ Custom Logo Upload
- **Secret Activation**: Press "U" three times to reveal logo upload feature
- **Custom Branding**: Upload your own PNG, JPG, JPEG, or SVG logo (max 2MB)
- **Real-time Preview**: See your logo instantly in both preview and main display
- **Persistent Storage**: Custom logos save automatically and persist across sessions
- **Easy Reset**: Remove custom logo to restore default branding

### 📰 Cybersecurity News
- **Live RSS Feed**: Real-time news from The Hacker News
- **Auto-refresh**: News cached for 15 minutes, then automatically updates
- **Click to Read**: Open articles in new tabs
- **No API Required**: Direct RSS feed integration via rss2json service

### 🔖 Smart Bookmarks
- **Quick Access Dock**: Persistent bookmark bar with favicon display
- **Toggle Visibility**: Click bookmark icon to show/hide dock
- **Stays Open**: Dock remains visible until you close it (no accidental closing)
- **Easy Management**: Add/remove bookmarks through modal interface
- **Chrome Integration**: Syncs with your browser bookmarks

### 🔒 Security Awareness
- **Daily Security Tips**: Rotating collection of 20+ security best practices
- **Real-time Updates**: Tips update dynamically from the API every day
- **Educational Content**: Tips cover password security, phishing, encryption, and more
- **Consistent Learning**: New tip each day based on date algorithm (fallback mode)

### ⏰ Time & Date Display
- **Real-time Clock**: Live updating with seconds precision
- **Dual Format Support**: Toggle between 12-hour and 24-hour formats
- **Smart Greetings**: Context-aware greetings based on time of day
- **Full Date Display**: Complete date with weekday, month, and year

### ⚙️ Customizable Settings
- **Settings Drawer**: Slide-out panel with all configuration options
- **Wallpaper Controls**: Static mode, favorites filter, download functionality
- **Logo Upload**: Secret feature for custom branding (press "U" 3 times)
- **Time Preferences**: Format switching with live preview
- **Persistent Storage**: All settings saved using Chrome storage API

### 🎯 User Experience
- **Loading Animation**: Smooth loader with branded messaging
- **Responsive Design**: Optimized for all screen sizes (desktop, tablet, mobile)
- **Glass Morphism UI**: Modern frosted glass design elements
- **Smooth Animations**: Fade transitions and hover effects
- **Notification System**: Toast notifications for user feedback
- **Modular Architecture**: Clean ES6 modules for maintainability

## 📁 Project Structure

```
GSOS_Extension/
├── assets/
│   ├── images/           # Brand logos and assets
│   │   ├── invinsense_white.png (default logo)
│   │   └── other brand assets
│   ├── scripts/          # Modular ES6 JavaScript
│   │   ├── main.js              # Application entry point
│   │   ├── config.js            # Configuration constants
│   │   ├── state.js             # Application state management
│   │   ├── storage.js           # Chrome storage API wrapper
│   │   ├── wallpaper.js         # Wallpaper loading logic
│   │   ├── clock.js             # Time and date display
│   │   ├── tips.js              # Security tips rotation
│   │   ├── ui.js                # UI helper functions
│   │   ├── drawer.js            # Settings drawer management
│   │   ├── news.js              # RSS news feed integration
│   │   ├── likes.js             # Wallpaper like system
│   │   ├── search.js            # Search functionality
│   │   ├── bookmarks.js         # Bookmark management
│   │   ├── logo-activation.js   # Secret logo upload feature
│   │   └── utils.js             # Utility functions
│   └── style/
│       └── style.css     # Complete styling and responsive design
├── backup/               # Fallback wallpaper images (15 images)
│   ├── image1.png
│   ├── image2.png
│   └── ...
├── icons/               # Extension icons for different sizes
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon64.png
│   └── icon128.png
├── background.js        # Service worker for extension functionality
├── index.html          # Main dashboard interface
├── manifest.json       # Extension configuration
└── README.md          # This file
```

## 🚀 Installation

### Method 1: Developer Mode (Recommended)
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The GSOS extension will appear in your extensions list

### Method 2: Chrome Web Store
*Coming soon - extension will be published to Chrome Web Store*

## 🔧 Configuration

### News Feed
The extension uses **The Hacker News RSS feed** for cybersecurity news:
- **Feed URL**: `https://feeds.feedburner.com/TheHackersNews`
- **Conversion Service**: rss2json.com (handles CORS automatically)
- **No API Key Required**: Direct RSS integration
- **Auto-refresh**: News cached for 15 minutes

### Wallpaper Sources
The extension supports multiple wallpaper sources:

1. **Unsplash API** (Default fallback):
   - Get API key from [Unsplash Developers](https://unsplash.com/developers)
   - Update `UNSPLASH_KEY` in `config.js`

2. **Laravel Backend** (Optional):
   - Set up your Laravel wallpaper API endpoint
   - Update `LARAVEL_WALLPAPER_API` in `config.js`
   - Update `LARAVEL_TIP_API` in `config.js` for security tips
   - Set `USE_UNSPLASH = false` to use Laravel API

3. **Local Images** (Always available):
   - Backup images automatically used if APIs fail
   - Located in `/backup/` directory

### Settings Panel
Access the settings by clicking the gear icon in the bottom right:

- **Static Wallpaper**: Pin current wallpaper to prevent changes
- **Show Only Liked**: Display only your favorited wallpapers
- **Download Wallpaper**: Save current wallpaper to your device
- **Time Format**: Switch between 12-hour and 24-hour display
- **Custom Logo**: Press "U" 3 times to reveal upload option (secret feature)

## 🎨 Design Features

### Visual Elements
- **Modern Glass Morphism**: Frosted glass effects with backdrop blur
- **Responsive Layout**: Adapts to desktop (1024px+), tablet (768px), and mobile (480px)
- **Color Scheme**: Dark theme with white text and accent colors
- **Typography**: Inter font family for clean, modern appearance

### Interactive Components
- **Heart Button**: Animated like/unlike functionality
- **Settings Drawer**: Smooth slide-out panel with toggle switches
- **Hover Effects**: Subtle animations on interactive elements
- **Loading States**: Spinner animation during wallpaper loading

### Accessibility
- **ARIA Labels**: Screen reader support for all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Readable text with proper contrast ratios
- **Responsive Text**: Scalable font sizes across devices

## 🔒 Security Tips Collection

The extension includes 20+ rotating security tips covering:
- Password management and best practices
- Multi-factor authentication
- Phishing and social engineering awareness
- Software updates and vulnerability management
- Data encryption and secure transmission
- Physical security measures
- Network security (VPN usage, public Wi-Fi)
- Account monitoring and access control

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with flexbox, grid, and animations
- **ES6 Modules**: Modular JavaScript architecture for maintainability
- **Chrome Extension APIs**: Storage, tabs, bookmarks, and action APIs
- **Web APIs**: Fetch for HTTP requests, FileReader for image uploads
- **RSS Integration**: rss2json.com service for feed conversion

### Architecture
- **Modular Design**: Separate modules for each feature (wallpaper, news, bookmarks, etc.)
- **State Management**: Centralized state in `state.js`
- **Storage Abstraction**: Chrome storage wrapper in `storage.js`
- **Event-driven**: Clean separation of concerns with event handlers

### Browser Compatibility
- **Chrome**: Full support (Manifest V3)
- **Edge**: Compatible with Chromium-based Edge
- **Other Browsers**: May require manifest modifications

### Performance Optimizations
- **Image Preloading**: Ensures smooth wallpaper transitions
- **Lazy Loading**: Efficient resource management
- **Caching**: Chrome storage for settings persistence, 15-min news cache
- **Fallback System**: Multiple layers prevent loading failures
- **Base64 Encoding**: Custom logos stored as data URIs

## 📱 Responsive Breakpoints

- **Desktop (1024px+)**: Full feature set with large time display
- **Tablet (768px)**: Optimized layout with adjusted font sizes
- **Mobile (480px)**: Compact design with full-width drawer

## 🔄 Update History

### Version 2.0.0 (Latest)
- **Dynamic Logo Upload**: Secret feature activated by pressing "U" 3 times
- **RSS News Integration**: Live cybersecurity news from The Hacker News
- **Bookmark Improvements**: Persistent dock that stays open until toggled
- **Modular Architecture**: Refactored to ES6 modules for better maintainability
- **Enhanced Storage**: Base64 logo storage, improved settings persistence
- **Removed Dependencies**: No more newsdata.io API, direct RSS integration

### Version 1.0.0
- Initial release with core dashboard functionality
- Dynamic wallpaper system with multiple sources
- Security tips rotation system
- Settings panel with customization options
- Responsive design for all devices
- Like/favorite system for wallpapers

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

**GSOS Extension** - Transforming your browsing experience with security awareness and beautiful design.