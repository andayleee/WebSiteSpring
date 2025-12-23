package ru.andayleee.website.dto;

public class RegisterRequest {
    private String email;
    private String password;
    private String accessKey;

    // Конструктор по умолчанию
    public RegisterRequest() {
    }

    // Полный конструктор
    public RegisterRequest(String email, String password, String accessKey) {
        this.email = email;
        this.password = password;
        this.accessKey = accessKey;
    }

    // Геттеры и сеттеры
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }
}
