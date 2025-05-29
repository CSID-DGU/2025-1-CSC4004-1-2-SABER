package com.oss.saber.dto.mapper;

import com.oss.saber.domain.DefaultVerification;
import com.oss.saber.dto.DefaultVerificationResponse;

public class DefaultVerificationMapper {

    public static DefaultVerificationResponse toResponse(DefaultVerification verification) {
        return DefaultVerificationResponse.builder()
                .id(verification.getId())
                .verificationContent(verification.getContent())
                .build();
    }
}