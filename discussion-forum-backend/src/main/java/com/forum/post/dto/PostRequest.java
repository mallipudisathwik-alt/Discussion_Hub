package com.forum.post.dto;

import java.util.List;

public class PostRequest {
    private String title;
    private String content;
    private Long categoryId;
    private List<String> tags;
    private boolean privatePost;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public boolean isPrivatePost() { return privatePost; }
    public void setPrivatePost(boolean privatePost) { this.privatePost = privatePost; }
}
