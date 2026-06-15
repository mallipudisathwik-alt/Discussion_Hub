package com.forum.user;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, User updates, Long currentUserId, String currentRole) {
        User user = getUserById(id);
        boolean isAdmin = "ADMIN".equals(currentRole);
        if (!user.getId().equals(currentUserId) && !isAdmin) {
            throw new RuntimeException("You can only edit your own profile");
        }
        if (updates.getBio() != null) user.setBio(updates.getBio());
        if (updates.getAvatarUrl() != null) user.setAvatarUrl(updates.getAvatarUrl());
        if (isAdmin && updates.getRole() != null) user.setRole(updates.getRole());
        if (isAdmin && updates.getUsername() != null) user.setUsername(updates.getUsername());
        if (isAdmin && updates.getEmail() != null) user.setEmail(updates.getEmail());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    public void deleteUser(Long id, String currentRole) {
        if (!"ADMIN".equals(currentRole)) {
            throw new RuntimeException("Only admins can delete users");
        }
        userRepository.deleteById(id);
    }
}
