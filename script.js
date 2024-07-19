let score = parseInt(localStorage.getItem('score')) || 0;
let pointsPerClick = parseInt(localStorage.getItem('pointsPerClick')) || 1;
let autoClickerIncome = parseInt(localStorage.getItem('autoClickerIncome')) || 0;
let upgrade1Cost = parseInt(localStorage.getItem('upgrade1Cost')) || 10;
let upgrade2Cost = parseInt(localStorage.getItem('upgrade2Cost')) || 100;
let autoClickerCost = parseInt(localStorage.getItem('autoClickerCost')) || 500;
let lastActive = parseInt(localStorage.getItem('lastActive')) || Date.now();
let autoClickerExpiry = parseInt(localStorage.getItem('autoClickerExpiry')) || 0;
let autoClickerInterval = null;

const scoreElement = document.getElementById('score');
const incomeElement = document.getElementById('income');
const pointsPerClickElement = document.getElementById('points-per-click');
const clickableCoin = document.getElementById('clickable-coin');
const shopButton = document.getElementById('shop-button');
const shop = document.getElementById('shop');
const closeShopButton = document.getElementById('close-shop-button');
const upgrade1Button = document.getElementById('upgrade1-button');
const upgrade2Button = document.getElementById('upgrade2-button');
const autoClickerButton = document.getElementById('auto-clicker-button');
const leaderboardButton = document.getElementById('leaderboard-button');
const leaderboard = document.getElementById('leaderboard');
const closeLeaderboardButton = document.getElementById('close-leaderboard-button');
const leaderboardEntries = document.getElementById('leaderboard-entries');

// Обновляем счет и доход на основе времени
updateScore();
applyOfflineEarnings();

clickableCoin.addEventListener('click', () => {
    score += pointsPerClick;
    showCoinPopup(pointsPerClick);
    updateScore();
});

shopButton.addEventListener('click', () => {
    shop.classList.remove('hidden');
    shop.style.display = 'block';
});

closeShopButton.addEventListener('click', () => {
    shop.classList.add('hidden');
    shop.style.display = 'none';
});

leaderboardButton.addEventListener('click', () => {
    leaderboard.classList.remove('hidden');
    leaderboard.style.display = 'block';
    updateLeaderboard();
});

closeLeaderboardButton.addEventListener('click', () => {
    leaderboard.classList.add('hidden');
    leaderboard.style.display = 'none';
});

upgrade1Button.addEventListener('click', () => {
    if (score >= upgrade1Cost) {
        score -= upgrade1Cost;
        pointsPerClick++;
        upgrade1Cost *= 2;
        upgrade1Button.textContent = `Upgrade 1 (Cost: ${upgrade1Cost}) - +1 per click`;
        updateScore();
    } else {
        alert('Not enough points for upgrade!');
    }
});

upgrade2Button.addEventListener('click', () => {
    if (score >= upgrade2Cost) {
        score -= upgrade2Cost;
        pointsPerClick += 5;
        upgrade2Cost *= 2;
        upgrade2Button.textContent = `Upgrade 2 (Cost: ${upgrade2Cost}) - +5 per click`;
        updateScore();
    } else {
        alert('Not enough points for upgrade!');
    }
});

autoClickerButton.addEventListener('click', () => {
    if (score >= autoClickerCost) {
        score -= autoClickerCost;
        autoClickerIncome += 200;
        autoClickerCost *= 2;
        autoClickerButton.textContent = `Auto-Clicker (Cost: ${autoClickerCost}) - +${autoClickerIncome}/hour for 3 hours`;
        autoClickerExpiry = Date.now() + 3 * 60 * 60 * 1000; // 3 hours from now
        updateScore();
        startAutoClicker();
    } else {
        alert('Not enough points for auto-clicker!');
    }
});

function updateScore() {
    scoreElement.textContent = score;
    incomeElement.textContent = `Income: ${autoClickerIncome}/hour`;
    pointsPerClickElement.textContent = `Points per Click: ${pointsPerClick}`;
    localStorage.setItem('score', score);
    localStorage.setItem('pointsPerClick', pointsPerClick);
    localStorage.setItem('autoClickerIncome', autoClickerIncome);
    localStorage.setItem('upgrade1Cost', upgrade1Cost);
    localStorage.setItem('upgrade2Cost', upgrade2Cost);
    localStorage.setItem('autoClickerCost', autoClickerCost);
    localStorage.setItem('autoClickerExpiry', autoClickerExpiry);
}

function showCoinPopup(points) {
    const popup = document.createElement('div');
    popup.className = 'coin-popup';
    popup.textContent = `+${points}`;
    document.body.appendChild(popup);
    popup.style.left = `${clickableCoin.getBoundingClientRect().left + 20}px`;
    popup.style.top = `${clickableCoin.getBoundingClientRect().top - 20}px`;
    setTimeout(() => {
        popup.remove();
    }, 1000);
}

function showNotification(message, coinCount) {
    const notification = document.createElement('div');
    notification.className = 'notification';

    const coins = Math.min(coinCount, 10); // Ограничиваем количество монет до 10
    let coinHtml = '';
    for (let i = 0; i < coins; i++) {
        coinHtml += '<img src="coin.png" class="coin-icon" />';
    }
    
    notification.innerHTML = `${message} ${coinHtml}`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 5000); // Удаляем уведомление через 5 секунд
}

function startAutoClicker() {
    if (autoClickerIncome > 0 && Date.now() < autoClickerExpiry) {
        if (autoClickerInterval === null) {
            autoClickerInterval = setInterval(() => {
                score += autoClickerIncome / 60;
                updateScore();
            }, 60000);
        }
    } else {
        clearInterval(autoClickerInterval);
        autoClickerInterval = null;
        autoClickerIncome = 0;
        localStorage.setItem('autoClickerIncome', autoClickerIncome);
    }
}

function applyOfflineEarnings() {
    const now = Date.now();
    let earnedCoins = 0;

    if (now < autoClickerExpiry) {
        const elapsedHours = (now - lastActive) / (1000 * 60 * 60);
        earnedCoins = Math.floor(autoClickerIncome * elapsedHours);
        score += earnedCoins;
    }

    lastActive = now;
    localStorage.setItem('lastActive', lastActive);
    localStorage.setItem('score', score);

    // Показываем уведомление о заработанных монетах
    if (earnedCoins > 0) {
        showNotification(`You've earned ${earnedCoins} coins while you were away!`, earnedCoins);
    }

    startAutoClicker();
}

function updateLeaderboard() {
    fetch('/path/to/telegram/api/leaderboard')
        .then(response => response.json())
        .then(data => {
            leaderboardEntries.innerHTML = '';
            data.forEach(entry => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'leaderboard-entry';
                entryDiv.innerHTML = `
                    <img src="${entry.avatar}" alt="Avatar" class="leaderboard-avatar">
                    <span class="leaderboard-name">${entry.name}</span>
                    <span class="leaderboard-score">${entry.score}</span>
                `;
                leaderboardEntries.appendChild(entryDiv);
            });
        });
}
