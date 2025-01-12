package be.pxl.companypulse.service;

import be.pxl.companypulse.api.dto.PostDTO;
import be.pxl.companypulse.api.dto.PostRequest;
import be.pxl.companypulse.domain.Post;
import be.pxl.companypulse.domain.PostStatus;
import be.pxl.companypulse.exception.NotFoundException;
import be.pxl.companypulse.repository.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Not;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class PostService {
    private final PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }
    public Long createPost(PostRequest postRequest) {
        log.info("Entered method createPost");
        Post post = new Post(postRequest.title(), postRequest.content(), postRequest.author(), postRequest.isDraft() ? PostStatus.DRAFT : PostStatus.WAITING_FOR_APPROVAL);
        log.info("Creating post with title: {}", post.getTitle());
        postRepository.save(post);
        log.info("Post created with id: {}", post.getId());
        return post.getId();
    }

    public List<PostDTO> getPosts() {
        log.info("Entered method getPosts");
        return postRepository.findAll().stream()
                .filter(post -> post.getStatus() == PostStatus.PUBLISHED)
                .map(post -> new PostDTO(post.getId(), post.getTitle(), post.getContent(), post.getAuthor(), post.getCreatedAt(), post.getStatus()))
                .toList();
    }

    public List<PostDTO> getDraftsAndRejects(String author) {
        log.info("Entered method getDrafts");
        return postRepository.findByAuthor(author).stream()
                .filter(post -> post.getStatus() == PostStatus.DRAFT || post.getStatus() == PostStatus.REJECTED)
                .map(post -> new PostDTO(post.getId(), post.getTitle(), post.getContent(), post.getAuthor(), post.getCreatedAt(), post.getStatus()))
                .toList();
    }

    public PostDTO getPost(Long id) {
        log.info("Entered method getPost with id: {}", id);
        return postRepository.findById(id)
                .map(post -> new PostDTO(post.getId(), post.getTitle(), post.getContent(), post.getAuthor(), post.getCreatedAt(), post.getStatus()))
                .orElseThrow(() -> {
                    log.error("Post not found with id: {}", id);
                    return new NotFoundException("Post not found");
                });
    }

    public void updatePost(Long id, PostRequest postRequest) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Post not found with id: {}", id);
                    return new NotFoundException("Post not found");
                });
        post.setTitle(postRequest.title());
        post.setContent(postRequest.content());
        post.setAuthor(postRequest.author());
        post.setCreatedAt(LocalDateTime.now());
        post.setStatus(postRequest.isDraft() ? PostStatus.DRAFT : PostStatus.WAITING_FOR_APPROVAL);
        postRepository.save(post);
    }

    public void deletePost(Long id) {
        log.info("Entered method deletePost with id: {}", id);
        postRepository.deleteById(id);
        log.info("Post deleted with id: {}", id);
    }

    public List<PostDTO> getPendingPosts(String username) {
        log.info("Entered method getPendingPosts");
        return postRepository.findByStatus(PostStatus.WAITING_FOR_APPROVAL).stream()
                .filter(post -> !post.getAuthor().equals(username))
                .map(post -> new PostDTO(post.getId(), post.getTitle(), post.getContent(), post.getAuthor(), post.getCreatedAt(), post.getStatus()))
                .toList();
    }

    public void approvePost(Long id) {
        log.info("Entered method approvePost with id: {}", id);
        Post post = postRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Post not found with id: {}", id);
                    return new NotFoundException("Post not found");
                });
        post.setStatus(PostStatus.PUBLISHED);
        log.info("Post approved with id: {}", id);
        postRepository.save(post);
        log.info("Post saved with id: {}", id);
    }

    public void rejectPost(Long id) {
        log.info("Entered method rejectPost with id: {}", id);
        Post post = postRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Post not found with id: {}", id);
                    return new NotFoundException("Post not found");
                });
        post.setStatus(PostStatus.REJECTED);
        log.info("Post rejected with id: {}", id);
        postRepository.save(post);
        log.info("Post saved with id: {}", id);
    }
}
