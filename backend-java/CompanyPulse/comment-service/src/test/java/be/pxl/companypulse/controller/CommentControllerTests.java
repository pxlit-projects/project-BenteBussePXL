package be.pxl.companypulse.controller;

import be.pxl.companypulse.api.CommentController;
import be.pxl.companypulse.api.dto.CommentDTO;
import be.pxl.companypulse.api.dto.CommentRequest;
import be.pxl.companypulse.api.dto.CommentUpdateRequest;
import be.pxl.companypulse.service.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
class CommentControllerTests {

    @Container
    private static MySQLContainer<?> sqlContainer = new MySQLContainer<>("mysql:latest")
            .withDatabaseName("testdepartmentdb")
            .withUsername("testuser")
            .withPassword("testpass");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        CommentController commentController = new CommentController(commentService);
        mockMvc = MockMvcBuilders.standaloneSetup(commentController).build();
    }

    @Test
    void createComment_Success() throws Exception {
        CommentRequest request = new CommentRequest(1L, "Test comment", "Test user");
        // Set necessary fields in request

        doNothing().when(commentService).createComment(any(CommentRequest.class));

        mockMvc.perform(post("/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        verify(commentService).createComment(any(CommentRequest.class));
    }

    @Test
    void createComment_Failure() throws Exception {
        CommentRequest request = new CommentRequest(1L, "Test comment", "Test user");
        // Set necessary fields in request

        doThrow(new RuntimeException("Error creating comment"))
                .when(commentService).createComment(any(CommentRequest.class));

        mockMvc.perform(post("/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllComments_Success() throws Exception {
        Long postId = 1L;
        List<CommentDTO> comments = Arrays.asList(new CommentDTO(1L, 1L, "test", "user", LocalDateTime.now(), false), new CommentDTO(2L, 1L, "test", "user", LocalDateTime.now(), false)); // Replace with your comment DTO
        when(commentService.getAllCommentsByPost(postId)).thenReturn(comments);

        mockMvc.perform(get("/comments/{postId}", postId))
                .andExpect(status().isOk());

        verify(commentService).getAllCommentsByPost(postId);
    }

    @Test
    void getAllComments_Failure() throws Exception {
        Long postId = 1L;
        when(commentService.getAllCommentsByPost(postId))
                .thenThrow(new RuntimeException("Error getting comments"));

        mockMvc.perform(get("/comments/{postId}", postId))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateComment_Success() throws Exception {
        Long commentId = 1L;
        CommentUpdateRequest request = new CommentUpdateRequest("Updated comment content");
        // Set necessary fields in request

        doNothing().when(commentService).updateComment(eq(commentId), any(CommentUpdateRequest.class));

        mockMvc.perform(put("/comments/{id}", commentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(commentService).updateComment(eq(commentId), any(CommentUpdateRequest.class));
    }

    @Test
    void updateComment_Failure() throws Exception {
        Long commentId = 1L;
        CommentUpdateRequest request = new CommentUpdateRequest("Updated comment content");
        // Set necessary fields in request

        doThrow(new RuntimeException("Error updating comment"))
                .when(commentService).updateComment(eq(commentId), any(CommentUpdateRequest.class));

        mockMvc.perform(put("/comments/{id}", commentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteComment_Success() throws Exception {
        Long commentId = 1L;

        doNothing().when(commentService).deleteComment(commentId);

        mockMvc.perform(delete("/comments/{id}", commentId))
                .andExpect(status().isOk());

        verify(commentService).deleteComment(commentId);
    }

    @Test
    void deleteComment_Failure() throws Exception {
        Long commentId = 1L;

        doThrow(new RuntimeException("Error deleting comment"))
                .when(commentService).deleteComment(commentId);

        mockMvc.perform(delete("/comments/{id}", commentId))
                .andExpect(status().isBadRequest());
    }
}