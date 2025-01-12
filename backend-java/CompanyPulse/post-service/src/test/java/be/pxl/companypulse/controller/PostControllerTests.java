package be.pxl.companypulse.controller;

import be.pxl.companypulse.api.PostController;
import be.pxl.companypulse.api.dto.PostDTO;
import be.pxl.companypulse.api.dto.PostRequest;
import be.pxl.companypulse.domain.PostStatus;
import be.pxl.companypulse.exception.NotFoundException;
import be.pxl.companypulse.service.PostService;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers
class PostControllerTests {

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
    private PostService postService;

    @BeforeEach
    void setUp() {
        PostController postController = new PostController(postService);
        mockMvc = MockMvcBuilders.standaloneSetup(postController).build();
    }

    @Test
    void createPost_Success() throws Exception {
        PostRequest request = new PostRequest("Test Title", "Test Content", "Test Author", true);
        when(postService.createPost(any(PostRequest.class))).thenReturn(1L);

        mockMvc.perform(post("/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/posts/1"));

        verify(postService).createPost(any(PostRequest.class));
    }

    @Test
    void createPost_Failure() throws Exception {
        PostRequest request = new PostRequest("Test Title", "Test Content", "Test Author", true);
        when(postService.createPost(any(PostRequest.class)))
                .thenThrow(new RuntimeException("Error creating post"));

        mockMvc.perform(post("/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void approvePost_Success() throws Exception {
        Long postId = 1L;
        doNothing().when(postService).approvePost(postId);

        mockMvc.perform(post("/posts/{id}/approve", postId))
                .andExpect(status().isOk());

        verify(postService).approvePost(postId);
    }

    @Test
    void approvePost_NotFound() throws Exception {
        Long postId = 1L;
        doThrow(new NotFoundException("Post not found"))
                .when(postService).approvePost(postId);

        mockMvc.perform(post("/posts/{id}/approve", postId))
                .andExpect(status().isNotFound());
    }

    @Test
    void rejectPost_Success() throws Exception {
        Long postId = 1L;
        doNothing().when(postService).rejectPost(postId);

        mockMvc.perform(post("/posts/{id}/reject", postId))
                .andExpect(status().isOk());

        verify(postService).rejectPost(postId);
    }

    @Test
    void rejectPost_NotFound() throws Exception {
        Long postId = 1L;
        doThrow(new NotFoundException("Post not found"))
                .when(postService).rejectPost(postId);

        mockMvc.perform(post("/posts/{id}/reject", postId))
                .andExpect(status().isNotFound());
    }

    @Test
    void getPosts_Success() throws Exception {
        List<PostDTO> posts = Arrays.asList(
                new PostDTO(1L, "title", "content", "author", LocalDateTime.now(), PostStatus.DRAFT),
                new PostDTO(2L, "title", "content", "author", LocalDateTime.now(), PostStatus.DRAFT));
        when(postService.getPosts()).thenReturn(posts);

        mockMvc.perform(get("/posts"))
                .andExpect(status().isOk());

        verify(postService).getPosts();
    }

    @Test
    void getDrafts_Success() throws Exception {
        String author = "testAuthor";
        List<PostDTO> drafts = Arrays.asList(
                new PostDTO(1L, "title", "content", "author", LocalDateTime.now(), PostStatus.DRAFT),
                new PostDTO(2L, "title", "content", "author", LocalDateTime.now(), PostStatus.DRAFT));
        when(postService.getDrafts(author)).thenReturn(drafts);

        mockMvc.perform(get("/posts/drafts/{author}", author))
                .andExpect(status().isOk());

        verify(postService).getDrafts(author);
    }

    @Test
    void getPendingPosts_Success() throws Exception {
        String username = "testUser";
        List<PostDTO> pendingPosts = Arrays.asList(
                new PostDTO(1L, "title", "content", "author", LocalDateTime.now(), PostStatus.DRAFT),
                new PostDTO(2L, "title", "content", "author", LocalDateTime.now(), PostStatus.DRAFT));
        when(postService.getPendingPosts(username)).thenReturn(pendingPosts);

        mockMvc.perform(get("/posts/pending/{username}", username))
                .andExpect(status().isOk());

        verify(postService).getPendingPosts(username);
    }

    @Test
    void getPost_Success() throws Exception {
        Long postId = 1L;
        PostDTO postDTO = new PostDTO(1L, "title", "content", "author", LocalDateTime.now(), PostStatus.DRAFT);
        when(postService.getPost(postId)).thenReturn(postDTO);

        mockMvc.perform(get("/posts/{id}", postId))
                .andExpect(status().isOk());

        verify(postService).getPost(postId);
    }

    @Test
    void getPost_NotFound() throws Exception {
        Long postId = 1L;
        when(postService.getPost(postId)).thenThrow(new NotFoundException("Post not found"));

        mockMvc.perform(get("/posts/{id}", postId))
                .andExpect(status().isNotFound());
    }

    @Test
    void updatePost_Success() throws Exception {
        Long postId = 1L;
        PostRequest request = new PostRequest("Test Title", "Test Content", "Test Author", true);
        doNothing().when(postService).updatePost(eq(postId), any(PostRequest.class));

        mockMvc.perform(put("/posts/{id}", postId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNoContent());

        verify(postService).updatePost(eq(postId), any(PostRequest.class));
    }

    @Test
    void updatePost_NotFound() throws Exception {
        Long postId = 1L;
        PostRequest request = new PostRequest("Test Title", "Test Content", "Test Author", true);
        doThrow(new NotFoundException("Post not found"))
                .when(postService).updatePost(eq(postId), any(PostRequest.class));

        mockMvc.perform(put("/posts/{id}", postId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deletePost_Success() throws Exception {
        Long postId = 1L;
        doNothing().when(postService).deletePost(postId);

        mockMvc.perform(delete("/posts/{id}", postId))
                .andExpect(status().isOk());

        verify(postService).deletePost(postId);
    }

    @Test
    void deletePost_NotFound() throws Exception {
        Long postId = 1L;
        doThrow(new NotFoundException("Post not found"))
                .when(postService).deletePost(postId);

        mockMvc.perform(delete("/posts/{id}", postId))
                .andExpect(status().isNotFound());
    }
}