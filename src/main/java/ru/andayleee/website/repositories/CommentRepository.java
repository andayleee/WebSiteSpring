package ru.andayleee.website.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.andayleee.website.models.Comment;

import java.util.List;

@Repository
public interface CommentRepository extends CrudRepository<Comment, Long> {
    // Найти все комментарии к конкретному посту
    List<Comment> findByPostId(Long postId);

    // Найти все комментарии конкретного пользователя
    List<Comment> findByUserId(Long userId);
}
