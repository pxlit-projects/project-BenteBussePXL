package be.pxl.companypulse.repository;

import be.pxl.companypulse.domain.Post;
import be.pxl.companypulse.domain.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByAuthorAndStatus(String author, PostStatus status);
    List<Post> findByStatus(PostStatus waitingForApproval);
}