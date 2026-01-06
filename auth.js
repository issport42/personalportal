// auth.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    let usersData = { users: [] };

    // Загружаем данные пользователей
    async function loadUsers() {
        try {
            const response = await fetch('users.json');
            if (!response.ok) throw new Error('Файл users.json не найден');
            usersData = await response.json();
            
            // Проверяем структуру данных
            if (!usersData.users || !Array.isArray(usersData.users)) {
                console.warn('Некорректная структура users.json, используем стандартные данные');
                usersData.users = [
                    {
                        username: "islom23",
                        password: "islom.23",
                        displayName: "Islom",
                        sites: []
                    },
                    {
                        username: "humora16",
                        password: "humora.16",
                        displayName: "Humora",
                        sites: []
                    }
                ];
            }
        } catch (error) {
            console.error('Ошибка загрузки users.json:', error);
            // Резервные данные
            usersData.users = [
                {
                    username: "islom23",
                    password: "islom.23",
                    displayName: "Islom",
                    sites: []
                },
                {
                    username: "humora16",
                    password: "humora.16",
                    displayName: "Humora",
                    sites: []
                }
            ];
        }
    }

    // Функция для показа сообщения об ошибке
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.color = '#ef4444';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // Функция для успешного входа
    function loginSuccess(user) {
        // Сохраняем данные пользователя в localStorage
        const userData = {
            username: user.username,
            displayName: user.displayName,
            sites: user.sites || []
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Показываем сообщение об успехе
        errorMessage.textContent = `✅ Добро пожаловать, ${user.displayName || user.username}!`;
        errorMessage.style.color = '#10b981';
        errorMessage.style.display = 'block';
        
        // Добавляем анимацию успеха
        loginForm.classList.add('success');
        
        // Показываем welcome сообщение на 1.5 секунды, затем перенаправляем
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 1500);
    }

    // Обработчик отправки формы
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;
        
        // Проверяем заполнение полей
        if (!username || !password) {
            showError('⚠️ Пожалуйста, заполните все поля');
            return;
        }
        
        // Убеждаемся, что данные загружены
        if (usersData.users.length === 0) {
            await loadUsers();
        }
        
        // Ищем пользователя
        const user = usersData.users.find(u => u.username === username);
        
        if (!user) {
            showError('❌ Пользователь не найден');
            return;
        }
        
        if (user.password !== password) {
            showError('❌ Неверный пароль');
            return;
        }
        
        // Если выбрано "Запомнить меня"
        if (rememberMe) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }
        
        // Успешная авторизация
        loginSuccess(user);
    });

    // Загружаем данные при загрузке страницы
    loadUsers();

    // Проверяем, есть ли сохраненный пользователь для автозаполнения
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('remember').checked = true;
        document.getElementById('password').focus();
    }
    
    // Добавляем обработчики для улучшения UX
    document.getElementById('username').addEventListener('input', function() {
        if (errorMessage.style.display === 'block') {
            errorMessage.style.display = 'none';
        }
    });
    
    document.getElementById('password').addEventListener('input', function() {
        if (errorMessage.style.display === 'block') {
            errorMessage.style.display = 'none';
        }
    });
    
    // Горячие клавиши
    document.addEventListener('keydown', function(e) {
        // Enter в поле пароля для отправки формы
        if (e.key === 'Enter' && document.activeElement === document.getElementById('password')) {
            loginForm.requestSubmit();
        }
        
        // Alt + U для фокуса на логин
        if (e.altKey && e.key === 'u') {
            e.preventDefault();
            document.getElementById('username').focus();
        }
        
        // Alt + P для фокуса на пароль
        if (e.altKey && e.key === 'p') {
            e.preventDefault();
            document.getElementById('password').focus();
        }
    });
});