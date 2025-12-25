document.addEventListener('DOMContentLoaded', function() {
    // Toggle between view and edit modes
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

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
        input.value = ""; // сброс файла

        const toastEl = document.getElementById('fileSizeToast');
        const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
        toast.show();
    }
}