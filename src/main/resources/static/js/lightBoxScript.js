document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    // ----------------------
    // На контейнере с картинкой должен быть класс gallery-item, а также же рядом теги h3 и p для вывода под картинкой
    // ----------------------
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            openLightbox(imgSrc);
        });
    });
    function openLightbox(src) {
        // Блокируем скролл страницы
        document.body.style.overflow = 'hidden';

        const lightbox = document.createElement('div');
        lightbox.style.position = 'fixed';
        lightbox.style.inset = '0';
        lightbox.style.zIndex = '50';
        lightbox.style.display = 'flex';
        lightbox.style.alignItems = 'center';
        lightbox.style.justifyContent = 'center';
        lightbox.style.padding = '1rem';
        lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

        // Preloader
        const preloader = document.createElement('div');
        preloader.className = 'spinner border-4 border-t-indigo-600 border-gray-200 rounded-full w-16 h-16 animate-spin';
        lightbox.appendChild(preloader);

        // Контейнер для картинки и текста
        const content = document.createElement('div');
        content.className = 'relative max-w-4xl w-full hidden'; // скрыт пока картинка не загрузится
        content.innerHTML = `           
            <div id="lightboxContent" class="flex flex-col md:flex-row items-start md:items-stretch max-w-5xl mx-auto gap-4">
                <!-- Фото -->
                <div class="flex-shrink-0">
                    <img src="${src}" 
                        id="lightboxImg"
                        class="block max-h-[80vh] w-auto mx-auto"
                        style="object-fit: contain;">
                </div>

                <!-- Блок с инфо -->
                <div class="bg-white p-4 rounded-lg w-full md:w-1/2">
                    <h3 class="text-xl font-bold text-gray-800">
                        ${event.currentTarget.querySelector('h3').textContent}
                    </h3>
                    <p class="text-gray-600 mt-2">
                        ${event.currentTarget.querySelector('p').textContent}
                    </p>
                </div>

                <!-- Кнопка закрытия -->
                <button class="absolute top-1 left-1 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2" id="closeLightboxBtn">
                    <i data-feather="x"></i>
                </button>
            </div>
            `
        ;
        lightbox.appendChild(content);
        document.body.appendChild(lightbox);
        feather.replace();

        // Когда картинка загрузилась — скрываем прелоадер, показываем контент
        const img = content.querySelector('#lightboxImg');
        if (img.complete) {
            preloader.style.display = 'none';
            content.classList.remove('hidden');
        } else {
            img.addEventListener('load', () => {
                preloader.style.display = 'none';
                content.classList.remove('hidden');
            });
            img.addEventListener('error', () => {
                preloader.style.display = 'none';
                content.classList.remove('hidden');
            });
        }

        // Закрытие лайтбокса
        content.querySelector('#closeLightboxBtn').addEventListener('click', () => {
            lightbox.remove();
            document.body.style.overflow = ''; // возвращаем прокрутку
        });
    }

});