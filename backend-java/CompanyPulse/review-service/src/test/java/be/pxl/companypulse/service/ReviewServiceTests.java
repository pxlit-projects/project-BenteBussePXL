package be.pxl.companypulse.service;

import be.pxl.companypulse.reviewservice.api.dto.PostDTO;
import be.pxl.companypulse.reviewservice.api.dto.ReviewDTO;
import be.pxl.companypulse.reviewservice.api.dto.ReviewPostRequest;
import be.pxl.companypulse.reviewservice.client.PostClient;
import be.pxl.companypulse.reviewservice.domain.Review;
import be.pxl.companypulse.reviewservice.domain.ReviewStatus;
import be.pxl.companypulse.reviewservice.repository.ReviewRepository;
import be.pxl.companypulse.reviewservice.service.impl.ReviewServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTests {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private PostClient postClient;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    private Review review;

    @BeforeEach
    void setUp() {
        review = Review.builder()
                .postId(1L)
                .postTitle("Test Post")
                .status(ReviewStatus.APPROVED)
                .comment("Well written post")
                .author("Author")
                .reviewedAt(LocalDateTime.now())
                .reviewer("Reviewer")
                .build();
    }

    @Test
    void reviewPost_approvesPostAndSavesReview() {
        // Arrange
        ReviewPostRequest reviewPostRequest = new ReviewPostRequest(
                1L, "Test Post", true, "Reviewer", "Well written post", "Author"
        );

        doNothing().when(postClient).approvePost("1");
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        // Act
        reviewService.reviewPost(reviewPostRequest);

        // Assert
        verify(postClient, times(1)).approvePost("1");
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void reviewPost_rejectsPostAndSavesReview() {
        // Arrange
        ReviewPostRequest reviewPostRequest = new ReviewPostRequest(
                1L, "Test Post", false, "Reviewer", "Needs improvement", "Author"
        );

        doNothing().when(postClient).rejectPost("1");
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        // Act
        reviewService.reviewPost(reviewPostRequest);

        // Assert
        verify(postClient, times(1)).rejectPost("1");
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void getPendingPosts_returnsPostsFromPostClient() {
        // Arrange
        PostDTO postDTO = new PostDTO(1L, "Pending Post", "Content", "Author", LocalDateTime.now(), null);
        when(postClient.getPendingPosts("Reviewer"))
                .thenReturn(List.of(postDTO));

        // Act
        List<PostDTO> pendingPosts = reviewService.getPendingPosts("Reviewer");

        // Assert
        assertThat(pendingPosts).hasSize(1);
        assertThat(pendingPosts.get(0).title()).isEqualTo("Pending Post");
        verify(postClient, times(1)).getPendingPosts("Reviewer");
    }

    @Test
    void getReviewedPosts_returnsApprovedAndRejectedReviews() {
        // Arrange
        when(reviewRepository.findByAuthor("Author")).thenReturn(Arrays.asList(
                new ReviewDTO(1L, 3L, "Test Post", "no", "bente", LocalDateTime.now(), ReviewStatus.REJECTED),
                new ReviewDTO(2L, 4L, "Test Post2", "yes", "liam", LocalDateTime.now(), ReviewStatus.APPROVED))
        );


        // Act
        List<ReviewDTO> reviewedPosts = reviewService.getReviewedPosts("Author");

        // Assert
        assertThat(reviewedPosts).hasSize(2);
        assertThat(reviewedPosts.get(0).postTitle()).isEqualTo("Test Post");
            assertThat(reviewedPosts.get(0).status()).isEqualTo(ReviewStatus.REJECTED);
        verify(reviewRepository, times(1)).findByAuthor("Author");
    }
}