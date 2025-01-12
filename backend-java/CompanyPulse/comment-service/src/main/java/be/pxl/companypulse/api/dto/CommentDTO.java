package be.pxl.companypulse.api.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record CommentDTO(Long id, Long postId, String content, String author, LocalDateTime createdAt, boolean isEdited) {
}
