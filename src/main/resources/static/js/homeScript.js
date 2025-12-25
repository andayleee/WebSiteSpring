document.addEventListener('DOMContentLoaded', () => {
    // Initialize lightbox functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            openLightbox(imgSrc);
        });
    });
    function openLightbox(src) {
        const title = event.currentTarget.getAttribute('data-title');

        // Блокируем скролл страницы
        document.body.style.overflow = 'hidden';

        const lightbox = document.createElement('div');
        lightbox.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        lightbox.innerHTML = `
            <div class="relative max-w-4xl w-full">
                <img src="${src}" class="w-full max-h-screen mx-auto" style="max-height: 80vh; object-fit: contain;">
                <div class="bg-white p-4 mt-2 rounded-b-lg">
                    <h3 class="text-xl font-bold text-gray-800">${event.currentTarget.querySelector('h3').textContent}</h3>
                    <p class="text-gray-600">${event.currentTarget.querySelector('p').textContent}</p>
                </div>
                <button class="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2">
                    <i data-feather="x"></i>
                </button>
            </div>
        `;

        document.body.appendChild(lightbox);
        feather.replace();

        // Закрытие лайтбокса и разблокировка скролла
        lightbox.querySelector('button').addEventListener('click', () => {
            lightbox.remove();
            document.body.style.overflow = ''; // возвращаем прокрутку
        });
    }
});