package ru.andayleee.website.repositories;
import ru.andayleee.website.models.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    @Query(value = "SELECT * FROM users WHERE LOWER(email) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(name) LIKE LOWER(CONCAT('%', :term, '%')) LIMIT 5", 
       nativeQuery = true)
    List<User> searchUsers(@Param("term") String term);
}
