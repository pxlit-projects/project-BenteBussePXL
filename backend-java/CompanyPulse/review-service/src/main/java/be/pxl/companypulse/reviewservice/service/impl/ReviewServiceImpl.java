package be.pxl.companypulse.reviewservice.service.impl;

import be.pxl.companypulse.reviewservice.api.dto.PostDTO;
import be.pxl.companypulse.reviewservice.api.dto.ReviewDTO;
import be.pxl.companypulse.reviewservice.api.dto.ReviewPostRequest;
import be.pxl.companypulse.reviewservice.client.PostClient;
import be.pxl.companypulse.reviewservice.domain.ReviewStatus;
import be.pxl.companypulse.reviewservice.repository.ReviewRepository;
import be.pxl.companypulse.reviewservice.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
        ReviewStatus reviewStatus;
        if (reviewPostRequest.approved()) {
            postClient.approvePost(reviewPostRequest.postId().toString());
            reviewStatus = ReviewStatus.APPROVED;
        } else {
            postClient.rejectPost(reviewPostRequest.postId().toString());
            reviewStatus = ReviewStatus.REJECTED;
        }
        reviewRepository.save(be.pxl.companypulse.reviewservice.domain.Review.builder()
                .postId(reviewPostRequest.postId())
                .postTitle(reviewPostRequest.postTitle())
                .status(reviewStatus)
                .comment(reviewPostRequest.comment())
                .author(reviewPostRequest.author())
                .reviewedAt(LocalDateTime.now())
                .reviewer(reviewPostRequest.reviewer())
                .build());
    }

    @Override
    public List<PostDTO> getPendingPosts(String username) {
        return postClient.getPendingPosts(username);
    }

    @Override
    public List<ReviewDTO> getReviewedPosts(String username) {
        return reviewRepository.findByAuthor(username)
                .stream()
                .filter(review -> review.status()== ReviewStatus.APPROVED || review.status() == ReviewStatus.REJECTED)
                .map(review -> ReviewDTO.builder()
                        .postId(review.postId())
                        .postTitle(review.postTitle())
                        .status(review.status())
                        .comment(review.comment())
                        .reviewer(review.reviewer())
                        .reviewedAt(review.reviewedAt())
                        .build())
                .toList();
    }
}
