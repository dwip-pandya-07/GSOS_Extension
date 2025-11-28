// ========================================
// DASHBOARD MANAGEMENT
// ========================================

// Dashboard role constants
const ROLES = {
    LOGGED_OUT: null,
    USER: 'user',
    ADMIN: 'admin'
};

// Get current role from localStorage
function getCurrentRole() {
    return localStorage.getItem('gsos_role');
}

// Set role in localStorage
function setRole(role) {
    if (role === null) {
        localStorage.removeItem('gsos_role');
    } else {
        localStorage.setItem('gsos_role', role);
    }
}

// Switch dashboard based on role
function switchDashboard(role) {
    const loggedOutDashboard = document.getElementById('loggedOutDashboard');
    const userDashboard = document.getElementById('userDashboard');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Hide all dashboards
    loggedOutDashboard.style.display = 'none';
    userDashboard.style.display = 'none';
    adminDashboard.style.display = 'none';

    // Show appropriate dashboard
    switch (role) {
        case ROLES.USER:
            userDashboard.style.display = 'block';
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'flex';
            initializeUserDashboard();
            break;
        case ROLES.ADMIN:
            adminDashboard.style.display = 'block';
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'flex';
            initializeAdminDashboard();
            break;
        default:
            loggedOutDashboard.style.display = 'block';
            loginBtn.style.display = 'flex';
            logoutBtn.style.display = 'none';
            initializeLoggedOutDashboard();
            break;
    }
}

// ========================================
// MODAL MANAGEMENT
// ========================================

const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeModalBtn = document.getElementById('closeModal');
const closeModalIcon = document.getElementById('closeModalIcon');
const loginUserBtn = document.getElementById('loginUser');
const loginAdminBtn = document.getElementById('loginAdmin');
const logoutBtn = document.getElementById('logoutBtn');

// Open modal
function openModal() {
    loginModal.classList.add('active');
}

// Close modal
function closeModal() {
    loginModal.classList.remove('active');
}

// Handle login as user
function loginAsUser() {
    setRole(ROLES.USER);
    switchDashboard(ROLES.USER);
    closeModal();
}

// Handle login as admin
function loginAsAdmin() {
    setRole(ROLES.ADMIN);
    switchDashboard(ROLES.ADMIN);
    closeModal();
}

// Handle logout
function logout() {
    setRole(ROLES.LOGGED_OUT);
    switchDashboard(ROLES.LOGGED_OUT);
}

// Event listeners
loginBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
closeModalIcon.addEventListener('click', closeModal);
loginUserBtn.addEventListener('click', loginAsUser);
loginAdminBtn.addEventListener('click', loginAsAdmin);
logoutBtn.addEventListener('click', logout);

// Close modal when clicking backdrop
loginModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        closeModal();
    }
});

// ========================================
// LOGGED OUT DASHBOARD INITIALIZATION
// ========================================

function initializeLoggedOutDashboard() {
    updateGreeting();
    loadSecurityTip('tipIconLoggedOut', 'tipTextLoggedOut');

    // Update greeting every minute
    setInterval(updateGreeting, 60000);
}

function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greetingEmoji = document.getElementById('greetingEmoji');
    const greetingMessage = document.getElementById('greetingMessage');
    const greetingTime = document.getElementById('greetingTime');
    const greetingDate = document.getElementById('greetingDate');

    // Determine greeting based on time
    let greeting = '';
    let emoji = '';

    if (hour >= 5 && hour < 12) {
        greeting = 'Good Morning';
        emoji = '🌅';
    } else if (hour >= 12 && hour < 17) {
        greeting = 'Good Afternoon';
        emoji = '☀️';
    } else if (hour >= 17 && hour < 21) {
        greeting = 'Good Evening';
        emoji = '🌆';
    } else {
        greeting = 'Good Night';
        emoji = '🌙';
    }

    greetingEmoji.textContent = emoji;
    greetingMessage.textContent = greeting;

    // Format time
    const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    greetingTime.textContent = timeString;

    // Format date
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    greetingDate.textContent = dateString;
}

// ========================================
// USER DASHBOARD INITIALIZATION
// ========================================

function initializeUserDashboard() {
    loadSecurityTip('tipIconUser', 'tipTextUser');
    loadTrainingStatus();
    loadLeaderboard();
}

function loadTrainingStatus() {
    // Simulated training data
    const mockData = {
        rank: 5,
        totalTrainings: 12,
        assigned: 12,
        completed: 10,
        recentlyCompleted: [
            'Phishing Awareness Training',
            'Password Security Basics',
            'Data Privacy Fundamentals'
        ]
    };

    // Update training stats
    document.getElementById('userRank').textContent = `#${mockData.rank}`;
    document.getElementById('totalTrainings').textContent = mockData.totalTrainings;
    document.getElementById('assignedTrainings').textContent = mockData.assigned;
    document.getElementById('completedTrainings').textContent = mockData.completed;

    // Update progress bar
    const progress = Math.round((mockData.completed / mockData.assigned) * 100);
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('data-progress', progress);
    progressText.textContent = `${progress}% Complete`;

    // Update recently completed trainings
    const trainingsList = document.getElementById('completedTrainingsList');
    trainingsList.innerHTML = mockData.recentlyCompleted.map(training => `
        <div class="training-item-mini">
            <div class="training-check-mini">✓</div>
            <div class="training-info-mini">
                <div class="training-title-mini">${training}</div>
            </div>
        </div>
    `).join('');
}

function loadLeaderboard() {
    // Simulated leaderboard data
    const mockLeaderboard = [
        { name: 'Sarah Johnson', score: 15, initials: 'SJ' },
        { name: 'Michael Chen', score: 14, initials: 'MC' },
        { name: 'Emily Rodriguez', score: 13, initials: 'ER' },
        { name: 'David Kim', score: 12, initials: 'DK' },
        { name: 'Jessica Brown', score: 11, initials: 'JB' },
        { name: 'Robert Taylor', score: 10, initials: 'RT' },
        { name: 'Amanda Wilson', score: 9, initials: 'AW' }
    ];

    // Update top 3 podium
    if (mockLeaderboard.length >= 3) {
        document.getElementById('firstInitials').textContent = mockLeaderboard[0].initials;
        document.getElementById('firstName').textContent = mockLeaderboard[0].name;
        document.getElementById('firstScore').textContent = `${mockLeaderboard[0].score} trainings`;

        document.getElementById('secondInitials').textContent = mockLeaderboard[1].initials;
        document.getElementById('secondName').textContent = mockLeaderboard[1].name;
        document.getElementById('secondScore').textContent = `${mockLeaderboard[1].score} trainings`;

        document.getElementById('thirdInitials').textContent = mockLeaderboard[2].initials;
        document.getElementById('thirdName').textContent = mockLeaderboard[2].name;
        document.getElementById('thirdScore').textContent = `${mockLeaderboard[2].score} trainings`;
    }

    // Update ranked list (4-10)
    const rankedList = document.getElementById('rankedList');
    rankedList.innerHTML = mockLeaderboard.slice(3).map((user, index) => `
        <div class="rank-item">
            <span class="rank-number">${index + 4}</span>
            <div class="rank-avatar"><span>${user.initials}</span></div>
            <span class="rank-name">${user.name}</span>
            <span class="rank-score">${user.score}</span>
        </div>
    `).join('');
}

// ========================================
// ADMIN DASHBOARD INITIALIZATION
// ========================================

function initializeAdminDashboard() {
    loadAdminTrainingOverview();
    loadAdminRiskManagement();
    loadAdminComplianceManagement();
    loadAdminProjectManagement();
    updateAdminLastUpdated();
}

// Admin Widget 1: Training Overview
function loadAdminTrainingOverview() {
    const mockData = {
        totalAssigned: 450,
        completionPercentage: 78,
        pendingEmployees: 99
    };

    document.getElementById('adminTotalTrainings').textContent = mockData.totalAssigned;
    document.getElementById('adminCompletionPercentage').textContent = `${mockData.completionPercentage}%`;
    document.getElementById('adminPendingEmployees').textContent = mockData.pendingEmployees;

    // Animate circular progress
    animateCircularProgress(mockData.completionPercentage);
}

// Circular progress animation
function animateCircularProgress(percentage) {
    const circle = document.getElementById('progressCircle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    setTimeout(() => {
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }, 100);
}

// Admin Widget 2: Risk Management
function loadAdminRiskManagement() {
    const mockData = {
        highRisk: 12,
        mediumRisk: 28,
        lowRisk: 45
    };

    document.getElementById('adminHighRisk').textContent = mockData.highRisk;
    document.getElementById('adminMediumRisk').textContent = mockData.mediumRisk;
    document.getElementById('adminLowRisk').textContent = mockData.lowRisk;
}

// Admin Widget 3: Compliance Management
function loadAdminComplianceManagement() {
    const mockData = {
        overallCompletion: 72,
        passedControls: 186,
        pendingControls: 72
    };

    document.getElementById('adminCompliancePercentage').textContent = `${mockData.overallCompletion}%`;
    document.getElementById('adminPassedControls').textContent = mockData.passedControls;
    document.getElementById('adminPendingControls').textContent = mockData.pendingControls;

    // Animate compliance progress bar
    const progressFill = document.getElementById('complianceProgressFill');
    setTimeout(() => {
        progressFill.style.width = `${mockData.overallCompletion}%`;
    }, 200);
}

// Admin Widget 4: Project Management
function loadAdminProjectManagement() {
    const mockData = {
        activeProjects: 24,
        completedProjects: 18,
        urgentProjects: 5,
        riskProjects: 8
    };

    document.getElementById('adminActiveProjects').textContent = mockData.activeProjects;
    document.getElementById('adminCompletedProjects').textContent = mockData.completedProjects;
    document.getElementById('adminUrgentProjects').textContent = mockData.urgentProjects;
    document.getElementById('adminRiskProjects').textContent = mockData.riskProjects;
}

// Update last updated timestamp
function updateAdminLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    document.getElementById('trainingLastUpdated').textContent = timeString;
}

// ========================================
// SECURITY TIP MANAGEMENT
// ========================================

function loadSecurityTip(iconId, textId) {
    const tips = [
        { icon: '🔐', text: 'Never share MFA codes — even if the request looks legitimate.' },
        { icon: '🔑', text: 'Use a unique password for every account. Consider a password manager.' },
        { icon: '📧', text: 'Check sender email addresses carefully before clicking links.' },
        { icon: '🛡️', text: 'Enable two-factor authentication on all important accounts.' },
        { icon: '⚠️', text: 'Be suspicious of urgent requests for money or sensitive information.' },
        { icon: '🔒', text: 'Lock your computer when stepping away, even briefly.' },
        { icon: '📱', text: 'Keep your devices updated with the latest security patches.' },
        { icon: '🌐', text: 'Only download software from official, trusted sources.' },
        { icon: '💡', text: 'Think before you click — phishing attacks are getting more sophisticated.' },
        { icon: '🚨', text: 'Report suspicious emails to your IT security team immediately.' }
    ];

    // Get tip of the day based on date
    const today = new Date().getDate();
    const tip = tips[today % tips.length];

    const iconElement = document.getElementById(iconId);
    const textElement = document.getElementById(textId);

    if (iconElement && textElement) {
        iconElement.textContent = tip.icon;
        textElement.textContent = tip.text;
    }
}

// ========================================
// DYNAMIC BACKGROUND
// ========================================

function updateBackground() {
    const bgImage = document.getElementById('bgImage');
    const hour = new Date().getHours();

    // Gradient based on time of day
    let gradient;
    if (hour >= 5 && hour < 12) {
        gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (hour >= 12 && hour < 17) {
        gradient = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else if (hour >= 17 && hour < 21) {
        gradient = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    } else {
        gradient = 'linear-gradient(135deg, #2e1065 0%, #1e3a8a 100%)';
    }

    bgImage.style.background = gradient;
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize background
    updateBackground();

    // Get current role and switch to appropriate dashboard
    const currentRole = getCurrentRole();
    switchDashboard(currentRole);

    // Update background every hour
    setInterval(updateBackground, 3600000);
});

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
    // ESC key closes modal
    if (e.key === 'Escape' && loginModal.classList.contains('active')) {
        closeModal();
    }
});