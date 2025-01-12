package be.pxl.companypulse.service;

import be.pxl.companypulse.api.dto.CommentDTO;
import be.pxl.companypulse.api.dto.CommentRequest;
import be.pxl.companypulse.api.dto.CommentUpdateRequest;
import be.pxl.companypulse.domain.Comment;
import be.pxl.companypulse.repository.CommentRepository;
import be.pxl.companypulse.service.impl.CommentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@Testcontainers
@SpringBootTest
@AutoConfigureMockMvc
public class CommentServiceTests {

    @Container
    private static MySQLContainer<?> sqlContainer = new MySQLContainer<>("mysql:latest")
            .withDatabaseName("testdepartmentdb");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry){
        registry.add("spring.datasource.url",() -> sqlContainer.getJdbcUrl());
        registry.add("spring.datasource.username",() -> sqlContainer.getUsername());
        registry.add("spring.datasource.password",() -> sqlContainer.getPassword());
    }

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentServiceImpl commentService;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        commentService = new CommentServiceImpl(commentRepository);
    }

    @Test
    void createComment_savesCommentSuccessfully() {
        // Arrange
        CommentRequest commentRequest = new CommentRequest( 1L, "Test content", "Author");
        Comment comment = Comment.builder()
                .content("Test content")
                .postId(1L)
                .author("Author")
                .createdAt(LocalDateTime.now())
                .isEdited(false)
                .build();

        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        // Act
        commentService.createComment(commentRequest);

        // Assert
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void getAllCommentsByPost_returnsFilteredComments() {
        // Arrange
        Comment comment1 = new Comment(1L, 1L, "Content 1",  "Author 1", LocalDateTime.now(), false);
        Comment comment2 = new Comment(2L, 2L,"Content 2", "Author 2", LocalDateTime.now(), false);
        when(commentRepository.findAll()).thenReturn(List.of(comment1, comment2));

        // Act
        List<CommentDTO> result = commentService.getAllCommentsByPost(1L);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).postId()).isEqualTo(1L);
    }

    @Test
    void updateComment_updatesExistingComment() {
        // Arrange
        Comment comment = new Comment(1L, 1L, "Old Content", "Author", LocalDateTime.now(), false);
        CommentUpdateRequest updateRequest = new CommentUpdateRequest("Updated Content");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        // Act
        commentService.updateComment(1L, updateRequest);

        // Assert
        assertThat(comment.getContent()).isEqualTo("Updated Content");
        verify(commentRepository, times(1)).save(comment);
    }

    @Test
    void updateComment_throwsExceptionForNonexistentComment() {
        // Arrange
        CommentUpdateRequest updateRequest = new CommentUpdateRequest("Updated Content");
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> commentService.updateComment(1L, updateRequest));
    }

    @Test
    void deleteComment_deletesCommentById() {
        // Arrange
        doNothing().when(commentRepository).deleteById(1L);

        // Act
        commentService.deleteComment(1L);

        // Assert
        verify(commentRepository, times(1)).deleteById(1L);
    }
}
