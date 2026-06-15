package com.forum.category;

import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getApprovedCategories() {
        return categoryRepository.findApprovedCategories();
    }

    public List<Category> getPendingCategories() {
        return categoryRepository.findPendingCategories();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAllCategories();
    }

    public Category createCategory(Category category, Long userId, String role) {
        String slug = category.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        category.setSlug(slug);
        category.setUserId(userId);
        category.setStatus("ADMIN".equals(role) ? CategoryStatus.APPROVED : CategoryStatus.PENDING);
        try {
            return categoryRepository.save(category);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Category with name '" + category.getName() + "' already exists");
        }
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public Category getBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category approveCategory(Long id) {
        Category cat = getById(id);
        cat.setStatus(CategoryStatus.APPROVED);
        return categoryRepository.save(cat);
    }

    public Category rejectCategory(Long id) {
        Category cat = getById(id);
        cat.setStatus(CategoryStatus.REJECTED);
        return categoryRepository.save(cat);
    }
}