package be.pxl.companypulse.reviewservice.api.dto;

public record ReviewDTO(Long id, Long postId, String comment, String reviewer, String status) {
}
