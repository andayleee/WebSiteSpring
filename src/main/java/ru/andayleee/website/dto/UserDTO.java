package ru.andayleee.website.dto;

import ru.andayleee.website.models.User;

public class UserDTO {
    private Long id;
    private String name;
    private String photoPath;

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.photoPath = user.getPhotoPath();
    }

    // Геттеры (сеттеры обычно не нужны для DTO, если только не планируешь изменять)
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhotoPath() {
        return photoPath;
    }
}
