package ru.andayleee.website.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.andayleee.website.models.Like;
import ru.andayleee.website.models.Post;
import ru.andayleee.website.models.User;
import ru.andayleee.website.repositories.LikeRepository;
import ru.andayleee.website.repositories.PostRepository;
import ru.andayleee.website.repositories.UserRepository;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/posts")
public class PostLikeController {
    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{postId}/like")
    @ResponseBody
    public Map<String, Object> toggleLike(@PathVariable Long postId, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Пост не найден"));

        Optional<Like> existingLike = post.getLikes().stream()
                .filter(like -> like.getUser().getId().equals(user.getId()))
                .findFirst();

        boolean liked;
        if (existingLike.isPresent()) {
            post.getLikes().remove(existingLike.get());
            likeRepository.delete(existingLike.get());
            liked = false;
        } else {
            Like like = new Like(post, user);
            post.getLikes().add(like);
            likeRepository.save(like);
            liked = true;
        }

        postRepository.save(post);

        Map<String, Object> response = new HashMap<>();
        response.put("likesCount", post.getLikes().size());
        response.put("liked", liked);

        return response;
    }
}
