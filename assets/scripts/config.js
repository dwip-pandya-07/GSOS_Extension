// config.js - Configuration and Constants
const CONFIG = {
    UNSPLASH_KEY: "GjKAaKJOy1oBXxnoo4rHRuyM4KPWhT8iZIWcn2xuc9I",
    USE_UNSPLASH: false,
    LARAVEL_WALLPAPER_API: "http://127.0.0.1:8000/api/wallpapers",
    LARAVEL_TIP_API: "http://127.0.0.1:8000/api/tip",
};

const BRAND_LOGOS = ["/assets/images/invinsense_white.png"];

const SECURITY_TIPS = [
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

const BACKUP_IMAGES = Array.from(
    { length: 15 },
    (_, i) => `backup/image${i + 1}.png`
);

export { CONFIG, BRAND_LOGOS, SECURITY_TIPS, BACKUP_IMAGES };