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
    //  Показ формы редактирования поста 
    // ----------------------
    document.querySelectorAll(".edit-post-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const postItem = btn.closest(".post-item");
            const postForm = postItem.querySelector(".edit-post-form");
            const titleEl = postItem.querySelector("h4");
            const descEl = postItem.querySelector("p.text-gray-600");

            if (postForm) {
                postForm.classList.remove("hidden");
                if (titleEl) titleEl.classList.add("hidden");
                if (descEl) descEl.classList.add("hidden");
            }
        });
    });
    // ----------------------
    //  Отмена редактирования поста 
    // ----------------------
    document.querySelectorAll(".cancel-edit-post-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const postForm = btn.closest(".edit-post-form");
            const postItem = btn.closest(".post-item");
            const titleEl = postItem.querySelector("h4");
            const descEl = postItem.querySelector("p.text-gray-600");

            if (postForm) {
                postForm.classList.add("hidden");
                if (titleEl) titleEl.classList.remove("hidden");
                if (descEl) descEl.classList.remove("hidden");
            }
        });
    });

    // ----------------------
    //  Сохранение изменений через ajax редактирования поста
    // ----------------------
    document.querySelectorAll(".edit-post-form").forEach(form => {
        form.addEventListener("submit", async e => {
            e.preventDefault();

            const postId = form.dataset.postId;
            const title = form.querySelector("input[name='title']").value.trim();
            const description = form.querySelector("textarea[name='description']").value.trim();

            const token = document.querySelector('meta[name="_csrf"]').content;
            const header = document.querySelector('meta[name="_csrf_header"]').content;

            try {
                const response = await fetch("/account/posts/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        [header]: token
                    },
                    body: new URLSearchParams({ postId, title, description })
                });

                const data = await response.json();

                if (!data.success) {
                    showToast(data.toastMessage || "Ошибка при обновлении поста");
                    return;
                }

                const postItem = form.closest(".post-item");

                const titleEl = postItem.querySelector("h4");
                if (titleEl) {
                    titleEl.textContent = data.title;
                    titleEl.classList.remove("hidden");
                }

                const descSpan = postItem.querySelector(".post-description");
                if (descSpan) {
                    descSpan.innerText = data.description;
                    const descP = descSpan.closest("p");
                    if (descP) descP.classList.remove("hidden");
                }

                form.classList.add("hidden");

            } catch (err) {
                console.error(err);
                showToast("Ошибка при обновлении поста");
            }
        });
    });

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

        if (!content) {
            showToast("Комментарий не может быть пустым!");
            return;
        }
        if (content.length > 1000) {
            showToast("Комментарий не может быть более 1000 символов!");
            return;
        }

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

            const visibleComments = commentsSection.querySelectorAll(".flex[data-comment-id], .comment-item");
            
            if (visibleComments.length >= 3) {
                const lastComment = visibleComments[visibleComments.length - 1];
                lastComment.remove();
            }

            const commentDiv = document.createElement("div");
            commentDiv.classList.add("flex", "comment-item");
            commentDiv.dataset.commentId = data.id;

            const deleteBtnHtml = data.isOwner ? 
                `<button class="absolute bottom-1 right-3 text-red-500 text-xs hover:text-red-700 delete-comment-btn">Удалить</button>` 
                : '';

            commentDiv.innerHTML = `
                <img src="${data.userPhoto}" alt="Commenter" class="w-8 h-8 object-cover rounded-full mr-3">
                <div class="bg-gray-50 p-3 rounded-lg flex-1 relative">
                    <div class="flex items-center justify-between">
                        <span class="font-medium fw-bold text-sm">${data.userName}</span>
                        <span class="text-xs text-gray-400">${data.createdAt}</span>
                    </div>
                    <p class="text-sm mt-1 break-words">${data.content}</p>
                    ${deleteBtnHtml}
                </div>
            `;

            commentsSection.prepend(commentDiv);
            contentInput.value = "";

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
    // Ответ на комментарий
    // ----------------------
    async function answerComment(commentDiv, userLink) {
        if (!commentDiv) return;
        if (userLink) {
            const userPath = userLink.getAttribute('href'); 
            const userId = userPath.split('/').pop();
            const userName = userLink.querySelector('span').textContent.trim();
            
            const postItem = commentDiv.closest('.post-item');
            if (!postItem) return;
            const addCommentForm = postItem.querySelector('.add-comment-form');
            if (!addCommentForm) return;
            const commentInput = addCommentForm.querySelector('#comment-input');
            if (!commentInput) return;
            commentInput.value = `@${userName}, `;
            commentInput.focus();
            commentInput.dataset.replyTo = userId;
            commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                    commentDiv.classList.add("flex");
                    commentDiv.dataset.commentId = comment.id;
                    htmlText = `
                        <img src="${comment.userPhoto}" alt="Commenter" class="w-8 h-8 object-cover rounded-full mr-3">
                        <div class="bg-gray-50 p-3 rounded-lg flex-1 relative">
                            <div class="flex items-center justify-between">
                                <a href="/user/${comment.idCommentUser}" class="flex items-center">
                                  <span class="font-medium fw-bold text-sm">${comment.userName}</span>
                                </a>
                                <span class="text-xs text-gray-400">${comment.createdAt}</span>
                            </div>
                            <p class="text-sm mt-1 break-words">${comment.content}</p>
                    `;
                    if (comment.idCommentUser == comment.idCurrentUser){
                        htmlText += `
                        <button class="absolute bottom-1 right-3 text-red-500 text-xs hover:text-red-700 delete-comment-btn">
                                Удалить
                            </button> 
                        </div>
                    `;
                    } else{
                        htmlText += `
                        <button class="absolute bottom-1 right-3 text-secondary text-xs text-hover-dark answer-comment-btn">
                                Ответить
                            </button>
                        </div>
                    `;
                    }
                    commentDiv.innerHTML = htmlText;
                    
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
        if (e.target.classList.contains("answer-comment-btn")) {
            const commentDiv = e.target.closest("div[data-comment-id]");
            const userLink = commentDiv.querySelector('a[href^="/user/"]');
            answerComment(commentDiv, userLink);
        }
    });
});