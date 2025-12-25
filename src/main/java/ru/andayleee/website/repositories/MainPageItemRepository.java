package ru.andayleee.website.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.andayleee.website.models.MainPageItem;

public interface MainPageItemRepository extends JpaRepository<MainPageItem, Long> {
    Page<MainPageItem> findAll(Pageable pageable);
}