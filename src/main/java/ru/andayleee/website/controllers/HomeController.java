package ru.andayleee.website.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("activePage", "home");
        return "home";
    }

    @GetMapping("/account")
    public String account(Model model) {
        model.addAttribute("activePage", "account");
        return "account";
    }

    @GetMapping("/api/hello")
    public String hello() {
        return "{\"message\": \"Hello World\", \"status\": \"success\"}";
    }
}
