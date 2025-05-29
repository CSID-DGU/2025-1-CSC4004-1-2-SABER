package com.oss.saber.service;

import com.oss.saber.domain.DefaultVerification;
import com.oss.saber.repository.DefaultVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DefaultVerificationService {
    private final DefaultVerificationRepository verificationRepository;

    public List<DefaultVerification> findAll() {
        return verificationRepository.findAll();
    }

    public DefaultVerification findById(Long id) {
        return verificationRepository.findById(id).orElse(null);
    }
}
