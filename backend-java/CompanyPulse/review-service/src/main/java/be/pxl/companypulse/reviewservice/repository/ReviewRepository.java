package be.pxl.companypulse.reviewservice.repository;

import be.pxl.companypulse.reviewservice.api.dto.ReviewDTO;
import be.pxl.companypulse.reviewservice.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<ReviewDTO> findByAuthor(String username);
}
