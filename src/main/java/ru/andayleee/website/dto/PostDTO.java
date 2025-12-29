package ru.andayleee.website.dto;

import ru.andayleee.website.models.Post;
import ru.andayleee.website.models.User;
import ru.andayleee.website.dto.CommentDTO;
import java.time.LocalDateTime;
import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public class PostDTO {
    public Long id;
    public String photoPath;
    public String title;
    public String description;
    public String createdAt; 
    public int likesCount;
    public boolean isLiked;
    public UserDTO user;
    public List<CommentDTO> comments;
    public int commentsCount;

    public PostDTO(Post post, User currentUser) {
        this.id = post.getId();
        this.photoPath = post.getPhotoPath();
        this.title = post.getTitle();
        this.description = post.getDescription();
        this.createdAt = formatPostTime(post.getCreatedAt()); 
        this.likesCount = post.getLikesCount();
        this.isLiked = post.isLikedBy(currentUser);
        this.user = new UserDTO(post.getUser());
        this.comments = post.getComments().stream().map(CommentDTO::new).collect(Collectors.toList());
        this.commentsCount = post.getComments().size();
    }

    private String formatPostTime(LocalDateTime createdAt) {
    LocalDateTime now = LocalDateTime.now();
    Duration duration = Duration.between(createdAt, now);

    if (duration.toMinutes() < 1) {
        return "только что";
    } else if (duration.toHours() < 1) {
        return duration.toMinutes() + " мин назад";
    } else if (duration.toDays() < 1) {
        return duration.toHours() + " ч назад";
    } else if (duration.toDays() <= 7) {
        return duration.toDays() + " д назад";
    } else {
        return createdAt.format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"));
    }
}
}
