package be.pxl.companypulse.reviewservice.api.dto;

import be.pxl.companypulse.reviewservice.domain.ReviewStatus;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ReviewDTO(Long id, Long postId, String postTitle, String comment, String reviewer, LocalDateTime reviewedAt, ReviewStatus status) {
}
