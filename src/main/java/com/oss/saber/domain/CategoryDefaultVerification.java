package com.oss.saber.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category_default_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDefaultVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "method_id", nullable = false)
    private DefaultVerification defaultVerification;

    private boolean recommended;  // 추천 여부
}
