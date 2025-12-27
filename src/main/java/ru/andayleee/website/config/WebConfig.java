package ru.andayleee.website.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final UploadProperties uploadProperties;

    public WebConfig(UploadProperties uploadProperties) {
        this.uploadProperties = uploadProperties;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Папка для аватарок
        Path avatarsDir = Paths.get(uploadProperties.getBasePath(), "images", "avatars");
        String avatarsPath = avatarsDir.toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/images/avatars/**")
                .addResourceLocations(avatarsPath);

        // Папка для mainPageItem
        Path mainPageDir = Paths.get(uploadProperties.getBasePath(), "images", "mainPageItem");
        String mainPagePath = mainPageDir.toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/images/mainPageItem/**")
                .addResourceLocations(mainPagePath);

        // Можно добавлять другие папки аналогично
    }
}

