package com.forum.post;

import com.forum.post.dto.PostRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<Page<Post>> getPosts(@RequestParam(required = false) Long categoryId,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long currentUserId = getUserId(auth);
        boolean isAdmin = isAdmin(auth);
        return ResponseEntity.ok(postService.getVisiblePosts(categoryId, currentUserId, isAdmin, page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Post>> searchPosts(@RequestParam String q) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long currentUserId = getUserId(auth);
        boolean isAdmin = isAdmin(auth);
        return ResponseEntity.ok(postService.searchPosts(q, currentUserId, isAdmin));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long currentUserId = getUserId(auth);
        boolean isAdmin = isAdmin(auth);
        return ResponseEntity.ok(postService.getPostById(id, currentUserId, isAdmin));
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(401).build();
        }
        Long userId = (Long) auth.getCredentials();
        String role = getRole(auth);
        return ResponseEntity.ok(postService.createPost(req, auth.getName(), userId, role));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Post>> getPendingPosts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAdmin(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(postService.getPendingPosts());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Post> approvePost(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAdmin(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(postService.approvePost(id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Post> rejectPost(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAdmin(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(postService.rejectPost(id, body.getOrDefault("reason", "")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody PostRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(401).build();
        }
        Long userId = (Long) auth.getCredentials();
        String role = getRole(auth);
        return ResponseEntity.ok(postService.updatePost(id, req, userId, role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(401).build();
        }
        Long userId = (Long) auth.getCredentials();
        String role = getRole(auth);
        postService.deletePost(id, userId, role);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<Post> upvote(@PathVariable Long id) {
        return ResponseEntity.ok(postService.upvote(id));
    }

    @PostMapping("/{id}/downvote")
    public ResponseEntity<Post> downvote(@PathVariable Long id) {
        return ResponseEntity.ok(postService.downvote(id));
    }

    @PostMapping("/{id}/pin")
    public ResponseEntity<Post> pinPost(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAdmin(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(postService.pinPost(id));
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<Post> closePost(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAdmin(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(postService.closePost(id));
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

    private Long getUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return null;
        }
        return (Long) auth.getCredentials();
    }
}