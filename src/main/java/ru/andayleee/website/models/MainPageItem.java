package ru.andayleee.website.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "main_page_items")
public class MainPageItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String photoPath; // путь к картинке

    @Column(nullable = false)
    @Size(max = 250)
    private String title;

    @Column(length = 1000)
    @Size(max = 1000)
    private String description;

    public MainPageItem() {}

    public MainPageItem(String photoPath, String title, String description) {
        this.photoPath = photoPath;
        this.title = title;
        this.description = description;
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}