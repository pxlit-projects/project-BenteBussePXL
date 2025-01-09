package be.pxl.companypulse.service;

import be.pxl.companypulse.api.dto.PostDTO;
import be.pxl.companypulse.api.dto.PostRequest;
import be.pxl.companypulse.domain.Post;
import be.pxl.companypulse.domain.PostStatus;
import be.pxl.companypulse.exception.NotFoundException;
import be.pxl.companypulse.repository.PostRepository;
import org.aspectj.weaver.ast.Not;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }
    public Long createPost(PostRequest postRequest) {
        Post post = new Post(postRequest.title(), postRequest.content(), postRequest.author(), postRequest.isDraft() ? PostStatus.DRAFT : PostStatus.WAITING_FOR_APPROVAL);
        postRepository.save(post);
        return post.getId();
    }

    public List<PostDTO> getPosts() {
        return postRepository.findAll().stream()
                .filter(post -> post.getStatus() == PostStatus.PUBLISHED)
                .map(post -> new PostDTO(post.getId(), post.getTitle(), post.getContent(), post.getAuthor(), post.getCreatedAt(), post.getStatus()))
                .toList();
    }

    public List<PostDTO> getDrafts(String author) {
        return postRepository.findByAuthorAndStatus(author, PostStatus.DRAFT).stream()
                .map(post -> new PostDTO(post.getId(), post.getTitle(), post.getContent(), post.getAuthor(), post.getCreatedAt(), post.getStatus()))
                .toList();
    }

    public PostDTO getPost(Long id) {
        return postRepository.findById(id)
                .map(post -> new PostDTO(post.getId(), post.getTitle(), post.getContent(), post.getAuthor(), post.getCreatedAt(), post.getStatus()))
                .orElseThrow(() -> new NotFoundException("Post not found"));
    }

    public void updatePost(Long id, PostRequest postRequest) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Post not found"));
        post.setTitle(postRequest.title());
        post.setContent(postRequest.content());
        post.setAuthor(postRequest.author());
        post.setCreatedAt(LocalDateTime.now());
        post.setStatus(postRequest.isDraft() ? PostStatus.DRAFT : PostStatus.WAITING_FOR_APPROVAL);
        postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public List<PostDTO> getPendingPosts(String username) {
        return postRepository.findByStatus(PostStatus.WAITING_FOR_APPROVAL).stream()
                .filter(post -> !post.getAuthor().equals(username))
                .map(post -> new PostDTO(post.getId(), post.getTitle(), post.getContent(), post.getAuthor(), post.getCreatedAt(), post.getStatus()))
                .toList();
    }

    public void approvePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Post not found"));
        post.setStatus(PostStatus.PUBLISHED);
        postRepository.save(post);
    }

    public void rejectPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Post not found"));
        post.setStatus(PostStatus.REJECTED);
        postRepository.save(post);
    }
}
