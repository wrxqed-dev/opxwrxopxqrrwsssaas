let score = parseInt(localStorage.getItem('score')) || 0;
let pointsPerClick = parseInt(localStorage.getItem('pointsPerClick')) || 1;
let incomePerHour = parseInt(localStorage.getItem('incomePerHour')) || 0;
let autoClickerActive = localStorage.getItem('autoClickerActive') === 'true';

const scoreElement = document.getElementById('score');
const pointsPerClickElement = document.getElementById('points-per-click');
const incomeElement = document.getElementById('income');
const clickableCoin = document.getElementById('clickable-coin');
const shopButton = document.getElementById('shop-button');
const leaderboardButton = document.getElementById('leaderboard-button');
const closeShopButton = document.getElementById('close-shop-button');
const closeLeaderboardButton = document.getElementById('close-leaderboard-button');
const shop = document.getElementById('shop');
const leaderboard = document.getElementById('leaderboard');
const leaderboardEntries = document.getElementById('leaderboard-entries');

// Обновление баллов и дохода
function updateScore() {
    scoreElement.textContent = score;
    localStorage.setItem('score', score);
}

function updatePointsPerClick() {
    pointsPerClickElement.textContent = `Points per Click: ${pointsPerClick}`;
    localStorage.setItem('pointsPerClick', pointsPerClick);
}

function updateIncome() {
    incomeElement.textContent = `Income: ${incomePerHour}/hour`;
    localStorage.setItem('incomePerHour', incomePerHour);
}

// Функция для отображения всплывающих сообщений
function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'notification';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 2000);
}

// Обработчик клика по монете
clickableCoin.addEventListener('click', () => {
    score += pointsPerClick;
    updateScore();
    showPopup(`+${pointsPerClick}`);
});

// Обработчики кнопок
shopButton.addEventListener('click', () => {
    shop.classList.remove('hidden');
});

leaderboardButton.addEventListener('click', () => {
    leaderboard.classList.remove('hidden');
    fetchLeaderboard();
});

closeShopButton.addEventListener('click', () => {
    shop.classList.add('hidden');
});

closeLeaderboardButton.addEventListener('click', () => {
    leaderboard.classList.add('hidden');
});

// Функция для получения данных лидерборда из JSON-файла
async function fetchLeaderboard() {
    try {
        const response = await fetch('leaderboard.json'); // Путь к вашему JSON-файлу
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();

        leaderboardEntries.innerHTML = '';
        data.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'leaderboard-entry';
            div.innerHTML = `
                <img src="${entry.avatar}" class="leaderboard-avatar" alt="${entry.name}">
                <span class="leaderboard-name">${entry.name}</span>
                <span class="leaderboard-score">${entry.score}</span>
            `;
            leaderboardEntries.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        leaderboardEntries.innerHTML = '<p>Failed to load leaderboard.</p>';
    }
}

// Обработчики для кнопок улучшений и автокликера
document.getElementById('upgrade1-button').addEventListener('click', () => {
    if (score >= 10) {
        score -= 10;
        pointsPerClick += 1;
        updateScore();
        updatePointsPerClick();
        showPopup('Upgrade 1 purchased!');
    } else {
        showPopup('Not enough coins!');
    }
});

document.getElementById('upgrade2-button').addEventListener('click', () => {
    if (score >= 100) {
        score -= 100;
        pointsPerClick += 5;
        updateScore();
        updatePointsPerClick();
        showPopup('Upgrade 2 purchased!');
    } else {
        showPopup('Not enough coins!');
    }
});

document.getElementById('auto-clicker-button').addEventListener('click', () => {
    if (score >= 500) {
        score -= 500;
        autoClickerActive = true;
        localStorage.setItem('autoClickerActive', 'true');
        updateScore();
        showPopup('Auto-Clicker purchased!');
        setInterval(() => {
            if (autoClickerActive) {
                score += 200;
                updateScore();
            }
        }, 3600000); // every hour
    } else {
        showPopup('Not enough coins!');
    }
});

// Инициализация
if (autoClickerActive) {
    setInterval(() => {
        if (autoClickerActive) {
            score += 200;
            updateScore();
        }
    }, 3600000); // every hour
}

updateScore();
updatePointsPerClick();
updateIncome();

updateScore();
updatePointsPerClick();
updateIncome();
