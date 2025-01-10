package be.pxl.companypulse.api.data;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record NotificationDTO(long id, String sender, String receiver, String subject, String message, LocalDateTime createdAt, long postId, boolean isRead) {
}
