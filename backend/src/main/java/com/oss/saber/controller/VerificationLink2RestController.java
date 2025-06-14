package com.oss.saber.controller;

import com.oss.saber.domain.Verification;
import com.oss.saber.domain.VerificationLink;
import com.oss.saber.domain.VerificationLinkStatus;
import com.oss.saber.domain.VerificationResult;
import com.oss.saber.dto.VerificationLinkResponse;
import com.oss.saber.dto.VerificationResponse;
import com.oss.saber.dto.mapper.VerificationMapper;
import com.oss.saber.service.VerificationLinkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/saber")
@Tag(name = "인증 API (판매자측)", description = "")
public class VerificationLink2RestController {

    private final VerificationLinkService verificationLinkService;

    @GetMapping
    @Operation(summary = "판매자 측 인증 시작", description = "링크 클릭 시 인증 세션을 시작합니다.")
    public ResponseEntity<VerificationLinkResponse.VerificationLinkSession> initVerification(@RequestParam("token") UUID linkToken, @RequestParam("visitorKey") String visitorKey) {
        VerificationLink link = verificationLinkService.initVerification(linkToken, visitorKey);

        List<VerificationResponse.infoResponse> verificationsResponse = link.getVerifications().stream()
                .map(verification -> VerificationResponse.infoResponse.builder()
                                .label(verification.getLabel()).build()).collect(Collectors.toList());

        VerificationLinkResponse.VerificationLinkSession response = VerificationLinkResponse.VerificationLinkSession.builder()
                .id(link.getId())
                .status(link.getStatus())
                .productName(link.getProductName())
                .expiresAt(link.getExpiresAt())
                .requirementText(link.getRequirementText())
                .verifications(verificationsResponse)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/link/{verificationLinkId}/agree")
    @Operation(summary = "동의 여부 제출", description = "")
    public ResponseEntity<String> agreeToTerms(@PathVariable Long verificationLinkId) {
        verificationLinkService.agreeTerms(verificationLinkId);
        return ResponseEntity.ok("동의 완료");
    }

    @GetMapping("/link/{verificationLinkId}/info")
    @Operation(summary = "인증 내용 조회", description = "인증에 대한 내용을 제공합니다.")
    public ResponseEntity<?> getVerificationLink(@PathVariable Long verificationLinkId) {
        VerificationLink link = verificationLinkService.getVerificationLink(verificationLinkId);

        boolean checkTimeout = verificationLinkService.checkTimeout(verificationLinkId);
        if (checkTimeout) {
            VerificationLinkResponse.toResponse errorResponse = VerificationLinkResponse.toResponse.builder()
                    .id(link.getId())
                    .expiresAt(link.getExpiresAt())
                    .requirementText(link.getRequirementText())
                    .status(link.getStatus())
                    .verifications(null)
                    .build();
            return ResponseEntity.ok(errorResponse);
        }

        List<Verification> verifications = link.getVerifications();
        List<VerificationResponse.infoResponse> verificationResponses = verifications.stream()
                .map(VerificationMapper::toResponse).collect(Collectors.toList());

        VerificationLinkResponse.toResponse response = VerificationLinkResponse.toResponse.builder()
                .id(link.getId())
                .requirementText(link.getRequirementText())
                .expiresAt(link.getExpiresAt())
                .status(link.getStatus())
                .productName(link.getProductName())
                .verifications(verificationResponses)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/link/{verificationLinkId}/pending-verification-ids")
    @Operation(summary = "인증되지 않은 요청 ID 목록 조회", description = "해당 링크에서 인증되지 않은 Verification의 ID만 반환합니다.")
    public ResponseEntity<List<Long>> getPendingVerificationIds(@PathVariable Long verificationLinkId) {
        VerificationLink link = verificationLinkService.getVerificationLink(verificationLinkId);

        List<Long> pendingIds = link.getVerifications().stream()
                .filter(v -> VerificationResult.PENDING.equals(v.getResult()))
                .map(Verification::getId)
                .collect(Collectors.toList());

        return ResponseEntity.ok(pendingIds);
    }

    @GetMapping("/link/{verificationLinkId}/verification-ids")
    @Operation(summary = "세부 인증 ID 목록 조회", description = "링크의 모든 세부 인증 ID를 반환합니다.")
    public ResponseEntity<List<Long>> getVerificationIds(@PathVariable Long verificationLinkId) {
        VerificationLink link = verificationLinkService.getVerificationLink(verificationLinkId);

        List<Long> ids = link.getVerifications().stream()
                .map(Verification::getId)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ids);
    }
}