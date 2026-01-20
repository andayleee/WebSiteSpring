package ru.andayleee.website.controllers;

import java.time.format.DateTimeFormatter;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import ru.andayleee.website.models.Comment;
import ru.andayleee.website.models.Post;
import ru.andayleee.website.models.User;
import ru.andayleee.website.repositories.CommentRepository;
import ru.andayleee.website.repositories.PostRepository;
import ru.andayleee.website.repositories.UserRepository;

@RestController
@RequestMapping("/comments")
public class CommentController {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @PostMapping("/add")
    public Map<String, Object> addComment(@RequestParam("postId") Long postId,
                                          @RequestParam("content") String content) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("Пользователь не авторизован");
        }

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Пост не найден"));

        Comment comment = new Comment(content, post, user);
        commentRepository.save(comment);

        Map<String, Object> response = new HashMap<>();
        response.put("id", comment.getId());
        response.put("content", comment.getContent());
        response.put("userName", user.getName());
        response.put("userPhoto", user.getPhotoPath());
        response.put("createdAt", comment.getCreatedAt().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")));
        response.put("isOwner", true);

        return response;
    }

    @PostMapping("/delete")
    public Map<String, Object> deleteComment(@RequestParam("commentId") Long commentId) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("Пользователь не авторизован");
        }

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Комментарий не найден"));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Нельзя удалить чужой комментарий");
        }

        commentRepository.delete(comment);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("commentId", commentId);
        return response;
    }

    @GetMapping("/more")
    public List<Map<String, Object>> getMoreComments(@RequestParam Long postId,
                                                     @RequestParam int start,
                                                     @RequestParam int size) {

        List<Comment> allComments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        int end = Math.min(start + size, allComments.size());

        if (start >= allComments.size()) return Collections.emptyList();

        List<Comment> commentsPage = allComments.subList(start, end);
        List<Map<String, Object>> response = new ArrayList<>();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        for (Comment comment : commentsPage) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", comment.getId());
            map.put("content", comment.getContent());
            map.put("idCommentUser", comment.getUser().getId());
            map.put("idCurrentUser", user.getId());
            map.put("userName", comment.getUser().getName());
            map.put("userPhoto", comment.getUser().getPhotoPath());
            map.put("createdAt", comment.getCreatedAt().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")));
            response.add(map);
        }

        return response;
    }
}
