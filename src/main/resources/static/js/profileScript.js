document.addEventListener('DOMContentLoaded', function() {
    // ===== Элементы профиля =====
    const editBtn = document.getElementById('editProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const profileView = document.getElementById('profileView');
    const profileEdit = document.getElementById('profileEdit');
    const avatar = document.getElementById('userPhoto');
    const photoInput = document.getElementById('photoInput');
    const fileNameUserSpan = document.getElementById('fileName');
    const wrapper = avatar ? avatar.parentElement : null;

    // ===== Элементы формы поста =====
    const postForm = document.getElementById('postForm');
    const postImage = document.getElementById('postImage');
    const fileInput = document.getElementById('postImage');
    const fileNameSpan = document.getElementById('selectedImageName');
    const postCaption = document.getElementById('postCaption');
    const postDescription = document.getElementById('postDescription');
    const toastEl = document.getElementById('fileSizeToast');
    const bsToast = toastEl ? new bootstrap.Toast(toastEl, { delay: 3000 }) : null;

    // ===== Лайтбокс =====
    const photoModalEl = document.getElementById('photoModal');
    const photoModalImg = document.getElementById('photoModalImg');
    let photoModal = null;

    if (photoModalEl && photoModalImg) {
        photoModal = new bootstrap.Modal(photoModalEl);

        document.body.addEventListener('click', (e) => {
            let src = null;

            // Аватар
            if (e.target.id === 'userPhoto') {
                src = e.target.src;
            }

            // Картинки постов
            const postImg = e.target.closest('#postsContainer img');
            if (postImg) {
                src = postImg.src;
            }

            if (src) {
                photoModalImg.src = src;
                photoModal.show();
            }
        });

        // При закрытии сбрасываем src
        photoModalEl.addEventListener('hidden.bs.modal', () => {
            setTimeout(() => photoModalImg.src = '', 50);
        });
    }

    // ===== Валидация формы поста =====
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            let errorMessage = "";

            if (!postImage.files.length) {
                errorMessage = "Пожалуйста, выберите изображение!";
            } else {
                const file = postImage.files[0];
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                const maxSize = 20 * 1024 * 1024; // 20MB
                
                // Проверка типа файла
                if (!allowedTypes.includes(file.type)) {
                    errorMessage = "Пожалуйста, выберите файл в формате JPEG, PNG или GIF!";
                }
                // Проверка размера файла (опционально)
                else if (file.size > maxSize) {
                    errorMessage = "Размер файла не должен превышать 20MB!";
                }
                // Если все проверки прошли успешно, проверяем остальные поля
                else if (postCaption && postCaption.value.length > 250) {
                    errorMessage = "Подпись не может быть более 250 символов!";
                } else if (postDescription && postDescription.value.length > 1000) {
                    errorMessage = "Описание не может быть более 1000 символов!";
                }
            }

            if (errorMessage) {
                e.preventDefault();
                if (bsToast && toastEl) {
                    toastEl.querySelector('.toast-body').textContent = errorMessage;
                    bsToast.show();
                }
            }
        });
    }

    if (profileEdit){
        profileEdit.addEventListener('submit', function(e) {
            let errorMessage = "";

            if (!photoInput.files.length) {
                errorMessage = "Пожалуйста, выберите изображение!";
            } else {
                const file = photoInput.files[0];
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                const maxSize = 20 * 1024 * 1024; // 20MB
                
                // Проверка типа файла
                if (!allowedTypes.includes(file.type)) {
                    errorMessage = "Пожалуйста, выберите файл в формате JPEG, PNG или GIF!";
                }
                // Проверка размера файла 
                else if (file.size > maxSize) {
                    errorMessage = "Размер файла не должен превышать 20MB!";
                }
            }

            if (errorMessage) {
                e.preventDefault();
                if (bsToast && toastEl) {
                    toastEl.querySelector('.toast-body').textContent = errorMessage;
                    bsToast.show();
                }
            }
        });
    }

    if (photoInput && fileNameUserSpan){
        photoInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileNameUserSpan.textContent = this.files[0].name;
            } else {
                fileNameUserSpan.textContent = "Файл не выбран";
            }
        });
    }

    // ===== Показ имени выбранного файла =====
    if (fileInput && fileNameSpan) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileNameSpan.textContent = this.files[0].name;
            } else {
                fileNameSpan.textContent = "Файл не выбран";
            }
        });
    }

    // ===== Класс loaded для аватара =====
    if (avatar) {
        if (avatar.complete) {
            avatar.classList.add("loaded");
        } else {
            avatar.addEventListener("load", () => avatar.classList.add("loaded"));
        }
    }

    // ===== Редактирование профиля =====
    if (editBtn && cancelBtn && profileView && profileEdit) {
        editBtn.addEventListener('click', () => {
            profileView.classList.add('d-none');
            profileEdit.classList.remove('d-none');
            editBtn.classList.add('d-none');
        });

        cancelBtn.addEventListener('click', () => {
            profileView.classList.remove('d-none');
            profileEdit.classList.add('d-none');
            editBtn.classList.remove('d-none');
        });
    }

    // ===== Автоскрытие других тостов =====
    const toast = document.querySelector('.toast');
    if (toast) {
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
        }, 5000);
    }

    // ===== Инициализация тултипов =====
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el => new bootstrap.Tooltip(el));

    // ===== Открытие кнопки more =====
    document.body.addEventListener('click', function(e) {
        const btn = e.target.closest('.more-btn');
        const menu = btn ? btn.nextElementSibling : null;

        if (btn && menu) {
            menu.classList.toggle('hidden'); // показываем/скрываем меню
        } else {
            // Закрываем все открытые меню, если клик вне кнопки
            document.querySelectorAll('.more-menu').forEach(m => m.classList.add('hidden'));
        }
    });
});

// ===== Проверка размера файла =====
function validateFileSize(input) {
    const file = input.files[0];
    if (!file) return;

    const maxSize = 20 * 1024 * 1024; // 20MB

    if (file.size > maxSize) {
        input.value = "";

        const toastEl = document.getElementById('fileSizeToast');
        if (toastEl) {
            const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
            toast.show();
        }
    }
}