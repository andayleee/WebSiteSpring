package ru.andayleee.website.repositories;
import ru.andayleee.website.models.User;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
