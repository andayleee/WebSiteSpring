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
