document.addEventListener("DOMContentLoaded", () => {
    let currentPage = 0;
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const postsContainer = document.getElementById("postsContainer");

    if (!loadMoreBtn || !postsContainer) return;

    // ===============================
    // Получаем CSRF-токен и заголовок
    // ===============================
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    function createPostElement(post, currentUser) {
        const div = document.createElement("div");
        div.classList.add("post-item", "bg-white", "rounded-xl", "shadow-lg", "overflow-hidden");

        div.innerHTML = `
            <div class="gallery-item">
                <img src="${post.photoPath}" alt="Post image" class="w-full h-64 object-cover">
                <h3 class="hidden">${post.title}</h3>
                <p class="hidden">${post.description}</p>
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <img src="${post.user.photoPath}" alt="User" class="w-10 h-10 rounded-full mr-3">
                        <div>
                            <h3 class="font-bold text-gray-800">${post.user.name}</h3>
                            <p class="text-sm text-gray-500">${post.createdAt}</p>
                        </div>
                    </div>
                </div>
                <h4 class="font-semibold text-lg mb-2">${post.title}</h4>
                <p class="text-gray-600 mb-4">${post.description}</p>
                <div class="flex items-center space-x-4 border-t border-gray-100 pt-4">
                    <button class="like-btn flex items-center hover:text-red-500 ${post.isLiked ? 'text-red-500' : 'text-gray-500'}" data-post-id="${post.id}">
                        <i data-feather="heart" class="mr-2"></i>
                        <span class="like-count">${post.likesCount}</span>
                    </button>
                    <button class="comment-btn flex items-center text-gray-500 hover:text-indigo-500" data-post-id="${post.id}">
                        <i data-feather="message-square" class="mr-2"></i>
                        <span>Комментировать</span>
                    </button>
                </div>
                <div class="mt-4 space-y-3 comments-section" data-post-id="${post.id}" data-total-comments="${post.commentsCount}">
                    ${post.comments.map(comment => `
                        <div class="flex" data-comment-id="${comment.id}">
                            <img src="${comment.user?.photoPath || '/images/avatars/VoidAvatar.png'}" alt="Commenter" class="w-8 h-8 rounded-full mr-3">
                            <div class="bg-gray-50 p-3 rounded-lg flex-1 relative">
                                <div class="flex items-center justify-between">
                                    <span class="font-medium text-sm">${comment.username}</span>
                                    <span class="text-xs text-gray-400">${comment.createdAt}</span>
                                </div>
                                <p class="text-sm mt-1 break-words">${comment.content}</p>
                                ${comment.username === currentUser.name ? `<button class="absolute top-1 right-1 text-red-500 text-xs hover:text-red-700 delete-comment-btn">Удалить</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        return div;
    }

    // ===============================
    // Делегирование событий на postsContainer
    // ===============================
    postsContainer.addEventListener("click", e => {
        const likeBtn = e.target.closest(".like-btn");
        const deleteCommentBtn = e.target.closest(".delete-comment-btn");
        const img = e.target.closest(".gallery-item img");

        // Лайк с CSRF
        if (likeBtn) {
            const postId = likeBtn.dataset.postId;
            fetch(`/posts/${postId}/like`, {
                method: "POST",
                headers: {
                    [csrfHeader]: csrfToken,
                    "X-Requested-With": "XMLHttpRequest"
                }
            })
            .then(res => res.json())
            .then(data => {
                likeBtn.querySelector(".like-count").textContent = data.likesCount;
                likeBtn.classList.toggle("text-red-500", data.isLiked);
                likeBtn.classList.toggle("text-gray-500", !data.isLiked);
            });
            return;
        }

        // Удаление комментария с CSRF
        if (deleteCommentBtn) {
            const commentEl = deleteCommentBtn.closest("[data-comment-id]");
            const commentId = commentEl.dataset.commentId;
            fetch(`/comments/${commentId}/delete`, {
                method: "POST",
                headers: {
                    [csrfHeader]: csrfToken,
                    "X-Requested-With": "XMLHttpRequest"
                }
            })
            .then(() => commentEl.remove());
            return;
        }

        // Lightbox
        if (img) {
            const title = img.parentElement.querySelector("h3").textContent;
            const description = img.parentElement.querySelector("p").textContent;
            openLightbox(img.src, title, description);
            return;
        }
    });

    // ===============================
    // Загрузка новых постов
    // ===============================
    loadMoreBtn.addEventListener("click", () => {
        fetch(`/account/posts?page=${currentPage + 1}`)
            .then(res => res.json())
            .then(data => {
                const currentUser = data.user;
                data.posts.forEach(post => {
                    const postEl = createPostElement(post, currentUser);
                    postsContainer.appendChild(postEl);
                });
                currentPage = data.currentPage;
                if (currentPage + 1 >= data.totalPages) loadMoreBtn.style.display = "none";
                if (typeof feather !== 'undefined') feather.replace();
            });
    });

    // ===============================
    // Лайтбокс
    // ===============================
    function openLightbox(src, title, description) {
        document.body.style.overflow = "hidden";
        const overlay = document.createElement("div");
        overlay.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 p-4";
        overlay.innerHTML = `
            <div class="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
                <img src="${src}" class="w-full object-contain max-h-[80vh]">
                <div class="p-4">
                    <h3 class="text-xl font-bold mb-2">${title}</h3>
                    <p class="text-gray-700">${description}</p>
                </div>
                <button class="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-2 rounded" id="closeLightboxBtn">×</button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector("#closeLightboxBtn").addEventListener("click", () => {
            overlay.remove();
            document.body.style.overflow = "";
        });
    }
});