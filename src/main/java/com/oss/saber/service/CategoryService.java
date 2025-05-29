package com.oss.saber.service;

import com.oss.saber.domain.Category;
import com.oss.saber.domain.DefaultVerification;
import com.oss.saber.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.oss.saber.domain.CategoryDefaultVerification;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("해당 카테고리가 없습니다."));
    }

    public List<DefaultVerification> getRecommendedVerifications(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 없습니다."));

        return category.getCategoryDefaultVerifications().stream()
                .filter(CategoryDefaultVerification::isRecommended)
                .map(CategoryDefaultVerification::getDefaultVerification)
                .toList();
    }
}
