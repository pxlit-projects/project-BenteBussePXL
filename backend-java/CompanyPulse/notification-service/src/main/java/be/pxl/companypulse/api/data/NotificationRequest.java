package be.pxl.companypulse.api.data;

public record NotificationRequest(String sender, String receiver, String subject, String message, Long postId) {
}
