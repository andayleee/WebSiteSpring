package ru.andayleee.website.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @Size(max = 250, message = "Email не должен превышать 250 символов")
    private String email;

    @Column(nullable = false)
    @Size(max = 250, message = "Имя не должно превышать 250 символов")
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(nullable = true, length = 1000)
    @Size(max = 1000, message = "Описание не должно превышать 1000 символов")
    private String description;

    @Column(nullable = false)
    private String photoPath = "/images/avatars/VoidAvatar.png";

    @Column(nullable = false)
    private String role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    // Конструкторы
    public User() {}
    public User(String email, String name, String password, String description, String photoPath, String role) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.description = description;
        this.photoPath = photoPath;
        this.role = role;
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
