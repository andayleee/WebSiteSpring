package ru.andayleee.website.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.andayleee.website.models.Like;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends CrudRepository<Like, Long> {
    // Найти все лайки конкретного поста
    List<Like> findByPostId(Long postId);

    // Найти лайк конкретного пользователя для конкретного поста
    Optional<Like> findByPostIdAndUserId(Long postId, Long userId);
}