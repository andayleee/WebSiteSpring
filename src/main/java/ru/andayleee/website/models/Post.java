package ru.andayleee.website.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String photoPath; // путь до фото поста

    @Column(nullable = false)
    @Size(max = 250, message = "Заголовок не должен превышать 250 символов")
    private String title;

    @Column(nullable = true, length = 1000)
    @Size(max = 1000, message = "Описание не должно превышать 1000 символов")
    private String description;

    // Внешний ключ на пользователя
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Комментарии к посту
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    // Лайки к посту
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes = new ArrayList<>();

    // Конструкторы
    public Post() {}

    public Post(String photoPath, String title, String description, User user) {
        this.photoPath = photoPath;
        this.title = title;
        this.description = description;
        this.user = user;
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }

    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }

    public List<Like> getLikes() { return likes; }
    public void setLikes(List<Like> likes) { this.likes = likes; }
}