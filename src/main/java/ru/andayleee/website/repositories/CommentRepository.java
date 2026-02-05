package ru.andayleee.website.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.andayleee.website.models.Comment;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import java.util.List;

@Repository
public interface CommentRepository extends CrudRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);

    List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);

    List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId, Pageable pageable);

    Page<Comment> findByPostId(Long postId, Pageable pageable);

    long countByPostId(Long postId);

    List<Comment> findByUserId(Long userId);
}
