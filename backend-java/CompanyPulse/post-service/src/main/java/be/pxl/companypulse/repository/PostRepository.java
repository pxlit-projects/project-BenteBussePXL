package be.pxl.companypulse.repository;

import be.pxl.companypulse.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByAuthorAndIsDraft(String author, Boolean isDraft);
}