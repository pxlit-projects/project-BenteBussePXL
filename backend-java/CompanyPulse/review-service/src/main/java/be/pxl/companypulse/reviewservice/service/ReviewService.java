package be.pxl.companypulse.reviewservice.service;

import be.pxl.companypulse.reviewservice.api.dto.PostDTO;
import be.pxl.companypulse.reviewservice.api.dto.ReviewPostRequest;

import java.util.List;

public interface ReviewService {
    void reviewPost(ReviewPostRequest reviewPostRequest);
    List<PostDTO> getPendingPosts(String username);
}
