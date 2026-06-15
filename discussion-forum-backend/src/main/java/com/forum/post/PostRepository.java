package com.forum.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Post> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.status = 'APPROVED' AND (:categoryId IS NULL OR p.categoryId = :categoryId) AND (p.privatePost = false OR (:currentUserId IS NOT NULL AND p.userId = :currentUserId) OR :isAdmin = true) ORDER BY p.createdAt DESC")
    Page<Post> findVisiblePosts(@Param("categoryId") Long categoryId, @Param("currentUserId") Long currentUserId, @Param("isAdmin") boolean isAdmin, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.status = 'PENDING' ORDER BY p.createdAt ASC")
    List<Post> findPendingPosts();

    @Query("SELECT p FROM Post p WHERE p.status = 'APPROVED' AND (p.privatePost = false OR (:currentUserId IS NOT NULL AND p.userId = :currentUserId) OR :isAdmin = true) AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :q, '%'))) ORDER BY p.createdAt DESC")
    List<Post> searchByTitleOrContent(@Param("q") String q, @Param("currentUserId") Long currentUserId, @Param("isAdmin") boolean isAdmin);
}