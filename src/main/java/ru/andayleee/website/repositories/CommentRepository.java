package ru.andayleee.website.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.andayleee.website.models.Comment;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import java.util.List;

@Repository
public interface CommentRepository extends CrudRepository<Comment, Long> {
    // Найти все комментарии к конкретному посту
    List<Comment> findByPostId(Long postId);

    // Найти все комментарии к конкретному посту от новых к старым
    List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);

    // Поддержка пагинации через Spring Data Page
    List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId, Pageable pageable);

    Page<Comment> findByPostId(Long postId, Pageable pageable);

    // Подсчет количества комментариев для поста
    long countByPostId(Long postId);

    // Найти все комментарии конкретного пользователя
    List<Comment> findByUserId(Long userId);
}
