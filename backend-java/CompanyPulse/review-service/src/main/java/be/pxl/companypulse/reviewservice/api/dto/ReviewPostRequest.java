package be.pxl.companypulse.reviewservice.api.dto;

public record ReviewPostRequest(Long postId, String postTitle, boolean approved, String comment, String reviewer, String author){
}
