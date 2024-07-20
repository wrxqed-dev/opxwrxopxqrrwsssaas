let score = parseInt(localStorage.getItem('score')) || 0;
let pointsPerClick = parseInt(localStorage.getItem('pointsPerClick')) || 1;
let autoClickerIncome = parseFloat(localStorage.getItem('autoClickerIncome')) || 0;
let autoClickerIncrement = parseFloat(localStorage.getItem('autoClickerIncrement')) || 100; // Фиксированное значение увеличения дохода
let upgrade1Cost = parseInt(localStorage.getItem('upgrade1Cost')) || 10;
let upgrade2Cost = parseInt(localStorage.getItem('upgrade2Cost')) || 100;
let autoClickerCost = parseInt(localStorage.getItem('autoClickerCost')) || 500;
let upgrade1Level = parseInt(localStorage.getItem('upgrade1Level')) || 0;
let upgrade2Level = parseInt(localStorage.getItem('upgrade2Level')) || 0;
let lastActive = parseInt(localStorage.getItem('lastActive')) || Date.now();
let autoClickerExpiry = parseInt(localStorage.getItem('autoClickerExpiry')) || 0;
let autoClickerInterval = null;

const scoreElement = document.getElementById('score');
const incomeElement = document.getElementById('income');
const pointsPerClickElement = document.getElementById('points-per-click');
const clickableCoin = document.getElementById('clickable-coin');
const shopButton = document.getElementById('shop-button');
const shop = document.getElementById('shop');
const leaderboardButton = document.getElementById('leaderboard-button');
const leaderboard = document.getElementById('leaderboard');
const upgrade1Button = document.getElementById('upgrade1-button');
const upgrade2Button = document.getElementById('upgrade2-button');
const autoClickerButton = document.getElementById('auto-clicker-button');
const closeShopButton = document.getElementById('close-shop-button');
const closeLeaderboardButton = document.getElementById('close-leaderboard-button');
const leaderboardEntries = document.getElementById('leaderboard-entries');

function updateScore() {
    scoreElement.textContent = Math.round(score);
    localStorage.setItem('score', score);
}

function updateIncome() {
    const income = autoClickerIncome.toFixed(1);
    incomeElement.textContent = `Income: ${income}/hour`;
    localStorage.setItem('autoClickerIncome', autoClickerIncome);
}

function updatePointsPerClick() {
    pointsPerClickElement.textContent = `Points per Click: ${pointsPerClick}`;
    localStorage.setItem('pointsPerClick', pointsPerClick);
}

function addCoins(amount) {
    score += amount;
    updateScore();
    showCoinPopup(amount);
}

function showCoinPopup(amount) {
    const coinPopup = document.createElement('div');
    coinPopup.classList.add('coin-popup');
    coinPopup.textContent = `+${amount}`;
    document.body.appendChild(coinPopup);

    setTimeout(() => {
        coinPopup.remove();
    }, 1000);
}

function updateLastActive() {
    lastActive = Date.now();
    localStorage.setItem('lastActive', lastActive);
}

clickableCoin.addEventListener('click', () => {
    addCoins(pointsPerClick);
    updateLastActive();
});

shopButton.addEventListener('click', () => {
    shop.classList.add('active');
    updateShopButtons();
});

leaderboardButton.addEventListener('click', () => {
    leaderboard.classList.add('active');
    updateLeaderboard();
});

closeShopButton.addEventListener('click', () => {
    shop.classList.remove('active');
});

closeLeaderboardButton.addEventListener('click', () => {
    leaderboard.classList.remove('active');
});

function updateShopButtons() {
    upgrade1Button.textContent = `Upgrade 1 (Cost: ${upgrade1Cost}) - +1 per click (Level: ${upgrade1Level})`;
    upgrade2Button.textContent = `Upgrade 2 (Cost: ${upgrade2Cost}) - +5 per click (Level: ${upgrade2Level})`;
    autoClickerButton.textContent = `Auto-Clicker (Cost: ${autoClickerCost}) - +${autoClickerIncrement}/hour for 3 hours`;
}

upgrade1Button.addEventListener('click', () => {
    if (score >= upgrade1Cost) {
        score -= upgrade1Cost;
        pointsPerClick += 1;
        upgrade1Level += 1;
        upgrade1Cost = Math.floor(upgrade1Cost * 1.5);
        updateScore();
        updatePointsPerClick();
        localStorage.setItem('upgrade1Cost', upgrade1Cost);
        localStorage.setItem('upgrade1Level', upgrade1Level);
        showNotification('Upgrade 1 purchased!');
        updateShopButtons();
        updateLastActive();
    } else {
        showNotification('Not enough coins!');
    }
});

upgrade2Button.addEventListener('click', () => {
    if (score >= upgrade2Cost) {
        score -= upgrade2Cost;
        pointsPerClick += 5;
        upgrade2Level += 1;
        upgrade2Cost = Math.floor(upgrade2Cost * 1.5);
        updateScore();
        updatePointsPerClick();
        localStorage.setItem('upgrade2Cost', upgrade2Cost);
        localStorage.setItem('upgrade2Level', upgrade2Level);
        showNotification('Upgrade 2 purchased!');
        updateShopButtons();
        updateLastActive();
    } else {
        showNotification('Not enough coins!');
    }
});

autoClickerButton.addEventListener('click', () => {
    if (score >= autoClickerCost) {
        score -= autoClickerCost;
        autoClickerIncome += autoClickerIncrement;
        autoClickerCost = autoClickerCost * 2; // Увеличение стоимости автокликера вдвое
        autoClickerExpiry = Date.now() + (3 * 60 * 60 * 1000);
        updateScore();
        updateIncome();
        localStorage.setItem('autoClickerCost', autoClickerCost);
        localStorage.setItem('autoClickerIncrement', autoClickerIncrement);
        localStorage.setItem('autoClickerExpiry', autoClickerExpiry);
        showNotification('Auto-Clicker purchased!');
        updateShopButtons();
        updateLastActive();
        startAutoClicker();
    } else {
        showNotification('Not enough coins!');
    }
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

function updateLeaderboard() {
    leaderboardEntries.innerHTML = '';

    const entries = JSON.parse(localStorage.getItem('leaderboard')) || [];
    entries.sort((a, b) => b.score - a.score);

    entries.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.classList.add('leaderboard-entry');
        entryElement.innerHTML = `
            <img src="${entry.avatar}" alt="Avatar" class="leaderboard-avatar">
            <span class="leaderboard-name">${entry.name}</span>
            <span class="leaderboard-score">${entry.score}</span>
        `;
        leaderboardEntries.appendChild(entryElement);
    });
}

function startAutoClicker() {
    if (autoClickerIncome > 0 && autoClickerExpiry > Date.now()) {
        clearInterval(autoClickerInterval);
        autoClickerInterval = setInterval(() => {
            if (autoClickerExpiry <= Date.now()) {
                clearInterval(autoClickerInterval);
                autoClickerIncome = 0;
                updateIncome();
            } else {
                const coinsToAdd = parseFloat((autoClickerIncome / 3600).toFixed(1));
                addCoins(coinsToAdd);
                updateLastActive();
            }
        }, 1000);
    }
}

function resumeAutoClicker() {
    const timePassed = Math.min(3 * 60 * 60 * 1000, Date.now() - lastActive);
    const coinsToAdd = parseFloat(((autoClickerIncome / 3600) * (timePassed / 1000)).toFixed(1));
    if (!isNaN(coinsToAdd)) {
        addCoins(coinsToAdd);
        showNotification(`You earned ${coinsToAdd} coins while you were away.`);
    }
    startAutoClicker();
}

document.addEventListener('DOMContentLoaded', () => {
    updateScore();
    updateIncome();
    updatePointsPerClick();
    resumeAutoClicker();
});

window.addEventListener('beforeunload', updateLastActive);
