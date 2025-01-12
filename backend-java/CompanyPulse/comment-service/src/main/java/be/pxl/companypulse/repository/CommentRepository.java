package be.pxl.companypulse.repository;

import be.pxl.companypulse.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
