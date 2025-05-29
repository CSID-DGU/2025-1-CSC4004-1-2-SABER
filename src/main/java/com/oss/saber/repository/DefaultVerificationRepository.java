package com.oss.saber.repository;

import com.oss.saber.domain.DefaultVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DefaultVerificationRepository extends JpaRepository<DefaultVerification, Long> {

}
