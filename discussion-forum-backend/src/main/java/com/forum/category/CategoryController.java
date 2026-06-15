package com.forum.category;

import com.forum.notification.NotificationService;
import com.forum.post.Post;
import com.forum.post.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final PostRepository postRepository;
    private final NotificationService notificationService;

    public CategoryController(CategoryService categoryService, PostRepository postRepository,
                              NotificationService notificationService) {
        this.categoryService = categoryService;
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getApprovedCategories());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Category>> getAllCategoriesAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAdmin(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(401).build();
        }
        Long userId = (Long) auth.getCredentials();
        String role = getRole(auth);
        return ResponseEntity.ok(categoryService.createCategory(category, userId, role));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Category>> getPendingCategories() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAdmin(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(categoryService.getPendingCategories());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Category> approveCategory(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAdmin(auth)) return ResponseEntity.status(403).build();
        Category cat = categoryService.approveCategory(id);
        if (cat.getUserId() != null) {
            notificationService.createNotification(cat.getUserId(), "category_approved",
                    "Category Approved", "Your category \"" + cat.getName() + "\" has been approved.", cat.getId());
        }
        return ResponseEntity.ok(cat);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Category> rejectCategory(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAdmin(auth)) return ResponseEntity.status(403).build();
        Category cat = categoryService.rejectCategory(id);
        if (cat.getUserId() != null) {
            notificationService.createNotification(cat.getUserId(), "category_rejected",
                    "Category Rejected", "Your category \"" + cat.getName() + "\" has been rejected.", cat.getId());
        }
        return ResponseEntity.ok(cat);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAdmin(auth)) return ResponseEntity.status(403).build();
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{slug}/posts")
    public ResponseEntity<Page<Post>> getCategoryPosts(@PathVariable String slug,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        Category category = categoryService.getBySlug(slug);
        return ResponseEntity.ok(postRepository.findByCategoryId(category.getId(), PageRequest.of(page, size)));
    }

    private boolean isAdmin(Authentication auth) {
        return auth != null && auth.isAuthenticated() && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private String getRole(Authentication auth) {
        return auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("USER");
    }
}