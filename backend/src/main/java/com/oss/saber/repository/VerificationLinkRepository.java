package com.oss.saber.repository;

import com.oss.saber.domain.VerificationLink;
import com.oss.saber.domain.VerificationLinkStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VerificationLinkRepository extends JpaRepository<VerificationLink, Long> {
    Optional<VerificationLink> findByLinkToken(UUID linkToken);

    Optional<VerificationLink> findById(Long verificationLinkId);

    Optional<VerificationLink> findByIdAndFirstVisitorKey(Long id, String visitorKey);

    //만료 시간이 지났지만 아직 만료 상태가 아닌 링크들을 조회
    @Query("SELECT vl FROM VerificationLink vl WHERE vl.expiresAt < :currentTime AND vl.status NOT IN :excludeStatuses")
    List<VerificationLink> findByExpiresAtBeforeAndStatusNotIn(
            @Param("currentTime") LocalDateTime currentTime,
            @Param("excludeStatuses") List<VerificationLinkStatus> excludeStatuses);

    //특정 상태의 만료된 링크 수 조회 (모니터링용)
    @Query("SELECT COUNT(vl) FROM VerificationLink vl WHERE vl.expiresAt < :currentTime AND vl.status = :status")
    long countExpiredLinksByStatus(
            @Param("currentTime") LocalDateTime currentTime,
            @Param("status") VerificationLinkStatus status);

    //특정 기간 내 만료된 링크들 조회 (분석용)
    @Query("SELECT vl FROM VerificationLink vl WHERE vl.expiresAt BETWEEN :startTime AND :endTime AND vl.status = :status")
    List<VerificationLink> findExpiredLinksBetween(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("status") VerificationLinkStatus status);
}
