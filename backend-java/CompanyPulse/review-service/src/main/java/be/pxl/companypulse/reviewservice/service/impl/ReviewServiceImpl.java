package be.pxl.companypulse.reviewservice.service.impl;

import be.pxl.companypulse.reviewservice.api.dto.PostDTO;
import be.pxl.companypulse.reviewservice.api.dto.ReviewPostRequest;
import be.pxl.companypulse.reviewservice.client.PostClient;
import be.pxl.companypulse.reviewservice.repository.ReviewRepository;
import be.pxl.companypulse.reviewservice.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final PostClient postClient;

    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository, PostClient postClient) {
        this.reviewRepository = reviewRepository;
        this.postClient = postClient;
    }

    @Override
    public void reviewPost(ReviewPostRequest reviewPostRequest) {
        if (reviewPostRequest.approved()) {
            postClient.approvePost(reviewPostRequest.postId().toString());
        } else {
            postClient.rejectPost(reviewPostRequest.postId().toString());
        }
    }

    @Override
    public List<PostDTO> getPendingPosts() {
        return postClient.getPendingPosts();
    }
}
