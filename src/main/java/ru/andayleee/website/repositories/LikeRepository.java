package ru.andayleee.website.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.andayleee.website.models.Like;
import ru.andayleee.website.models.Post;
import ru.andayleee.website.models.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends CrudRepository<Like, Long> {
    List<Like> findByPostId(Long postId);

    Optional<Like> findByPostAndUser(Post post, User user);
    int countByPost(Post post);
}