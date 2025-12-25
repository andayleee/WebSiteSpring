package ru.andayleee.website.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.andayleee.website.models.Post;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Найти все посты конкретного пользователя
    List<Post> findByUserId(Long userId);

    // Найти посты по заголовку (пример поиска)
    List<Post> findByTitleContainingIgnoreCase(String title);
}