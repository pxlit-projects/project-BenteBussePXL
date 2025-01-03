package be.pxl.companypulse.reviewservice.repository;

import be.pxl.companypulse.reviewservice.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
}
