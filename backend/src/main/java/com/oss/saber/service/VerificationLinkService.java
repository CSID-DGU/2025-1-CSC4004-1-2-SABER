package com.oss.saber.service;

import com.oss.saber.domain.*;
import com.oss.saber.dto.*;
import com.oss.saber.repository.DefaultVerificationRepository;
import com.oss.saber.repository.VerificationLinkRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class VerificationLinkService {
    private final VerificationLinkRepository verificationLinkRepository;
    private final DefaultVerificationRepository defaultVerificationRepository;

    public VerificationLink createLink(CategorySettingRequest request) {
        VerificationLink link = VerificationLink.builder()
                .productName(request.getProductName())
                .linkToken(UUID.randomUUID())
                .createdAt(LocalDateTime.now())
                .status(VerificationLinkStatus.PENDING)
                .termsAgreedAt(LocalDateTime.now())
                .permissionsAgreedAt(LocalDateTime.now())
                .build();

        return verificationLinkRepository.save(link);
    }

    public VerificationLink settingVerificationLink(Long verificationLinkId, VerificationLinkSettingRequest request) {
        VerificationLink verificationLink = verificationLinkRepository.findById(verificationLinkId)
                .orElseThrow(() -> new IllegalArgumentException("해당 인증 링크가 존재하지 않습니다."));

        if (request.getLimitedMinutes() != null) {
            verificationLink.setExpiresAt(LocalDateTime.now().plusMinutes(request.getLimitedMinutes()));
        }

        verificationLink.setRequirementText(request.getCustomRequests());
        System.out.println(request.getCustomRequests());

        List<Long> selectedMethodIds = request.getVerificationMethods();
        if (selectedMethodIds != null && !selectedMethodIds.isEmpty()) {
            List<DefaultVerification> selectedVerifications = defaultVerificationRepository.findAllById(selectedMethodIds);

            for (DefaultVerification selected : selectedVerifications) {
                Verification verification = Verification.builder()
                        .label(selected.getContent())
                        .result(VerificationResult.PENDING)
                        .verificationLink(verificationLink)
                        .build();

                verificationLink.addVerification(verification);
            }
        }

        return verificationLinkRepository.save(verificationLink);
    }

    //----------------------------------------------------------------------------------


    //----------------------------------------------------------------------------------

    public VerificationLink initVerification(UUID linkToken, String visitorKey) {
        VerificationLink link = verificationLinkRepository.findByLinkToken(linkToken)
                .orElseThrow(() -> new EntityNotFoundException("유효하지 않은 인증 링크입니다."));

        if (isExpiredOrCompleted(link.getStatus()) && !link.getFirstVisitorKey().equals(visitorKey)) {
            throw new IllegalStateException("이미 만료되었거나 완료된 인증입니다.");
        }

        if (link.getFirstAccessedAt() == null) {
            link.setFirstAccessedAt(LocalDateTime.now());
            link.setFirstVisitorKey(visitorKey);
        }

        link.setStatus(VerificationLinkStatus.IN_PROGRESS);
        link.setStartedAt(LocalDateTime.now());
        verificationLinkRepository.save(link);

        return link;
    }

    public void agreeTerms(Long linkId) {
        VerificationLink link = getLink(linkId);
        if (link.getTermsAgreedAt() == null) {
            link.setTermsAgreedAt(LocalDateTime.now());
        }
        if (link.getPermissionsAgreedAt() == null) {
            link.setPermissionsAgreedAt(LocalDateTime.now());
        }
        verificationLinkRepository.save(link);
    }

    public boolean checkTimeout(Long linkId) {
        VerificationLink link = getLink(linkId);
        if(link.getExpiresAt() != null && link.getExpiresAt().isBefore(LocalDateTime.now())) {
            link.setTerminatedAt(LocalDateTime.now());
            link.setTerminatedReason(TerminatedReason.TIMEOUT);
            link.setStatus(VerificationLinkStatus.TERMINATED);
            verificationLinkRepository.save(link);
            return true;
        }
        return false;
    }

    public boolean isPendingOrInProgress(Long linkId) {
        VerificationLink link = getLink(linkId);
        return link.getStatus() == VerificationLinkStatus.IN_PROGRESS || link.getStatus() == VerificationLinkStatus.PENDING;
    }

    private boolean isExpiredOrCompleted(VerificationLinkStatus status) {
        return switch (status) {
            case EXPIRED, COMPLETED, TERMINATED-> true;
            default -> false;
        };
    }

    public VerificationLink getLink(Long id) {
        return verificationLinkRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("인증 링크를 찾을 수 없습니다."));
    }

    //----------------------------------------------------------------------------------------

    // 링크 시작 시간 기록
    public void markStarted(Long verificationLinkId) {
        VerificationLink verificationLink = verificationLinkRepository.findById(verificationLinkId)
                .orElseThrow(() -> new IllegalArgumentException("해당 인증 링크가 존재하지 않습니다."));
        verificationLink.setStartedAt(LocalDateTime.now());
        verificationLink.setFirstAccessedAt(LocalDateTime.now());
        verificationLink.setLastActiveAt(LocalDateTime.now());
        verificationLinkRepository.save(verificationLink);
    }

    public VerificationLink getVerificationLink(Long verificationLinkId) {
        return verificationLinkRepository.findById(verificationLinkId)
                .orElseThrow(() -> new IllegalArgumentException("해당 인증 링크가 존재하지 않습니다."));
    }

    // 링크 만료 처리
    public void expireLink(Long verificationLinkId) {
        VerificationLink verificationLink = verificationLinkRepository.findById(verificationLinkId)
                .orElseThrow(() -> new IllegalArgumentException("해당 인증 링크가 존재하지 않습니다."));

        verificationLink.setExpiresAt(LocalDateTime.now());
        verificationLink.setStatus(VerificationLinkStatus.EXPIRED); // 만료 상태로 설정
        verificationLinkRepository.save(verificationLink);
    }

    // 마지막 활동 시간 갱신
    public void updateLastActive(Long verificationLinkId) {
        VerificationLink verificationLink = verificationLinkRepository.findById(verificationLinkId)
                .orElseThrow(() -> new IllegalArgumentException("해당 인증 링크가 존재하지 않습니다."));

        verificationLink.setLastActiveAt(LocalDateTime.now());
        verificationLinkRepository.save(verificationLink);
    }

    // 링크 상태 갱신 (예: 유효성 검사 후)
    public void updateLinkStatus(Long verificationLinkId, VerificationLinkStatus status) {
        VerificationLink verificationLink = verificationLinkRepository.findById(verificationLinkId)
                .orElseThrow(() -> new IllegalArgumentException("해당 인증 링크가 존재하지 않습니다."));

        verificationLink.setStatus(status);
        verificationLinkRepository.save(verificationLink);
    }
}



