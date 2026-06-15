package com.forum.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);

    @Query("SELECT c FROM Category c WHERE c.status = 'APPROVED' ORDER BY c.name ASC")
    List<Category> findApprovedCategories();

    @Query("SELECT c FROM Category c WHERE c.status = 'PENDING' ORDER BY c.name ASC")
    List<Category> findPendingCategories();

    @Query("SELECT c FROM Category c ORDER BY c.name ASC")
    List<Category> findAllCategories();
}