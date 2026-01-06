// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    const userData = localStorage.getItem('currentUser');
    
    if (!userData) {
        window.location.href = 'auth.html';
        return;
    }
    
    const user = JSON.parse(userData);
    
    // Устанавливаем данные пользователя
    updateUserInterface(user);
    
    // Инициализация темы и времени
    initThemeAndTime();
    
    // Показываем сайты
    displayUserSites(user.sites);
    
    // Обработчики событий
    setupEventHandlers();
    
    // Добавляем недостающие иконки
    loadMissingIcons();
});

function updateUserInterface(user) {
    document.getElementById('usernameDisplay').textContent = user.username;
    document.getElementById('welcomeName').textContent = user.displayName || user.username;
    document.getElementById('portalTitle').textContent = `Portal | ${user.displayName || user.username}`;
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

function displayUserSites(sites) {
    const container = document.getElementById('sitesContainer');
    const countElement = document.getElementById('sitesCount');
    
    if (!sites || sites.length === 0) {
        container.innerHTML = `
            <div class="no-sites">
                <i class="fas fa-inbox"></i>
                <h3>Нет доступных сайтов</h3>
                <p>Обратитесь к администратору</p>
            </div>
        `;
        countElement.textContent = '0';
        return;
    }
    
    countElement.textContent = sites.length;
    
    container.innerHTML = sites.map(site => `
        <div class="site-card">
            <div class="site-header">
                <div class="site-icon" style="background: linear-gradient(135deg, ${site.color || '#6366f1'}, ${site.color2 || '#ec4899'})">
                    <i class="${site.icon || 'fas fa-globe'}"></i>
                </div>
                <div class="site-info">
                    <h3>${site.name}</h3>
                    <p>${getSiteDomain(site.url)}</p>
                </div>
            </div>
            <a href="${site.url}" target="_blank" class="site-link" rel="noopener noreferrer">
                <i class="fas fa-external-link-alt"></i> Перейти
            </a>
        </div>
    `).join('');
}

function getSiteDomain(url) {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return url.replace('https://', '').replace('http://', '').replace('www.', '');
    }
}

function setupEventHandlers() {
    // Выход из системы
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите выйти из системы?')) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('rememberedUser');
            window.location.href = 'auth.html';
        }
    });
    
    // Закрытие welcome сообщения
    const closeBtn = document.getElementById('closeWelcome');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const welcomeSection = document.getElementById('welcomeSection');
            welcomeSection.style.opacity = '0';
            setTimeout(() => {
                welcomeSection.style.display = 'none';
            }, 300);
        });
    }
    
    // Автоматическое скрытие welcome через 8 секунд
    setTimeout(() => {
        const welcomeSection = document.getElementById('welcomeSection');
        if (welcomeSection && welcomeSection.style.display !== 'none') {
            welcomeSection.style.opacity = '0';
            setTimeout(() => {
                welcomeSection.style.display = 'none';
            }, 500);
        }
    }, 8000);
}

function initThemeAndTime() {
    updateTimeAndTheme();
    setInterval(updateTimeAndTheme, 60000); // Обновлять каждую минуту
}

function updateTimeAndTheme() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    // Обновляем время
    document.getElementById('timeDisplay').innerHTML = `
        <i class="fas fa-clock"></i>
        <span>${hours}:${minutes}</span>
    `;
    
    // Устанавливаем тему
    const isDayTime = hours >= 8 && hours < 19;
    const theme = isDayTime ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    
    // Обновляем индикатор темы
    const themeIndicator = document.getElementById('themeIndicator');
    if (isDayTime) {
        themeIndicator.innerHTML = '<i class="fas fa-sun"></i><span>Дневная тема</span>';
        themeIndicator.style.color = '#f59e0b';
    } else {
        themeIndicator.innerHTML = '<i class="fas fa-moon"></i><span>Ночная тема</span>';
        themeIndicator.style.color = '#818cf8';
    }
}

function loadMissingIcons() {
    // Добавляем Canva иконку если её нет
    if (!document.querySelector('.fa-canva')) {
        const style = document.createElement('style');
        style.innerHTML = `
            .fa-canva:before {
                content: "Canva";
                font-weight: 700;
                font-family: 'Segoe UI', sans-serif;
            }
        `;
        document.head.appendChild(style);
    }
}

// Добавляем поддержку горячих клавиш
document.addEventListener('keydown', function(e) {
    // Alt + L для выхода
    if (e.altKey && e.key === 'l') {
        document.getElementById('logoutBtn').click();
    }
    // ESC для закрытия welcome
    if (e.key === 'Escape') {
        const closeBtn = document.getElementById('closeWelcome');
        if (closeBtn) closeBtn.click();
    }
});