package ru.andayleee.website.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

import ru.andayleee.website.models.User;
import ru.andayleee.website.config.UploadProperties;
import ru.andayleee.website.repositories.UserRepository;

@Controller
public class AccountController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UploadProperties uploadProperties;

    @GetMapping("/account")
    public String account(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        model.addAttribute("user", user);
        model.addAttribute("activePage", "account");
        return "account";
    }

    @PostMapping("/account/update")
    public String updateProfile(
            @Valid @ModelAttribute User updatedUser,
            BindingResult bindingResult,
            @RequestParam(required = false) MultipartFile photo,
            Model model
    ) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            model.addAttribute("toastMessage", "Ошибка: пользователь не авторизован!");
            return "account";
        }

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    model.addAttribute("toastMessage", "Пользователь не найден!");
                    return new RuntimeException("Пользователь не найден");
                });

        // Валидация полей
        if (bindingResult.hasErrors()) {
            model.addAttribute("user", updatedUser);
            model.addAttribute("toastMessage", "Ошибка: Превышен лимит символов!");
            model.addAttribute("activePage", "account");
            model.addAttribute("user", user);
            return "account";
        }

        // Обновляем обычные поля
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setDescription(updatedUser.getDescription());

        // --- Загрузка фото ---
        try {
            if (photo != null && !photo.isEmpty()) {
                if (photo.getSize() > 10 * 1024 * 1024) { // 10MB
                    throw new MaxUploadSizeExceededException(10 * 1024 * 1024);
                }

                String filename = UUID.randomUUID() + "_" + photo.getOriginalFilename();

                // Используем путь из UploadProperties
                Path uploadPath = Paths.get(uploadProperties.getBasePath(), "images", "avatars", filename);

                Files.createDirectories(uploadPath.getParent()); // создаём директории если их нет
                Files.write(uploadPath, photo.getBytes());

                // Сохраняем путь для отображения в HTML
                String relativePath = "/images/avatars/" + filename; 
                user.setPhotoPath(relativePath);
            }
        } catch (MaxUploadSizeExceededException e) {
            model.addAttribute("user", user);
            model.addAttribute("toastMessage", "Файл слишком большой! Максимум 10MB.");
            model.addAttribute("activePage", "account");
            return "account";
        } catch (IOException e) {
            model.addAttribute("user", user);
            model.addAttribute("toastMessage", "Ошибка при загрузке фото!");
            model.addAttribute("activePage", "account");
            return "account";
        }

        userRepository.save(user);

        // Обновляем Authentication если email изменился
        UserDetails newUserDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(auth.getAuthorities())
                .build();

        Authentication newAuth = new UsernamePasswordAuthenticationToken(
                newUserDetails,
                newUserDetails.getPassword(),
                newUserDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(newAuth);

        model.addAttribute("user", user);
        //model.addAttribute("toastMessage", "Профиль успешно обновлен!");
        model.addAttribute("activePage", "account");

        return "account"; // оставляем на той же странице, чтобы toast отобразился
    }
}