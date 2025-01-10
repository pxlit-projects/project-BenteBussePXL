package be.pxl.companypulse.reviewservice.api;

import be.pxl.companypulse.reviewservice.api.dto.ReviewPostRequest;
import be.pxl.companypulse.reviewservice.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("{username}/pending")
    public ResponseEntity<?> getPendingPosts(@PathVariable String username) {
        try {
            return ResponseEntity.ok(reviewService.getPendingPosts(username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("{username}/reviewed")
    public ResponseEntity<?> getReviewedPosts(@PathVariable String username) {
        try {
            return ResponseEntity.ok(reviewService.getReviewedPosts(username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> reviewPost(@RequestBody ReviewPostRequest reviewPostRequest) {
        try {
            reviewService.reviewPost(reviewPostRequest);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
