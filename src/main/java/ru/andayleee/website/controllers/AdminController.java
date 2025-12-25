package ru.andayleee.website.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import ru.andayleee.website.models.MainPageItem;
import ru.andayleee.website.repositories.MainPageItemRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Controller
public class AdminController {

    @Autowired
    private MainPageItemRepository mainPageItemRepository;

    private final String uploadDir = "/images/mainPageItem/";

    @GetMapping("/admin/page")
    public String adminPage(Model model) {
        List<MainPageItem> items = mainPageItemRepository.findAll();
        model.addAttribute("items", items);
        model.addAttribute("activePage", "adminPage");
        return "adminPage"; // adminPage.html
    }
    
    @PostMapping("/admin/page/add")
    public String addItem(@RequestParam("photo") MultipartFile photo,
                        @RequestParam("title") String title,
                        @RequestParam("description") String description) throws IOException {

        if (photo != null && !photo.isEmpty()) {
            // Создаём уникальное имя файла
            String filename = UUID.randomUUID() + "_" + photo.getOriginalFilename();

            // Путь к папке для mainPageItem
            Path uploadPath = Paths.get("src/main/resources/static/images/mainPageItem/" + filename);

            // Создаём директорию, если её нет
            Files.createDirectories(uploadPath.getParent());

            // Записываем файл на диск
            Files.write(uploadPath, photo.getBytes());

            // Создаём объект MainPageItem и сохраняем путь в БД
            MainPageItem item = new MainPageItem();
            item.setPhotoPath("/images/mainPageItem/" + filename);
            item.setTitle(title);
            item.setDescription(description);

            mainPageItemRepository.save(item);
        }

        return "redirect:/admin/page";
    }
}
