package ru.andayleee.website.dto;

import ru.andayleee.website.models.Comment;

public class CommentDTO {
    public Long id;
    public String content;
    public String username; 
    public String createdAt; 

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent(); 
        this.username = comment.getUser().getName();
        this.createdAt = comment.getCreatedAt().toString(); 
    }
}
