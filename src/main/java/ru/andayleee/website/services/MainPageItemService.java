package ru.andayleee.website.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.andayleee.website.models.MainPageItem;
import ru.andayleee.website.repositories.MainPageItemRepository;

@Service
public class MainPageItemService {

    private final MainPageItemRepository repository;

    public MainPageItemService(MainPageItemRepository repository) {
        this.repository = repository;
    }

    public Page<MainPageItem> getItems(Pageable pageable) {
        return repository.findAll(pageable);
    }
}
