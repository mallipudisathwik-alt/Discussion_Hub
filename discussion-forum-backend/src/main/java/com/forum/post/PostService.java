package com.forum.post;

import com.forum.post.dto.PostRequest;
import com.forum.notification.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final NotificationService notificationService;

    public PostService(PostRepository postRepository, NotificationService notificationService) {
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

    public Page<Post> getVisiblePosts(Long categoryId, Long currentUserId, boolean isAdmin, int page, int size) {
        return postRepository.findVisiblePosts(categoryId, currentUserId, isAdmin, PageRequest.of(page, size));
    }

    public Post getPostById(Long id, Long currentUserId, boolean isAdmin) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (post.isPrivatePost() && !post.getUserId().equals(currentUserId) && !isAdmin) {
            throw new RuntimeException("Post not found");
        }
        post.setViewCount(post.getViewCount() + 1);
        return postRepository.save(post);
    }

    public Post createPost(PostRequest req, String username, Long userId, String role) {
        Post post = new Post();
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        post.setUserId(userId);
        post.setCategoryId(req.getCategoryId());
        post.setTags(req.getTags());
        post.setPrivatePost(req.isPrivatePost());
        post.setStatus("ADMIN".equals(role) ? PostStatus.APPROVED : PostStatus.PENDING);
        return postRepository.save(post);
    }

    public List<Post> getPendingPosts() {
        return postRepository.findPendingPosts();
    }

    public Post approvePost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setStatus(PostStatus.APPROVED);
        post.setRejectionReason(null);
        Post saved = postRepository.save(post);
        notificationService.createNotification(post.getUserId(), "post_approved",
                "Post Approved", "Your post \"" + post.getTitle() + "\" has been approved.", post.getId());
        return saved;
    }

    public Post rejectPost(Long id, String reason) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setStatus(PostStatus.REJECTED);
        post.setRejectionReason(reason);
        Post saved = postRepository.save(post);
        notificationService.createNotification(post.getUserId(), "post_rejected",
                "Post Rejected", "Your post \"" + post.getTitle() + "\" was rejected." + (reason != null && !reason.isBlank() ? " Reason: " + reason : ""), post.getId());
        return saved;
    }

    public Post updatePost(Long id, PostRequest req, Long userId, String role) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getUserId().equals(userId) && !role.equals("ADMIN")) {
            throw new RuntimeException("Not authorized to edit this post");
        }
        if (req.getTitle() != null) post.setTitle(req.getTitle());
        if (req.getContent() != null) post.setContent(req.getContent());
        if (req.getCategoryId() != null) post.setCategoryId(req.getCategoryId());
        if (req.getTags() != null) post.setTags(req.getTags());
        post.setPrivatePost(req.isPrivatePost());
        post.setUpdatedAt(java.time.LocalDateTime.now());
        return postRepository.save(post);
    }

    public void deletePost(Long id, Long userId, String role) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getUserId().equals(userId) && !role.equals("ADMIN")) {
            throw new RuntimeException("Not authorized to delete this post");
        }
        postRepository.delete(post);
    }

    public Post upvote(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setUpvotes(post.getUpvotes() + 1);
        return postRepository.save(post);
    }

    public Post downvote(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setDownvotes(post.getDownvotes() + 1);
        return postRepository.save(post);
    }

    public Post pinPost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setPinned(!post.isPinned());
        return postRepository.save(post);
    }

    public Post closePost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setClosed(!post.isClosed());
        return postRepository.save(post);
    }

    public Page<Post> getUserPosts(Long targetUserId, Long currentUserId, boolean isAdmin, int page, int size) {
        if (targetUserId.equals(currentUserId) || isAdmin) {
            return postRepository.findByUserIdOrderByCreatedAtDesc(targetUserId, PageRequest.of(page, size));
        }
        return postRepository.findVisiblePosts(null, currentUserId, false, PageRequest.of(page, size));
    }

    public List<Post> searchPosts(String q, Long currentUserId, boolean isAdmin) {
        return postRepository.searchByTitleOrContent(q, currentUserId, isAdmin);
    }
}