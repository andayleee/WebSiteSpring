package ru.andayleee.website.controllers;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import ru.andayleee.website.services.MainPageItemService;
import ru.andayleee.website.models.MainPageItem;
import org.springframework.data.domain.Page;

@Controller
public class HomeController {

    private final MainPageItemService service;

    public HomeController(MainPageItemService service) {
        this.service = service;
    }

    @GetMapping("/")
    public String homePage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Model model) {

        Page<MainPageItem> itemsPage = service.getItems(PageRequest.of(page, size));

        model.addAttribute("itemsPage", itemsPage);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", itemsPage.getTotalPages());
        return "home";
    }
}
