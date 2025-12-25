package ru.andayleee.website.controllers;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import ru.andayleee.website.dto.RegisterRequest;
import ru.andayleee.website.models.User;
import ru.andayleee.website.repositories.UserRepository;

@Controller
public class RegistrationController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ====== ОТКРЫТИЕ СТРАНИЦЫ ======
    @GetMapping("/registration")
    public String registration(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "registrationPage";
    }

    // ====== ОБРАБОТКА ФОРМЫ ======
    @PostMapping("/register")
    public String register(@ModelAttribute RegisterRequest registerRequest, Model model) {

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            model.addAttribute("error", "Email уже зарегистрирован");
            return "registrationPage";
        }

        if (!registerRequest.getAccessKey().equals("My_Key")){
            model.addAttribute("error", "Не совпадает ключ доступа");
            return "registrationPage";
        }

        int MAX_LENGTH_EMAIL = 150;
        int MAX_LENGTH_PASSWORD = 250;
        int MAX_LENGTH_ACCESS_KEY = 250;

        if (registerRequest.getEmail().length() > MAX_LENGTH_EMAIL) {
            model.addAttribute("error", "Email слишком длинный");
            return "registrationPage";
        }
        if (registerRequest.getPassword().length() > MAX_LENGTH_PASSWORD) {
            model.addAttribute("error", "Пароль слишком длинный");
            return "registrationPage";
        }
        if (registerRequest.getAccessKey().length() > MAX_LENGTH_ACCESS_KEY) {
            model.addAttribute("error", "Access Key слишком длинный");
            return "registrationPage";
        }

        User user = new User();
        int random = 100000 + new java.util.Random().nextInt(900000);
        user.setName("user_" + random);
        user.setPhotoPath("/images/avatars/VoidAvatar.png");
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole("ROLE_USER");
        user.setDescription("");
        userRepository.save(user);

        // 4. После успешной регистрации — на логин
        return "redirect:/login";
    }
}