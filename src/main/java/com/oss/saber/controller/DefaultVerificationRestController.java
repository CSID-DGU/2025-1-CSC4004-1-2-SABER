package com.oss.saber.controller;

import com.oss.saber.domain.DefaultVerification;
import com.oss.saber.dto.DefaultVerificationResponse;
import com.oss.saber.dto.mapper.DefaultVerificationMapper;
import com.oss.saber.service.DefaultVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "기본 인증 방식 전체 조회 API", description = "기본 인증 방식을 모두 조회합니다.")
public class DefaultVerificationRestController {
    private final DefaultVerificationService defaultVerificationService;

    @GetMapping("/defaultVerifications")
    @Operation(summary = "인증 방식 조회")
    public ResponseEntity<List<DefaultVerificationResponse>> getDefaultVerifications() {
        List<DefaultVerification> list = defaultVerificationService.findAll();
        List<DefaultVerificationResponse> responses = list.stream().map(DefaultVerificationMapper::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}
