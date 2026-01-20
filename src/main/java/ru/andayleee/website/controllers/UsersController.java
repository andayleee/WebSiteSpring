package ru.andayleee.website.controllers;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import ru.andayleee.website.models.Comment;
import ru.andayleee.website.models.Post;
import ru.andayleee.website.models.User;
import ru.andayleee.website.repositories.CommentRepository;
import ru.andayleee.website.repositories.PostRepository;
import ru.andayleee.website.repositories.UserRepository;

@Controller
public class UsersController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

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
            } else {
                formatted = post.getCreatedAt().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"));
            }

            postTimes.put(post.getId(), formatted);
        }

        return postTimes;
    }

    @GetMapping("/users")
    public String users(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        
        // Получаем всех пользователей
        Iterable<User> allUsersIterable = userRepository.findAll();
        
        // Фильтруем - исключаем текущего пользователя
        List<User> otherUsers = new ArrayList<>();
        for (User user : allUsersIterable) {
            if (!user.getId().equals(currentUser.getId())) {
                otherUsers.add(user);
            }
        }
        
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("users", otherUsers); // только другие пользователи
        model.addAttribute("activePage", "users");

        return "users";
    }

    @GetMapping("/user/{userId}")
    public String viewUserProfile(@PathVariable Long userId, Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();
        
        // Получаем текущего пользователя
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (currentUser.getId().equals(userId)) {
            return "redirect:/account";
        }
        
        // Получаем пользователя, профиль которого просматриваем
        User profileUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        
        // Проверяем, не пытается ли пользователь посмотреть свой же профиль
        boolean isOwnProfile = currentUser.getId().equals(profileUser.getId());
        
        // Получаем посты профильного пользователя
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(profileUser.getId());
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
        
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("profileUser", profileUser);
        model.addAttribute("isOwnProfile", isOwnProfile);
        model.addAttribute("posts", posts);
        model.addAttribute("postTimes", postTimes);
        model.addAttribute("postComments", postComments);
        model.addAttribute("postCommentsCount", postCommentsCount);
        
        return "profile"; 
    }
}
