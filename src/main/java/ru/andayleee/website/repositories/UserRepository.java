package ru.andayleee.website.repositories;
import ru.andayleee.website.models.User;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
    // Дополнительно можно добавить свои запросы
}
