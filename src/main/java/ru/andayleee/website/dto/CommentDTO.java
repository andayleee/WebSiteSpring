package ru.andayleee.website.dto;

import ru.andayleee.website.models.Comment;

public class CommentDTO {
    public Long id;
    public String content;
    public String username; // Имя пользователя, который оставил комментарий
    public String createdAt; // Можно сразу форматировать в строку

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent(); // теперь корректно
        this.username = comment.getUser().getName();
        this.createdAt = comment.getCreatedAt().toString(); // формат можно менять
    }
}
