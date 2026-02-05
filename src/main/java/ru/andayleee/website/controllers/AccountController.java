package ru.andayleee.website.controllers;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort; 
import org.springframework.data.domain.Page;

import jakarta.validation.Valid;
import net.coobird.thumbnailator.Thumbnails;
import ru.andayleee.website.models.Comment;
import ru.andayleee.website.models.Post;
import ru.andayleee.website.models.User;
import ru.andayleee.website.config.UploadProperties;
import ru.andayleee.website.repositories.CommentRepository;
import ru.andayleee.website.repositories.PostRepository;
import ru.andayleee.website.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AccountController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UploadProperties uploadProperties;

    // private static final int POST_PAGE_SIZE = 3;
    // private static final int COMMENT_PAGE_SIZE = 3;

    //Метод для вывода времени
    private Map<Long, String> calculatePostTimes(List<Post> posts) {
        Map<Long, String> postTimes = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();

        for (Post post : posts) {
            Duration duration = Duration.between(post.getCreatedAt(), now);
            String formatted;

            if (duration.toMinutes() < 1) {
                formatted = "только что";
            } else if (duration.toHours() < 1) {
                formatted = duration.toMinutes() + " мин назад";
            } else if (duration.toDays() < 1) {
                formatted = duration.toHours() + " ч назад";
            } else if (duration.toDays() <= 7) {
                formatted = duration.toDays() + " д назад";
            } else if (duration.toDays() <=30){
                formatted = "Месяц назад";
            } else {
                formatted = post.getCreatedAt().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"));
            }

            postTimes.put(post.getId(), formatted);
        }

        return postTimes;
    }

    @GetMapping("/account")
    public String account(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        Map<Long, String> postTimes = calculatePostTimes(posts);

        int pageSize = 3;

        Map<Long, List<Comment>> postComments = new HashMap<>();
        Map<Long, Long> postCommentsCount = new HashMap<>();

        for (Post post : posts) {
            Pageable pageable = PageRequest.of(0, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));

            Page<Comment> page = commentRepository.findByPostId(post.getId(), pageable);
            postComments.put(post.getId(), page.getContent());

            long count = commentRepository.countByPostId(post.getId());
            postCommentsCount.put(post.getId(), count);
        }

        model.addAttribute("user", user);
        model.addAttribute("posts", posts);
        model.addAttribute("postTimes", postTimes);
        model.addAttribute("postComments", postComments);
        model.addAttribute("postCommentsCount", postCommentsCount);
        model.addAttribute("activePage", "account");

        return "account";
    }

    @PostMapping("/account/update")
    public String updateProfile(
            @Valid @ModelAttribute User updatedUser,
            BindingResult bindingResult,
            @RequestParam(required = false) MultipartFile photo,
            Model model,
            RedirectAttributes redirectAttributes
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

        Optional<User> existingUserOpt = userRepository.findByEmail(updatedUser.getEmail());
        if (existingUserOpt.isPresent() && !existingUserOpt.get().getId().equals(user.getId())) {
            redirectAttributes.addFlashAttribute("toastMessage", "Такой логин уже занят!");
            return "redirect:/account";
        }

        if (bindingResult.hasErrors()) {
            model.addAttribute("user", updatedUser);
            model.addAttribute("toastMessage", "Ошибка: Превышен лимит символов!");
            model.addAttribute("activePage", "account");
            model.addAttribute("user", user);
            return "account";
        }

        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        Map<Long, String> postTimes = calculatePostTimes(posts);

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setDescription(updatedUser.getDescription());
        model.addAttribute("posts", posts);
        model.addAttribute("postTimes", postTimes);

        // --- Загрузка фото ---
        try {
            if (photo != null && !photo.isEmpty()) {
                if (photo.getSize() > 20 * 1024 * 1024) { 
                    throw new MaxUploadSizeExceededException(20 * 1024 * 1024);
                }

                String filename = UUID.randomUUID() + ".jpg";
                Path uploadDir = Paths.get(uploadProperties.getBasePath(), "images", "avatars");
                Files.createDirectories(uploadDir);

                Path uploadPath = uploadDir.resolve(filename);
                BufferedImage original = ImageIO.read(photo.getInputStream());

                Thumbnails.of(original)
                        .size(original.getWidth(), original.getHeight())
                        .outputFormat("jpg")
                        .toFile(uploadPath.toFile());

                String relativePath = "/images/avatars/" + filename;
                user.setPhotoPath(relativePath);
            }
        } catch (MaxUploadSizeExceededException e) {
            model.addAttribute("posts", posts);
            model.addAttribute("postTimes", postTimes);
            model.addAttribute("user", user);
            model.addAttribute("toastMessage", "Файл слишком большой! Максимум 20MB.");
            model.addAttribute("activePage", "account");
            return "account";
        } catch (IOException e) {
            model.addAttribute("posts", posts);
            model.addAttribute("postTimes", postTimes);
            model.addAttribute("user", user);
            model.addAttribute("toastMessage", "Ошибка при загрузке фото!");
            model.addAttribute("activePage", "account");
            return "account";
        } catch (RuntimeException e) {
            model.addAttribute("posts", posts);
            model.addAttribute("postTimes", postTimes);
            model.addAttribute("user", user);
            model.addAttribute("toastMessage", e.getMessage());
            model.addAttribute("activePage", "account");
            return "account";
        }

        userRepository.save(user);

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

        Map<Long, List<Comment>> postComments = new HashMap<>();
        for (Post post : posts) {
            int pageSize = 3;
            Pageable pageable = PageRequest.of(0, pageSize, Sort.by("createdAt").descending());
            List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(post.getId(), pageable);
            postComments.put(post.getId(), comments);
        }
        Map<Long, Long> postCommentsCount = new HashMap<>();
        for (Post post : posts) {
            long count = commentRepository.countByPostId(post.getId());
            postCommentsCount.put(post.getId(), count);
        }
        model.addAttribute("postCommentsCount", postCommentsCount);
        model.addAttribute("postComments", postComments);
        model.addAttribute("user", user);
        model.addAttribute("activePage", "account");

        return "account";
    }

    @PostMapping("/posts/create")
    public String createPost(
            @RequestParam("image") MultipartFile image,
            @RequestParam("postCaption") String title,
            @RequestParam("postDescription") String description,
            Model model
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            model.addAttribute("toastMessage", "Ошибка: пользователь не авторизован!");
            return "account";
        }

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        try {
            if (image == null || image.isEmpty()) {
                List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
                Map<Long, String> postTimes = calculatePostTimes(posts);
                model.addAttribute("posts", posts);
                model.addAttribute("postTimes", postTimes);
                model.addAttribute("toastMessage", "Пожалуйста, выберите изображение!");
                model.addAttribute("user", user);
                return "account";
            }

            if (image.getSize() > 20 * 1024 * 1024) { 
                List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
                Map<Long, String> postTimes = calculatePostTimes(posts);
                model.addAttribute("posts", posts);
                model.addAttribute("postTimes", postTimes);
                model.addAttribute("toastMessage", "Файл слишком большой! Максимум 20MB.");
                model.addAttribute("user", user);
                return "account";
            }

            String filename = UUID.randomUUID() + ".jpg";
            Path uploadDir = Paths.get(uploadProperties.getBasePath(), "images", "posts");
            Files.createDirectories(uploadDir);
            Path uploadPath = uploadDir.resolve(filename);

            BufferedImage original = ImageIO.read(image.getInputStream());
            Thumbnails.of(original)
                    .size(original.getWidth(), original.getHeight())
                    .outputFormat("jpg")
                    .toFile(uploadPath.toFile());

            String relativePath = "/images/posts/" + filename;

            Post post = new Post(relativePath, title, description, user);

            try {
                postRepository.save(post);
            } catch (jakarta.validation.ConstraintViolationException e) {
                String errorMessage = e.getConstraintViolations()
                        .stream()
                        .map(violation -> violation.getMessage())
                        .findFirst()
                        .orElse("Ошибка валидации поста!");
                List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
                Map<Long, String> postTimes = calculatePostTimes(posts);
                model.addAttribute("posts", posts);
                model.addAttribute("postTimes", postTimes);
                model.addAttribute("toastMessage", errorMessage);
                model.addAttribute("user", user);
                return "account";
            }

        } catch (IOException e) {
            List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            Map<Long, String> postTimes = calculatePostTimes(posts);
            model.addAttribute("posts", posts);
            model.addAttribute("postTimes", postTimes);
            model.addAttribute("toastMessage", "Ошибка при загрузке изображения!");
            model.addAttribute("user", user);
            return "account";
        }

        model.addAttribute("toastMessage", "Пост успешно создан!");
        return "redirect:/account";
    }

    @PostMapping("/posts/delete")
    public String deletePost(@RequestParam("postId") Long postId, Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            model.addAttribute("toastMessage", "Ошибка: пользователь не авторизован!");
            return "redirect:/account";
        }

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Пост не найден"));

        if (!post.getUser().getId().equals(user.getId())) {
            model.addAttribute("toastMessage", "Нельзя удалить чужой пост!");
            return "redirect:/account";
        }

        Path imagePath = Paths.get(uploadProperties.getBasePath(), "images", "posts", Paths.get(post.getPhotoPath()).getFileName().toString());
        try {
            Files.deleteIfExists(imagePath);
        } catch (IOException e) {
            model.addAttribute("toastMessage", "Ошибка при удалении изображения!");
            return "redirect:/account";
        }

        postRepository.delete(post);
        return "redirect:/account";
    }

    @PostMapping("/account/posts/update")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updatePost(
            @RequestParam("postId") Long postId,
            @RequestParam("title") String title,
            @RequestParam("description") String description
    ) {
        System.out.println("updatePost вызван: " + postId + " " + title);
        Map<String, Object> response = new HashMap<>();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            response.put("success", false);
            response.put("toastMessage", "Пользователь не авторизован");
            return ResponseEntity.status(401).body(response);
        }

        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("toastMessage", "Пользователь не найден");
            return ResponseEntity.status(404).body(response);
        }

        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isEmpty()) {
            response.put("success", false);
            response.put("toastMessage", "Пост не найден");
            return ResponseEntity.status(404).body(response);
        }

        Post post = postOpt.get();
        if (!post.getUser().getId().equals(user.getId())) {
            response.put("success", false);
            response.put("toastMessage", "Нельзя редактировать чужой пост");
            return ResponseEntity.status(403).body(response);
        }

        if (title == null || title.isBlank() || title.length() > 250) {
            response.put("success", false);
            response.put("toastMessage", "Заголовок не может быть пустым или длиннее 250 символов");
            return ResponseEntity.badRequest().body(response);
        }

        if (description != null && description.length() > 1000) {
            response.put("success", false);
            response.put("toastMessage", "Описание не может быть длиннее 1000 символов");
            return ResponseEntity.badRequest().body(response);
        }

        post.setTitle(title);
        post.setDescription(description != null ? description : "");
        postRepository.save(post);

        response.put("success", true);
        response.put("title", post.getTitle());
        response.put("description", post.getDescription());

        return ResponseEntity.ok(response);
    }
}