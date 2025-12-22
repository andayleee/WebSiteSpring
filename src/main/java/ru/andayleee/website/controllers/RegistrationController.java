package ru.andayleee.website.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RegistrationController {

    @GetMapping("/registration")
    public String registration(Model model) {
        model.addAttribute("activePage", "registrationPage");
        return "registrationPage";
    }
}
