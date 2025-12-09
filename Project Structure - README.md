# GSOS - Modular JavaScript Structure

## 📁 File Organization

```
project/
├── index.html
└── js/
    ├── config.js          # Configuration and constants
    ├── state.js           # Application state management
    ├── utils.js           # Utility functions (notifications, loader)
    ├── storage.js         # Chrome storage operations
    ├── clock.js           # Clock and date functionality
    ├── tips.js            # Security tips loading
    ├── wallpaper.js       # Wallpaper loading and management
    ├── likes.js           # Like/favorite system
    ├── ui.js              # UI helper functions
    ├── drawer.js          # Settings drawer management
    └── main.js            # Main application entry point
```

## 📄 File Descriptions

### **config.js**
Contains all configuration constants:
- API endpoints (Laravel, Unsplash)
- Brand logos
- Security tips
- Backup images

### **state.js**
Centralized application state:
- Current wallpaper information
- Liked wallpapers array
- User preferences (time format, static wallpaper, etc.)

### **utils.js**
Reusable utility functions:
- `showNotification()` - Display notifications
- `hideLoader()` - Hide loading screen
- Notification animation styles

### **storage.js**
Chrome storage management:
- `loadSettingsFromStorage()` - Load saved settings
- `saveSettingsToStorage()` - Save settings to Chrome sync storage

### **clock.js**
Time and date functionality:
- `updateClock()` - Update time display
- `updateDate()` - Update date display
- `startClock()` - Initialize clock updates

### **tips.js**
Security tips management:
- `loadTip()` - Fetch tips from API
- Fallback to local tips if API fails

### **wallpaper.js**
Wallpaper operations:
- `loadWallpaper()` - Load wallpapers from various sources
- `downloadWallpaper()` - Download current wallpaper
- Support for Laravel API, Unsplash, and local backups

### **likes.js**
Favorite/like system:
- `toggleLikeWallpaper()` - Add/remove favorites
- `updateMainLikeButton()` - Update heart button UI
- `updateOnlyLikedToggleState()` - Manage liked-only mode

### **ui.js**
UI helper functions:
- `loadRandomLogo()` - Load brand logo
- `loadGreeting()` - Display time-based greeting

### **drawer.js**
Settings drawer functionality:
- `initDrawer()` - Initialize drawer and all settings
- Handle all toggle switches and buttons
- Manage drawer open/close states

### **main.js**
Application entry point:
- Orchestrates initialization of all modules
- Loads settings and starts the application

## 🚀 Usage

### In HTML:
```html
<!-- Only need to import main.js with type="module" -->
<script type="module" src="./js/main.js"></script>
```

### Module Structure:
All files use ES6 modules with `import` and `export`:
```javascript
// Importing
import State from "./state.js";
import { showNotification } from "./utils.js";

// Exporting
export function myFunction() { ... }
export default myObject;
```

## 🔧 Modifications

### Adding New Features:
1. Create a new `.js` file in the `js/` folder
2. Import necessary dependencies
3. Export your functions
4. Import in `main.js` and call during initialization

### Updating Configuration:
Edit `config.js` to change:
- API endpoints
- Brand logos
- Security tips
- Backup images

### Managing State:
All shared state should be stored in `state.js` for easy access across modules.

## ⚙️ Benefits of This Structure

✅ **Separation of Concerns** - Each file has a single responsibility  
✅ **Easy Maintenance** - Find and fix issues quickly  
✅ **Reusability** - Functions can be imported anywhere  
✅ **Scalability** - Easy to add new features  
✅ **Testing** - Individual modules can be tested separately  
✅ **Readability** - Clear organization and naming