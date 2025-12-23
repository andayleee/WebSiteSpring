const editBtn = document.getElementById('editProfileBtn');
const cancelBtn = document.getElementById('cancelEditBtn');
const profileView = document.getElementById('profileView');
const profileEdit = document.getElementById('profileEdit');

editBtn.addEventListener('click', () => {
    profileView.classList.add('d-none');
    profileEdit.classList.remove('d-none');
});

cancelBtn.addEventListener('click', () => {
    profileEdit.classList.add('d-none');
    profileView.classList.remove('d-none');
});