document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.getElementById('editProfileBtn');
    const editPasswordBtn = document.getElementById('editPasswordBtn');
    const logOutBtn = document.getElementById('logOutBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const saveNewPassword = document.getElementById('saveNewPassword');
    const newPassword = document.getElementById('newPassword');
    const repeatNewPassword = document.getElementById('repeatNewPassword');
    const profileView = document.getElementById('profileView');
    const profileEdit = document.getElementById('profileEdit');
    const avatar = document.getElementById('userPhoto');
    const photoInput = document.getElementById('photoInput');
    const fileNameUserSpan = document.getElementById('fileName');
    const postForm = document.getElementById('postForm');
    const postImage = document.getElementById('postImage');
    const fileInput = document.getElementById('postImage');
    const fileNameSpan = document.getElementById('selectedImageName');
    const postCaption = document.getElementById('postCaption');
    const postDescription = document.getElementById('postDescription');
    const toastEl = document.getElementById('fileSizeToast');
    const bsToast = toastEl ? new bootstrap.Toast(toastEl, { delay: 3000 }) : null;
    const photoModalEl = document.getElementById('photoModal');
    const photoModalImg = document.getElementById('photoModalImg');
    
    
    // Добавлено: элементы для предпросмотра
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewRemoveBtn = document.getElementById('imagePreviewRemoveBtn');
    
    let photoModal = null;

    if (photoModalEl && photoModalImg) {
        photoModal = new bootstrap.Modal(photoModalEl);

        document.body.addEventListener('click', (e) => {
            let src = null;

            if (e.target.id === 'userPostPhoto') {
                
            }else{
                if (e.target.id === 'userPhoto') {
                    src = e.target.src;
                }
                const postImg = e.target.closest('#postsContainer img');
                if (postImg) {
                    src = postImg.src;
                }
                if (src) {
                    photoModalImg.src = src;
                    photoModal.show();
                }
            }
        });

        photoModalEl.addEventListener('hidden.bs.modal', () => {
            setTimeout(() => photoModalImg.src = '', 50);
        });
    }



    //  Валидация формы поста 
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            let errorMessage = "";

            if (!postImage.files.length) {
                if((postCaption && postCaption.value.replaceAll(' ', '').length == 0)&&(postDescription && postDescription.value.replaceAll(' ', '').length == 0)){
                    errorMessage = "В пост необходимо добавить какую-то информацию!";
                }
            } else {
                const file = postImage.files[0];
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                const maxSize = 20 * 1024 * 1024; 
                const minSize = 8; 
                
                if (!allowedTypes.includes(file.type)) {
                    errorMessage = "Пожалуйста, выберите файл в формате JPEG, PNG или GIF!";
                }
                else if (file.size > maxSize) {
                    errorMessage = "Размер файла не должен превышать 20MB!";
                } 
                else if (file.size < minSize) {
                    errorMessage = "Размер файла не должен быть меньше 8B!";
                }
                else if (postCaption && postCaption.value.length > 250) {
                    errorMessage = "Подпись не может быть более 250 символов!";
                } else if (postDescription && postDescription.value.length > 1000) {
                    errorMessage = "Описание не может быть более 1000 символов!";
                }
            }

            if (errorMessage) {
                e.preventDefault();
                showToast(errorMessage,toastEl,bsToast);
            }
        });
    }

    if (profileEdit){
        profileEdit.addEventListener('submit', function(e) {
            let errorMessage = "";

            const file = photoInput.files[0];
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            const maxSize = 20 * 1024 * 1024;
            const minSize = 8; 
            
            if (!allowedTypes.includes(file.type)) {
                errorMessage = "Пожалуйста, выберите файл в формате JPEG, PNG или GIF!";
            }
            else if (file.size > maxSize) {
                errorMessage = "Размер файла не должен превышать 20MB!";
            }
            else if (file.size < minSize) {
                    errorMessage = "Размер файла не должен быть меньше 8B!";
            }


            if (errorMessage) {
                e.preventDefault();
                showToast(errorMessage,toastEl,bsToast);
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

    //  Показ имени выбранного файла и предпросмотр
    if (fileInput && fileNameSpan) {
        fileInput.addEventListener('change', function() {
            previewImage(this); // Вызываем функцию предпросмотра
            
            // Оставляем старое поведение для имени файла (опционально)
            if (this.files && this.files.length > 0) {
                fileNameSpan.textContent = this.files[0].name;
            } else {
                fileNameSpan.textContent = "Файл не выбран";
                // Если файл не выбран, скрываем предпросмотр
                if (imagePreviewContainer) {
                    imagePreviewContainer.classList.add('hidden');
                }
            }
        });
    }

    //  Обработчик кнопки удаления предпросмотра
    if (imagePreviewRemoveBtn) {
        imagePreviewRemoveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            removeImagePreview();
        });
    }

    //  Класс loaded для аватара 
    if (avatar) {
        if (avatar.complete) {
            avatar.classList.add("loaded");
        } else {
            avatar.addEventListener("load", () => avatar.classList.add("loaded"));
        }
    }

    //  Редактирование профиля 
    if (editBtn && cancelBtn && profileView && profileEdit) {
        editBtn.addEventListener('click', () => {
            profileView.classList.add('d-none');
            profileEdit.classList.remove('d-none');
            editPasswordBtn.classList.remove('d-none');
            editBtn.classList.add('d-none');
            logOutBtn.classList.add('d-none');
        });

        cancelBtn.addEventListener('click', () => {
            profileView.classList.remove('d-none');
            profileEdit.classList.add('d-none');
            editPasswordBtn.classList.add('d-none');
            editBtn.classList.remove('d-none');
            logOutBtn.classList.remove('d-none');
        });
    }

    //  Редактирование пароля 
    if (newPassword && repeatNewPassword && saveNewPassword) {
        saveNewPassword.addEventListener('click', () => {
            if (newPassword.value.length <= 255){
                if (newPassword.value == repeatNewPassword.value){
                    changePassword(newPassword.value,newPassword,repeatNewPassword);
                } else{
                    showToast('Указанные пароли отличаются!',toastEl,bsToast);
                }
            } else{
                showToast('Длина пароля не должна превышать 255 символов!',toastEl,bsToast);
            }
        });
    }

    //  Автоскрытие других тостов 
    const toast = document.querySelector('.toast');
    if (toast) {
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
        }, 5000);
    }

    //  Инициализация тултипов 
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el => new bootstrap.Tooltip(el));

    //  Открытие кнопки more 
    document.body.addEventListener('click', function(e) {
        const btn = e.target.closest('.more-btn');
        const menu = btn ? btn.nextElementSibling : null;

        if (btn && menu) {
            menu.classList.toggle('hidden');
        } else {
            document.querySelectorAll('.more-menu').forEach(m => m.classList.add('hidden'));
        }
    });

});

//  Проверка размера файла 
function validateFileSize(input) {
    const file = input.files[0];
    if (!file) return true;

    const maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
        // Показываем ошибку
        const toastEl = document.getElementById('fileSizeToast');
        if (toastEl) {
            toastEl.querySelector('.toast-body').textContent = "Размер файла не должен превышать 20MB!";
            const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
            toast.show();
        }
        
        // Очищаем input и предпросмотр
        input.value = "";
        removeImagePreview();
        return false;
    }
    return true;
}

// Функция предпросмотра изображения
function previewImage(input) {
    const file = input.files[0];
    const fileNameElement = document.getElementById('selectedImageName');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('imagePreview');
    
    if (file) {
        // Проверяем размер файла перед отображением
        if (!validateFileSize(input)) {
            return;
        }
        
        // Проверяем тип файла
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            const toastEl = document.getElementById('fileSizeToast');
            if (toastEl) {
                toastEl.querySelector('.toast-body').textContent = "Пожалуйста, выберите файл в формате JPEG, PNG или GIF!";
                const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
                toast.show();
            }
            input.value = "";
            removeImagePreview();
            return;
        }
        
        // Показываем имя файла
        if (fileNameElement) {
            fileNameElement.textContent = file.name;
            fileNameElement.classList.remove('text-gray-500');
            fileNameElement.classList.add('text-green-600', 'font-medium');
        }
        
        // Создаем URL для предпросмотра
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Устанавливаем изображение в предпросмотр
            if (previewImage) {
                previewImage.src = e.target.result;
            }
            
            // Показываем контейнер предпросмотра
            if (previewContainer) {
                previewContainer.classList.remove('hidden');
                previewContainer.classList.add('flex');
            }
        }
        
        reader.onerror = function() {
            console.error('Ошибка загрузки файла');
            if (fileNameElement) {
                fileNameElement.textContent = 'Ошибка загрузки';
                fileNameElement.classList.remove('text-green-600');
                fileNameElement.classList.add('text-red-600');
            }
        }
        
        reader.readAsDataURL(file);
    } else {
        // Если файл не выбран
        if (fileNameElement) {
            fileNameElement.textContent = 'Файл не выбран';
            fileNameElement.classList.remove('text-green-600', 'font-medium');
            fileNameElement.classList.add('text-gray-500');
        }
        if (previewContainer) {
            previewContainer.classList.add('hidden');
            previewContainer.classList.remove('flex');
        }
    }
}

// Функция удаления предпросмотра
function removeImagePreview() {
    const fileInput = document.getElementById('postImage');
    const fileNameElement = document.getElementById('selectedImageName');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('imagePreview');
    
    // Очищаем input
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Сбрасываем текст
    if (fileNameElement) {
        fileNameElement.textContent = 'Файл не выбран';
        fileNameElement.classList.remove('text-green-600', 'font-medium');
        fileNameElement.classList.add('text-gray-500');
    }
    
    // Скрываем предпросмотр
    if (previewContainer) {
        previewContainer.classList.add('hidden');
        previewContainer.classList.remove('flex');
    }
    
    // Очищаем src изображения
    if (previewImage) {
        previewImage.src = '';
    }
}

// Дополнительная функция для проверки размера при отправке формы
function validateImageBeforeSubmit(input) {
    const file = input.files[0];
    if (!file) return true;
    
    const maxSize = 20 * 1024 * 1024;
    const minSize = 8;
    
    if (file.size > maxSize) {
        alert('Размер файла не должен превышать 20MB!');
        removeImagePreview();
        return false;
    }
    
    if (file.size < minSize) {
        alert('Файл слишком маленький!');
        removeImagePreview();
        return false;
    }
    
    return true;
}

//Изменение пароля
async function changePassword(pass1,newPassword,repeatNewPassword) {
    const token = document.querySelector('meta[name="_csrf"]').content;
    const header = document.querySelector('meta[name="_csrf_header"]').content;
    const toastEl = document.getElementById('fileSizeToast');
    const bsToast = toastEl ? new bootstrap.Toast(toastEl, { delay: 3000 }) : null;

    try {
        const response = await fetch("/account/password/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                [header]: token
            },
            body: new URLSearchParams({ pass1 })
        });

        const data = await response.json();
        console.log(data);

        if (!data.success) {
            showToast(data.toastMessage || "Ошибка при обновлении пароля",toastEl,bsToast);
            return;
        } else{
            newPassword.value = '';
            repeatNewPassword.value = '';
            const modalElement = document.getElementById('exampleModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
            showToast("Пароль изменен",toastEl,bsToast);
            return;
        }

    } catch (err) {
        console.error(err);
        showToast("Ошибка при обновлении пароля",toastEl,bsToast);
    }
}

//Показ тоста
function showToast(message,toastEl,bsToast) {
    if (message) {
        if (bsToast && toastEl && message!="Пароль изменен") {
            toastEl.querySelector('.toast-body').textContent = message;
            toastEl.classList.remove('text-bg-success');
            toastEl.classList.add('text-bg-danger');
            bsToast.show();
        }else{
            toastEl.querySelector('.toast-body').textContent = message;
            toastEl.classList.remove('text-bg-danger');
            toastEl.classList.add('text-bg-success');
            bsToast.show();
        }
    }
}