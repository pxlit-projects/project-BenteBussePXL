package be.pxl.companypulse.api.dto;

import be.pxl.companypulse.domain.PostStatus;

import java.time.LocalDateTime;

public record PostDTO(Long id, String title, String content, String author, LocalDateTime createdAt, PostStatus status) {
}
