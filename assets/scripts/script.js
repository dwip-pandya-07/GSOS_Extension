// Laravel API endpoint (LOCAL)
const LARAVEL_WALLPAPER_API = "http://127.0.0.1:8000/api/wallpapers";


// API CONFIGURATION 
// const UNSPLASH_KEY = "GjKAaKJOy1oBXxnoo4rHRuyM4KPWhT8iZIWcn2xuc9I";

// Security Tips Database
const securityTips = [
  "Never share your passwords with anyone.",
  "Use multi-factor authentication whenever possible.",
  "Avoid clicking unknown links in emails.",
  "Keep your software updated to prevent vulnerabilities.",
  "Lock your screen when away from your device.",
  "Use strong, unique passwords for each account.",
  "Enable two-factor authentication on all accounts.",
  "Be cautious of phishing emails and suspicious links.",
  "Encrypt sensitive data before transmission.",
  "Review account activity and login history regularly.",
  "Use a VPN for secure browsing on public Wi-Fi.",
  "Back up important data to secure locations.",
  "Avoid using public USB charging stations.",
  "Implement principle of least privilege.",
  "Never leave sensitive documents unattended.",
  "Use password managers to store credentials securely.",
  "Verify sender identity before responding to requests.",
  "Be wary of social engineering attempts.",
  "Regularly audit your third-party app permissions.",
  "Use encrypted messaging apps for sensitive conversations.",
];

// Backup images
const backupImages = [
  "backup/image1.png",
  "backup/image2.png",
  "backup/image3.png",
  "backup/image4.png",
  "backup/image5.png",
  "backup/image6.png",
  "backup/image7.png",
  "backup/image8.png",
  "backup/image9.png",
  "backup/image10.png",
  "backup/image11.png",
  "backup/image12.png",
  "backup/image13.png",
  "backup/image14.png",
  "backup/image15.png",
];

let apiWorking = true;

// LOADER MANAGEMENT
function hideLoader() {
  const loader = document.getElementById("loader");
  const mainContainer = document.getElementById("main-container");

  if (loader && mainContainer) {
    mainContainer.classList.add("loaded");

    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }, 100);
  }
}

// 1. CLOCK
function updateClock() {
  const now = new Date();

  const hrs = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  const secs = String(now.getSeconds()).padStart(2, "0");

  document.getElementById("time").innerHTML = `${hrs}:${mins}:${secs}`;
}

function updateDate() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.getElementById("date").innerHTML = now.toLocaleDateString(
    "en-US",
    options
  );
}

updateClock();
updateDate();
setInterval(updateClock, 1000);

// 2. DYNAMIC WALLPAPER

async function loadWallpaper() {
  try {
    const res = await fetch(LARAVEL_WALLPAPER_API);

    if (!res.ok) throw new Error("Laravel API failed");

    const json = await res.json();

    if (!json.status || json.count === 0) {
      console.log("No wallpapers found — using backup");
      return loadBackupWallpaper();
    }

    // Pick a random wallpaper from Laravel API
    const wallpapers = json.data;
    const randomWallpaper =
      wallpapers[Math.floor(Math.random() * wallpapers.length)];

    const bgElement = document.getElementById("bg");

    const img = new Image();
    img.onload = () => {
      bgElement.style.backgroundImage = `url('${randomWallpaper.url}')`;
      bgElement.style.opacity = "1";
      apiWorking = true;
      hideLoader();
    };
    img.onerror = () => {
      console.log("Laravel image failed — using backup");
      loadBackupWallpaper();
    };
    img.src = randomWallpaper.url;
  } catch (e) {
    console.error("Laravel API error:", e);
    loadBackupWallpaper();
  }
}



// load from unsplash
// async function loadWallpaper() {
//     try {
//         const res = await fetch(
//             `https://api.unsplash.com/photos/random?query=nature,mountain,landscape&orientation=landscape&client_id=${UNSPLASH_KEY}`
//         );

//         if (!res.ok) throw new Error("API Error");

//         const data = await res.json();
//         const bgElement = document.getElementById("bg");

//         const img = new Image();
//         img.onload = () => {
//             bgElement.style.backgroundImage = `url('${data.urls.full}')`;
//             bgElement.style.opacity = "1";
//             apiWorking = true;
//             hideLoader();
//         };
//         img.onerror = () => {
//             console.log("Image failed to load, using backup");
//             apiWorking = false;
//             loadBackupWallpaper();
//         };
//         img.src = data.urls.full;

//     } catch (e) {
//         console.log("Failed to load wallpaper from API:", e);
//         apiWorking = false;
//         loadBackupWallpaper();
//     }
// }


function loadBackupWallpaper() {
  const bgElement = document.getElementById("bg");

  const randomIndex = Math.floor(Math.random() * backupImages.length);
  const selectedImage = backupImages[randomIndex];

  const img = new Image();
  img.onload = () => {
    bgElement.style.backgroundImage = `url('${selectedImage}')`;
    bgElement.style.opacity = "1";
    hideLoader();
  };
  img.onerror = () => {
    console.log("Backup failed — using gradient");
    setFallbackWallpaper();
  };
  img.src = selectedImage;
}

function setFallbackWallpaper() {
  const bgElement = document.getElementById("bg");
  bgElement.style.background =
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  bgElement.style.opacity = "1";
  hideLoader();
}

loadWallpaper();

// GREETING
function loadGreeting() {
  const hour = new Date().getHours();
  let greet = "Welcome";

  if (hour < 12) greet = "Good Morning";
  else if (hour < 18) greet = "Good Afternoon";
  else greet = "Good Evening";

  document.getElementById("greeting").innerHTML = greet;
}

loadGreeting();

const updateGreetingAtMidnight = () => {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  const timeUntilMidnight = tomorrow - now;

  setTimeout(() => {
    loadGreeting();
    setInterval(loadGreeting, 86400000);
  }, timeUntilMidnight);
};

updateGreetingAtMidnight();

// SECURITY TIP
function getDailyTip() {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now - new Date(now.getFullYear(), 0, 0)) / 86400000
  );
  const tipIndex = dayOfYear % securityTips.length;
  return securityTips[tipIndex];
}

function loadTip() {
  const tip = getDailyTip();
  document.getElementById("tip").innerHTML = `"${tip}"`;
}

loadTip();

const updateTipAtMidnight = () => {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  const timeUntilMidnight = tomorrow - now;

  setTimeout(() => {
    loadTip();
    setInterval(loadTip, 86400000);
  }, timeUntilMidnight);
};

updateTipAtMidnight();
