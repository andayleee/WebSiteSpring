package ru.andayleee.website.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.andayleee.website.models.Post;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Найти все посты конкретного пользователя
    List<Post> findByUserId(Long userId);

    // Найти все посты конкретного пользователя от новых к старым
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Найти посты по заголовку (пример поиска)
    List<Post> findByTitleContainingIgnoreCase(String title);

    Page<Post> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}