package be.pxl.companypulse.reviewservice.api.dto;

public record ReviewPostRequest(Long postId, boolean approved, String comment, String reviewer, String author){
}
