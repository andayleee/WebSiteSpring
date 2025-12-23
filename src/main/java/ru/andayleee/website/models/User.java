package ru.andayleee.website.models;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String photoPath = "/images/avatars/VoidAvatar.png";

    @Column(nullable = false)
    private String role;

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
