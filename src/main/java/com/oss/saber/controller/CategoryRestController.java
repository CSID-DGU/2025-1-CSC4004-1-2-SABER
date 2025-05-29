package com.oss.saber.controller;

import com.oss.saber.domain.Category;
import com.oss.saber.domain.DefaultVerification;
import com.oss.saber.dto.CategoryResponse;
import com.oss.saber.dto.DefaultVerificationResponse;
import com.oss.saber.dto.mapper.CategoryMapper;
import com.oss.saber.dto.mapper.DefaultVerificationMapper;
import com.oss.saber.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "품목 카테고리 API", description = "카테고리 조회 및 카테고리 별 기본 인증 방식 추천 내용 조회")
public class CategoryRestController {

    private final CategoryService categoryService;

    @GetMapping("/categories")
    @Operation(summary = "품목 카테고리 조회", description = "물품 카테고리를 모두 불러옵니다.")
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        List<Category> categories = categoryService.getAllCategories();
        List<CategoryResponse> responses = categories.stream()
                .map(CategoryMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/categories/{categoryId}/recommended-verifications")
    @Operation(summary = "추천 인증 방식 조회", description = "해당 품목에 추천된 기본 인증 방식을 조회합니다.")
    public ResponseEntity<List<DefaultVerificationResponse>> getRecommendedVerifications(@PathVariable Long categoryId) {
        List<DefaultVerification> recommended = categoryService.getRecommendedVerifications(categoryId);
        List<DefaultVerificationResponse> responses = recommended.stream()
                .map(DefaultVerificationMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}