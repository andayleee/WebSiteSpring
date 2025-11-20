package ru.andayleee.website;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "🚀 Hello from Spring Boot! Server: " + java.time.LocalDateTime.now();
    }

    @GetMapping("/api/hello")
    public String hello() {
        return "{\"message\": \"Hello World\", \"status\": \"success\"}";
    }
}
