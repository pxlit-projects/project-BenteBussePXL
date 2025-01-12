package be.pxl.companypulse.service;

import be.pxl.companypulse.api.dto.PostDTO;
import be.pxl.companypulse.api.dto.PostRequest;
import be.pxl.companypulse.domain.Post;
import be.pxl.companypulse.domain.PostStatus;
import be.pxl.companypulse.exception.NotFoundException;
import be.pxl.companypulse.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PostServiceTests {

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private PostService postService;

    private Post post;

    @BeforeEach
    void setUp() {
        post = new Post("Test Title", "Test Content", "Test Author", PostStatus.DRAFT);
        post.setId(1L);
        post.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void getPosts_returnsPublishedPosts() {
        // Arrange
        Post publishedPost = new Post("Published Title", "Published Content", "Test Author", PostStatus.PUBLISHED);
        publishedPost.setId(2L);
        when(postRepository.findAll()).thenReturn(List.of(post, publishedPost));

        // Act
        List<PostDTO> posts = postService.getPosts();

        // Assert
        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).status()).isEqualTo(PostStatus.PUBLISHED);
    }

    @Test
    void getDrafts_returnsDraftsForAuthor() {
        // Arrange
        when(postRepository.findByAuthorAndStatus("Test Author", PostStatus.DRAFT)).thenReturn(List.of(post));

        // Act
        List<PostDTO> drafts = postService.getDrafts("Test Author");

        // Assert
        assertThat(drafts).hasSize(1);
        assertThat(drafts.get(0).title()).isEqualTo("Test Title");
    }

    @Test
    void getPost_returnsPostById() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        // Act
        PostDTO result = postService.getPost(1L);

        // Assert
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.title()).isEqualTo("Test Title");
    }

    @Test
    void getPost_throwsNotFoundExceptionForInvalidId() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class, () -> postService.getPost(1L));
    }

    @Test
    void updatePost_updatesExistingPost() {
        // Arrange
        PostRequest updateRequest = new PostRequest("Updated Title", "Updated Content", "Test Author", false);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        // Act
        postService.updatePost(1L, updateRequest);

        // Assert
        assertThat(post.getTitle()).isEqualTo("Updated Title");
        assertThat(post.getStatus()).isEqualTo(PostStatus.WAITING_FOR_APPROVAL);
        verify(postRepository, times(1)).save(post);
    }

    @Test
    void deletePost_removesPostById() {
        // Act
        postService.deletePost(1L);

        // Assert
        verify(postRepository, times(1)).deleteById(1L);
    }

    @Test
    void approvePost_updatesPostStatusToPublished() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        // Act
        postService.approvePost(1L);

        // Assert
        assertThat(post.getStatus()).isEqualTo(PostStatus.PUBLISHED);
        verify(postRepository, times(1)).save(post);
    }

    @Test
    void rejectPost_updatesPostStatusToRejected() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        // Act
        postService.rejectPost(1L);

        // Assert
        assertThat(post.getStatus()).isEqualTo(PostStatus.REJECTED);
        verify(postRepository, times(1)).save(post);
    }

    @Test
    void getPendingPosts_returnsPendingPostsNotByAuthor() {
        // Arrange
        Post pendingPost = new Post("Pending Title", "Pending Content", "Other Author", PostStatus.WAITING_FOR_APPROVAL);
        pendingPost.setId(2L);
        when(postRepository.findByStatus(PostStatus.WAITING_FOR_APPROVAL)).thenReturn(List.of(pendingPost));

        // Act
        List<PostDTO> pendingPosts = postService.getPendingPosts("Test Author");

        // Assert
        assertThat(pendingPosts).hasSize(1);
        assertThat(pendingPosts.get(0).title()).isEqualTo("Pending Title");
    }
}