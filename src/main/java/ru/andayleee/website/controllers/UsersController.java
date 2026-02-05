package ru.andayleee.website.controllers;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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
        
        Iterable<User> allUsersIterable = userRepository.findAll();
        
        List<User> otherUsers = new ArrayList<>();
        allUsersIterable.forEach(otherUsers::add);
        otherUsers.removeIf(user -> user.getId().equals(currentUser.getId()));

        Collections.shuffle(otherUsers);

        int limit = Math.min(5, otherUsers.size());
        List<User> randomUsers = otherUsers.stream()
                .limit(limit)
                .collect(Collectors.toList());
        
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("users", randomUsers); 
        model.addAttribute("activePage", "users");

        return "users";
    }

    @GetMapping("/user/{userId}")
    public String viewUserProfile(@PathVariable Long userId, Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();
        
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (currentUser.getId().equals(userId)) {
            return "redirect:/account";
        }
        
        User profileUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        
        boolean isOwnProfile = currentUser.getId().equals(profileUser.getId());
        
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

    @GetMapping("/users/search")
    @ResponseBody
    public ResponseEntity<List<UserSearchResult>> searchUsers(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int limit) {
        
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        
        String searchTerm = "%" + query.toLowerCase() + "%";
        
        List<User> users = userRepository.searchUsers(searchTerm);
        
        List<UserSearchResult> result = users.stream()
            .limit(limit)
            .map(user -> new UserSearchResult(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhotoPath()
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
    
    public static class UserSearchResult {
        private Long id;
        private String name;
        private String email;
        private String photoPath;
        
        public UserSearchResult(Long id, String name, String email, String photoPath) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.photoPath = photoPath;
        }
        
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPhotoPath() { return photoPath; }
    }

    @GetMapping("/users/posts")
    public String usersPosts(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();
        
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
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
        //model.addAttribute("profileUser", profileUser);
        // model.addAttribute("isOwnProfile", isOwnProfile);
        model.addAttribute("posts", posts);
        model.addAttribute("postTimes", postTimes);
        model.addAttribute("postComments", postComments);
        model.addAttribute("postCommentsCount", postCommentsCount);

        return "usersPosts";
    }

}
