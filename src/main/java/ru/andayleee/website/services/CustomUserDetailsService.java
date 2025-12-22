package ru.andayleee.website.services;

import ru.andayleee.website.models.User;
import ru.andayleee.website.repositories.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService{
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository repo) {
        this.userRepository = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().replace("ROLE_", ""))
                .build();
    }
}
