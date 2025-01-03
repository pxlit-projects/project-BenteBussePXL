package be.pxl.companypulse.reviewservice.service.impl;

import be.pxl.companypulse.reviewservice.repository.ReviewRepository;
import be.pxl.companypulse.reviewservice.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
}
