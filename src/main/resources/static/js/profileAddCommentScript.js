document.addEventListener("DOMContentLoaded", () => {

    // ----------------------
    // Показ тоста
    // ----------------------
    function showToast(message) {
        let toastContainer = document.querySelector(".position-fixed.bottom-4.right-4");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.className = "position-fixed bottom-4 right-4 z-50";
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement("div");
        toast.className = "toast show bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center";
        toast.role = "alert";
        toast.innerHTML = `
            <span class="mr-4">${message}</span>
            <button type="button" class="ml-auto text-white hover:text-gray-200 close-toast-btn" aria-label="Close">
                <i data-feather="x"></i>
            </button>
        `;
        toastContainer.appendChild(toast);
        feather.replace();

        setTimeout(() => toast.remove(), 5000);
        toast.querySelector(".close-toast-btn").addEventListener("click", () => toast.remove());
    }

    // ----------------------
    // Добавление комментария
    // ----------------------
    async function addComment(form) {
        const postId = form.dataset.postId;
        const contentInput = form.querySelector('input[name="content"]');
        const content = contentInput.value.trim();
        if (!content) return;

        const token = document.querySelector('meta[name="_csrf"]').content;
        const header = document.querySelector('meta[name="_csrf_header"]').content;

        try {
            const response = await fetch("/comments/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    [header]: token
                },
                body: new URLSearchParams({ postId, content })
            });

            if (!response.ok) throw new Error("Ошибка при добавлении комментария");

            const data = await response.json();
            const postElement = form.closest(".post-item");
            const commentsSection = postElement.querySelector(".comments-section");
            if (!commentsSection) return;

            const commentDiv = document.createElement("div");
            commentDiv.classList.add("flex", "comment-item");
            commentDiv.dataset.commentId = data.id;

            const deleteBtnHtml = data.isOwner ? 
                `<button class="absolute top-1 right-1 text-red-500 text-xs hover:text-red-700 delete-comment-btn">Удалить</button>` 
                : '';

            commentDiv.innerHTML = `
                <img src="${data.userPhoto}" alt="Commenter" class="w-8 h-8 rounded-full mr-3">
                <div class="bg-gray-50 p-3 rounded-lg flex-1 relative">
                    <div class="flex items-center justify-between">
                        <span class="font-medium text-sm">${data.userName}</span>
                        <span class="text-xs text-gray-400">${data.createdAt}</span>
                    </div>
                    <p class="text-sm mt-1 break-words">${data.content}</p>
                    ${deleteBtnHtml}
                </div>
            `;

            commentsSection.prepend(commentDiv);
            contentInput.value = "";

            // Обновление кнопки "Показать ещё" (если есть)
            const showMoreBtn = postElement.querySelector(".show-more-comments-btn");
            if (showMoreBtn) {
                const totalComments = parseInt(commentsSection.dataset.totalComments) || 0;
                const displayedComments = commentsSection.querySelectorAll(".comment-item").length;
                showMoreBtn.style.display = (displayedComments >= totalComments) ? "none" : "inline-block";
            }

        } catch (err) {
            console.error(err);
            showToast(err.message);
        }
    }

    // ----------------------
    // Удаление комментария
    // ----------------------
    async function deleteComment(commentDiv) {
        if (!commentDiv) return;
        const commentId = commentDiv.dataset.commentId;
        const token = document.querySelector('meta[name="_csrf"]').content;
        const header = document.querySelector('meta[name="_csrf_header"]').content;

        try {
            const response = await fetch("/comments/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    [header]: token
                },
                body: new URLSearchParams({ commentId })
            });

            if (!response.ok) throw new Error("Ошибка при удалении комментария");

            const data = await response.json();
            if (data.success) commentDiv.remove();
            else showToast("Не удалось удалить комментарий");

        } catch (err) {
            console.error(err);
            showToast(err.message);
        }
    }

    // ----------------------
    // Пагинация комментариев
    // ----------------------
    const pageSize = 3;
    const shownComments = {};

    document.querySelectorAll(".show-more-comments-btn").forEach(btn => {
        if (!btn) return;
        const postId = btn.dataset.postId;
        const postElement = btn.closest(".post-item");
        const commentsSection = postElement.querySelector(`.comments-section[data-post-id="${postId}"]`);
        if (!commentsSection) return;

        const totalComments = parseInt(commentsSection.dataset.totalComments) || 0;

        // Скрываем кнопку если комментариев меньше или равно pageSize
        if (commentsSection.children.length >= totalComments) btn.style.display = "none";

        shownComments[postId] = commentsSection.children.length;

        btn.addEventListener("click", async () => {
            try {
                const start = shownComments[postId];
                const response = await fetch(`/comments/more?postId=${postId}&start=${start}&size=${pageSize}`);
                if (!response.ok) throw new Error("Ошибка при подгрузке комментариев");

                const comments = await response.json();
                comments.forEach(comment => {
                    const commentDiv = document.createElement("div");
                    commentDiv.classList.add("flex", "comment-item");
                    commentDiv.dataset.commentId = comment.id;
                    commentDiv.innerHTML = `
                        <img src="${comment.userPhoto}" alt="Commenter" class="w-8 h-8 rounded-full mr-3">
                        <div class="bg-gray-50 p-3 rounded-lg flex-1 relative">
                            <div class="flex items-center justify-between">
                                <span class="font-medium text-sm">${comment.userName}</span>
                                <span class="text-xs text-gray-400">${comment.createdAt}</span>
                            </div>
                            <p class="text-sm mt-1 break-words">${comment.content}</p>
                            <button class="absolute top-1 right-1 text-red-500 text-xs hover:text-red-700 delete-comment-btn">Удалить</button>
                        </div>
                    `;
                    commentsSection.appendChild(commentDiv);
                });

                shownComments[postId] += comments.length;
                if (shownComments[postId] >= totalComments) btn.style.display = "none";

            } catch (err) {
                console.error(err);
                showToast(err.message);
            }
        });
    });

     // ----------------------
    // Лайки
    // ----------------------
    
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const postId = btn.dataset.postId;

            // CSRF токен из meta-тега
            const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
            const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

            fetch(`/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    [csrfHeader]: csrfToken
                }
            })
            .then(res => res.json())
            .then(data => {
                btn.querySelector('.like-count').textContent = data.likesCount;
                if (data.liked) {
                    btn.classList.add('text-red-500');
                } else {
                    btn.classList.remove('text-red-500');
                }
            });
        });
    });

    // ----------------------
    // События форм
    // ----------------------
    document.querySelectorAll(".add-comment-form").forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();
            addComment(form);
        });
    });

    document.addEventListener("click", e => {
        if (e.target.classList.contains("delete-comment-btn")) {
            const commentDiv = e.target.closest("div[data-comment-id]");
            deleteComment(commentDiv);
        }
    });
});