package ru.andayleee.website.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import ru.andayleee.website.repositories.UserRepository;
import ru.andayleee.website.models.User;

@Controller
public class HomeController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    public String home(Model model) {
        Iterable<User> user = userRepository.findAll();
        model.addAttribute("User", user);
        model.addAttribute("activePage", "home");
        return "home";
    }

    @GetMapping("/account")
    public String account(@AuthenticationPrincipal UserDetails currentUser, Model model) {
        // currentUser.getUsername() — это email (или username)
        User user = userRepository.findByEmail(currentUser.getUsername())
                                .orElse(null);

        model.addAttribute("user", user);
        model.addAttribute("activePage", "account");
        return "account";
    }

    @GetMapping("/api/hello")
    public String hello() {
        return "{\"message\": \"Hello World\", \"status\": \"success\"}";
    }
}
