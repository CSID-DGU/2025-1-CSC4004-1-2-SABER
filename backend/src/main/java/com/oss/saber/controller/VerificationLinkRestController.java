package com.oss.saber.controller;

import com.oss.saber.config.TokenProvider;
import com.oss.saber.domain.VerificationLink;
import com.oss.saber.dto.*;
import com.oss.saber.dto.mapper.VerificationLinkStatusMapper;
import com.oss.saber.service.VerificationLinkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "인증 링크 API (구매자측)", description = "")
public class VerificationLinkRestController {

    @Value("${app.base-url}")
    private String baseUrl;

    private final VerificationLinkService verificationLinkService;
    private final TokenProvider tokenProvider;

    @PostMapping("/token")
    @Operation(summary = "구매자 토큰 발급", description = "구매자 식별용 토큰을 발급하고 쿠키에 저장합니다.")
    public ResponseEntity<Void> issueBuyerToken(HttpServletResponse response) {
        String sessionId = UUID.randomUUID().toString(); // 고유 세션 ID 생성
        String buyerToken = tokenProvider.generateToken(sessionId, Duration.ofDays(1));

        ResponseCookie cookie = ResponseCookie.from("buyerToken", buyerToken)
                .httpOnly(true)
                .secure(false) //local환경 테스트
                .path("/")
                .maxAge(Duration.ofDays(7))
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/settings/category")
    @Operation(summary = "카테고리 선택", description = "품목의 카테고리를 선택합니다.")
    public ResponseEntity<Long> selectCategory(@RequestBody CategorySettingRequest request,
                                               @CookieValue(name = "buyerToken", required = false) String token) {
        if (token == null) return ResponseEntity.status(401).build();

        VerificationLink link = verificationLinkService.createLink(request);
        return ResponseEntity.ok(link.getId());
    }

    @PostMapping("/link/{verificationLinkId}/settings")
    @Operation(summary = "상세 인증 방식 선택", description = "원하는 인증 방식을 설정합니다.")
    public ResponseEntity<String> setVerificationOptions(@PathVariable Long verificationLinkId,
                                                         @RequestBody VerificationLinkSettingRequest request,
                                                         @CookieValue(name = "buyerToken", required = false) String token) {
        if (token == null) return ResponseEntity.status(401).build();

        verificationLinkService.settingVerificationLink(verificationLinkId, request);
        return ResponseEntity.ok("상세 설정 완료");
    }

    @PostMapping("/link/{verificationLinkId}/link")
    @Operation(summary = "인증 링크 생성", description = "인증이 진행될 링크를 생성합니다.")
    public ResponseEntity<VerificationLinkResponse.LinkResponse> createVerificationLink(@PathVariable Long verificationLinkId,
                                                                                        @CookieValue(name = "buyerToken", required = false) String token) {
        if (token == null) return ResponseEntity.status(401).build();

        VerificationLink link = verificationLinkService.getLink(verificationLinkId);

        VerificationLinkResponse.LinkResponse response = VerificationLinkResponse.LinkResponse.builder()
                .link(baseUrl + "/saber?token=" + link.getLinkToken())
                .status(link.getStatus())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/link/{verificationLinkId}")
    @Operation(summary = "인증 진행 상태 조회", description = "인증 진행 상태를 조회합니다.")
    public ResponseEntity<VerificationLinkStatusResponse> getVerificationStatus(@PathVariable Long verificationLinkId) {

        VerificationLink link = verificationLinkService.getVerificationLink(verificationLinkId);
        verificationLinkService.checkTimeout(verificationLinkId);
        verificationLinkService.isPendingOrInProgress(verificationLinkId);

        VerificationLinkStatusResponse response = VerificationLinkStatusMapper.toResponse(link);
        return ResponseEntity.ok(response);
    }
}
