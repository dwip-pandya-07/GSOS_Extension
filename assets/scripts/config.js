// config.js - Configuration and Constants
const CONFIG = {
    LARAVEL_WALLPAPER_API: "http://127.0.0.1:8000/api/wallpapers",
    LARAVEL_TIP_API: "http://127.0.0.1:8000/api/tip",
};

const BRAND_LOGOS = ["assets/images/invinsense_white.png"];

const SECURITY_TIPS = [
    "Disable unused accounts and services to reduce attack surface.",
    "Always verify website URLs before entering credentials.",
    "Use HTTPS-only mode in your web browser.",
    "Rotate passwords periodically for critical systems.",
    "Monitor systems for unusual behavior or anomalies.",
    "Restrict admin privileges to only trusted users.",
    "Enable automatic logouts after periods of inactivity.",
    "Scan email attachments with antivirus software before opening.",
    "Store backups offline to protect against ransomware.",
    "Apply security patches as soon as they are released.",
    "Use firewalls to control incoming and outgoing traffic.",
    "Segment networks to limit lateral movement by attackers.",
    "Log and monitor authentication attempts continuously.",
    "Avoid installing software from untrusted sources.",
    "Use disk encryption on laptops and portable devices.",
    "Harden system configurations by disabling default settings.",
    "Protect APIs with authentication and rate limiting.",
    "Use secure key management for cryptographic secrets.",
    "Conduct regular security awareness training for users.",
    "Validate and sanitize all user inputs in applications.",
    "Limit exposure of sensitive data in logs.",
    "Implement intrusion detection and prevention systems.",
    "Secure IoT devices by changing default credentials.",
    "Review firewall and security group rules regularly.",
    "Use dedicated admin accounts for privileged operations.",
    "Test backups regularly to ensure successful recovery.",
    "Enable alerts for critical security events.",
    "Restrict physical access to servers and networking equipment.",
    "Use code signing to verify software integrity.",
    "Perform regular penetration testing to identify weaknesses."
];


const BACKUP_IMAGES = Array.from(
    { length: 15 },
    (_, i) => `backup/${i + 1}.png`
);

export { CONFIG, BRAND_LOGOS, SECURITY_TIPS, BACKUP_IMAGES };