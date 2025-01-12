package be.pxl.companypulse.api.dto;

public record CommentRequest(Long postId, String content, String author) {
}
