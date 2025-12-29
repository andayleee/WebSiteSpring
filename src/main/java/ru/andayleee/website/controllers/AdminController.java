package ru.andayleee.website.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import net.coobird.thumbnailator.Thumbnails;
import ru.andayleee.website.config.UploadProperties;
import ru.andayleee.website.models.MainPageItem;
import ru.andayleee.website.repositories.MainPageItemRepository;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

import javax.imageio.ImageIO;

@Controller
public class AdminController {

    @Autowired
    private MainPageItemRepository mainPageItemRepository;

    @Autowired
    private UploadProperties uploadProperties;

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
            // Проверяем размер файла (максимум 20MB)
            if (photo.getSize() > 20 * 1024 * 1024) {
                throw new MaxUploadSizeExceededException(20 * 1024 * 1024);
            }

            // Уникальное имя файла с расширением .jpg
            String filename = UUID.randomUUID() + ".jpg";

            // Путь к папке для mainPageItem
            Path uploadDir = Paths.get(uploadProperties.getBasePath(), "images", "mainPageItem");
            Files.createDirectories(uploadDir);

            Path uploadPath = uploadDir.resolve(filename);

            // Считываем исходное изображение
            BufferedImage original = ImageIO.read(photo.getInputStream());

            // Сохраняем миниатюру в исходных пропорциях
            Thumbnails.of(original)
                    .size(original.getWidth(), original.getHeight()) // сохраняем пропорции
                    .outputFormat("jpg")
                    .toFile(uploadPath.toFile());

            // Создаём объект MainPageItem
            MainPageItem item = new MainPageItem();
            item.setPhotoPath("/images/mainPageItem/" + filename); // путь к миниатюре
            item.setTitle(title);
            item.setDescription(description);

            mainPageItemRepository.save(item);
        }

        return "redirect:/admin/page";
    }

    // --- Обновление заголовка и описания ---
    @PostMapping("/admin/page/update")
    public String updateItem(@RequestParam("id") Long id,
                             @RequestParam("title") String title,
                             @RequestParam("description") String description) {

        mainPageItemRepository.findById(id).ifPresent(item -> {
            item.setTitle(title);
            item.setDescription(description);
            mainPageItemRepository.save(item);
        });

        return "redirect:/admin/page";
    }

    // --- Удаление записи ---
    @PostMapping("/admin/page/delete")
    public String deleteItem(@RequestParam("id") Long id) {
        mainPageItemRepository.findById(id).ifPresent(item -> {
            // Удаляем файл с диска
            Path filePath = Paths.get(uploadProperties.getBasePath(), item.getPhotoPath().replaceFirst("/", ""));
            try { Files.deleteIfExists(filePath); } catch (IOException ignored) {}
            mainPageItemRepository.delete(item);
        });
        return "redirect:/admin/page";
    }
}
