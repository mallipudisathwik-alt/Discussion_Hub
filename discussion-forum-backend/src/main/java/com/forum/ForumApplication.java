package com.forum;

import com.forum.user.Role;
import com.forum.user.User;
import com.forum.user.UserRepository;
import com.forum.category.Category;
import com.forum.category.CategoryRepository;
import com.forum.category.CategoryStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ForumApplication {
    public static void main(String[] args) {
        SpringApplication.run(ForumApplication.class, args);
    }

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository, CategoryRepository categoryRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@forum.com");
                admin.setPasswordHash(encoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setBio("Forum administrator");
                userRepository.save(admin);
                System.out.println("Default admin created: admin / admin123");
            }

            if (categoryRepository.count() == 0) {
                String[][] cats = {
                    {"General", "general", "General discussion", "#3B82F6"},
                    {"Technology", "technology", "Tech talks, news, and questions", "#10B981"},
                    {"Programming", "programming", "Code, algorithms, and best practices", "#F59E0B"},
                    {"DevOps", "devops", "CI/CD, Docker, Kubernetes, cloud", "#EF4444"},
                    {"Design", "design", "UI/UX, graphics, and design patterns", "#8B5CF6"},
                };
                for (String[] c : cats) {
                    Category cat = new Category();
                    cat.setName(c[0]);
                    cat.setSlug(c[1]);
                    cat.setDescription(c[2]);
                    cat.setColor(c[3]);
                    cat.setStatus(CategoryStatus.APPROVED);
                    categoryRepository.save(cat);
                }
                System.out.println("Default categories created: General, Technology, Programming, DevOps, Design");
            }
        };
    }
}
