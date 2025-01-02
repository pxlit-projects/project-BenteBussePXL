package be.pxl.companypulse.api.dto;

import java.time.LocalDateTime;

public record PostDTO(Long id, String title, String content, String author, LocalDateTime createdAt, Boolean isDraft) {
}
