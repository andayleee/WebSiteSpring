document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.getElementById('editProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const profileView = document.getElementById('profileView');
    const profileEdit = document.getElementById('profileEdit');
    const photoInput = document.getElementById('photoInput');
    const fileName = document.getElementById('fileName');
    const wrapper = document.getElementById('userPhoto').parentElement;
    const userPhoto = document.getElementById('userPhoto');
    const photoModalImg = document.getElementById('photoModalImg');
    const photoModalEl = document.getElementById('photoModal');
    const avatar = document.getElementById("userPhoto");
    const fileInput = document.getElementById('postImage');
    const fileNameSpan = document.getElementById('selectedImageName');
    const postForm = document.getElementById('postForm');
    const postImage = document.getElementById('postImage');
    const toastEl = document.getElementById('fileSizeToast');
    const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
    const postCaption = document.getElementById('postCaption');
    const postDescription = document.getElementById('postDescription');

    // Валидация полей добавления поста
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            let errorMessage = "";

            if (!postForm.image.files.length) {
                errorMessage = "Пожалуйста, выберите изображение!";
            } else if (postCaption.value.length > 250) {
                errorMessage = "Подпись не может быть более 250 символов!";
            } else if (postDescription.value.length > 1000) {
                errorMessage = "Описание не может быть более 1000 символов!";
            }

            if (errorMessage) {
                e.preventDefault();
                toastEl.querySelector('.toast-body').textContent = errorMessage;
                bsToast.show();
            }
        });
    }

    postForm.addEventListener('submit', function(e) {
        if (!postImage.files.length) {
            e.preventDefault();

            // Меняем текст тоста
            toastEl.querySelector('.toast-body').textContent = "Пожалуйста, выберите изображение!";
            bsToast.show();
        }
    });
    

    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            fileNameSpan.textContent = this.files[0].name;
        } else {
            fileNameSpan.textContent = "Файл не выбран";
        }
    });

    if (avatar.complete) {
      // Если картинка уже в кэше, сразу добавляем класс
      avatar.classList.add("loaded");
    } else {
      // Ждём полной загрузки
      avatar.addEventListener("load", () => {
        avatar.classList.add("loaded");
      });
    }

    if (wrapper && userPhoto && photoModalImg && photoModalEl) {
        const photoModal = new bootstrap.Modal(photoModalEl);

        wrapper.addEventListener('click', () => {
            photoModalImg.src = userPhoto.src;
            photoModal.show();
        });

        console.log("Модальное окно подключено");
    }

    if (editBtn && profileView && profileEdit) {
        editBtn.addEventListener('click', function() {
        profileView.classList.add('d-none');
        profileEdit.classList.remove('d-none');
        editBtn.classList.add('d-none');
        });

        cancelBtn.addEventListener('click', function() {
        profileView.classList.remove('d-none');
        profileEdit.classList.add('d-none');
        editBtn.classList.remove('d-none');
        });
    }

    // Show selected file name
    if (photoInput && fileName) {
        photoInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = 'Файл не выбран';
        }
        });
    }

    // Auto-dismiss toast after 5 seconds
    const toast = document.querySelector('.toast');
    if (toast) {
        setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        }, 5000);
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

function validateFileSize(input) {
    const file = input.files[0];
    if (!file) return;

    const maxSize = 20 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
        input.value = ""; // сброс файла

        const toastEl = document.getElementById('fileSizeToast');
        const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
        toast.show();
    }
}