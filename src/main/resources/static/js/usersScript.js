document.addEventListener('DOMContentLoaded', () => {
    // Initialize lightbox functionality
    const preloader = document.getElementById('usersPreloader');
    const users = document.querySelectorAll('#users img');
    const usersSearchBtn = document.getElementById("usersSearchBtn");
    let loadedCount = 0;
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('usersSearchBtn');
    const usersPreloader = document.getElementById('usersPreloader');
    const randomUsers = document.getElementById('randomUsers');
    const searchResults = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const defaultState = document.getElementById('defaultState');
    const searchState = document.getElementById('searchState');
    const backToRandom = document.getElementById('backToRandom');
    const backBtn = document.getElementById('backBtn');
    const token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const header = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    // ===============================
    // Прелодер
    // ===============================
    PreloaderShow(preloader,users,loadedCount);
    
    // ===============================
    // Поиск пользователей
    // ===============================
    usersSearchBtn.addEventListener("click", () => {
        
    });

     let searchTimeout;
    let currentSearchQuery = '';
    
    // Функция для показа прелоадера
    function showPreloader() {
        preloader.style.display = 'flex';
    }
    
    // Функция для скрытия прелоадера
    function hidePreloader() {
        preloader.style.display = 'none';
    }
    
    // Функция для выполнения поиска
    function performSearch(query) {
        if (!query || query.trim().length < 2) {
            resetToRandom();
            return;
        }
        
        currentSearchQuery = query.trim();
        showPreloader();
        noResults.classList.add('hidden');
        
        // AJAX запрос
        fetch(`/users/search?query=${encodeURIComponent(currentSearchQuery)}&limit=20`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                [header]: token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(users => {
            hidePreloader();
            displaySearchResults(users, currentSearchQuery);
        })
        .catch(error => {
            console.error('Error:', error);
            hidePreloader();
            showError();
        });
    }
    
    // Функция для отображения результатов поиска
    function displaySearchResults(users, query) {
        // Переключаем состояния
        defaultState.classList.add('hidden');
        searchState.classList.remove('hidden');
        backToRandom.classList.remove('hidden');
        
        // Скрываем случайных пользователей
        randomUsers.classList.add('hidden');
        
        // Показываем контейнер для результатов
        searchResults.classList.remove('hidden');
        
        // Очищаем предыдущие результаты
        searchResults.innerHTML = '';
        
        if (users.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }
        
        // Генерируем HTML для каждого пользователя
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'group relative p-6 border-b hover:bg-gray-50 transition';
            userElement.innerHTML = `
                <a href="/user/${user.id}" class="flex items-center">
                    <img src="${user.photoPath}" alt="${user.name}" 
                         class="w-12 h-12 object-cover rounded-full mr-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">${escapeHtml(user.name)}</h3>
                        <p class="text-gray-600 text-sm">${escapeHtml(user.email)}</p>
                    </div>
                </a>
            `;
            searchResults.appendChild(userElement);
        });
    }
    
    // Функция для возврата к случайным пользователям
    function resetToRandom() {
        defaultState.classList.remove('hidden');
        searchState.classList.add('hidden');
        backToRandom.classList.add('hidden');
        
        randomUsers.classList.remove('hidden');
        searchResults.classList.add('hidden');
        noResults.classList.add('hidden');
        
        searchInput.value = '';
        currentSearchQuery = '';
    }
    
    // Функция для показа ошибки
    function showError() {
        const errorElement = document.createElement('div');
        errorElement.className = 'p-8 text-center';
        errorElement.innerHTML = `
            <i data-feather="alert-circle" class="w-16 h-16 text-red-300 mx-auto mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">Ошибка поиска</h3>
            <p class="text-gray-500">Попробуйте еще раз</p>
        `;
        feather.replace();
        
        searchResults.innerHTML = '';
        searchResults.appendChild(errorElement);
        searchResults.classList.remove('hidden');
    }
    
    // Функция для экранирования HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Обработчик клика по кнопке поиска
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });
    
    // Обработчик нажатия Enter в поле поиска
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
    
    // Обработчик ввода с задержкой (для поиска по мере ввода)
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        clearTimeout(searchTimeout);
        
        if (query.length >= 2) {
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 800);
        } else if (query.length === 0) {
            resetToRandom();
        }
    });
    
    // Обработчик кнопки "Назад"
    backBtn.addEventListener('click', resetToRandom);
    
    // Инициализация feather icons
    feather.replace();
});

function PreloaderShow(preloader, users, loadedCount){
    if(users.length === 0){
        preloader.style.display = 'none';
    } else {
        users.forEach(img => {
            if(img.complete) {
                loadedCount++;
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === users.length) {
                        preloader.style.display = 'none';
                    }
                });
                img.addEventListener('error', () => {
                    loadedCount++;
                    if (loadedCount === users.length) {
                        preloader.style.display = 'none';
                    }
                });
            }
        });

        if(loadedCount === users.length){
            preloader.style.display = 'none';
        }
    }
}