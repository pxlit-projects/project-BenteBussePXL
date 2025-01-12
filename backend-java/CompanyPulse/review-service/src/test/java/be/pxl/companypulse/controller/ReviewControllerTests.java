package be.pxl.companypulse.controller;

import be.pxl.companypulse.reviewservice.api.ReviewController;
import be.pxl.companypulse.reviewservice.api.dto.PostDTO;
import be.pxl.companypulse.reviewservice.api.dto.ReviewDTO;
import be.pxl.companypulse.reviewservice.api.dto.ReviewPostRequest;
import be.pxl.companypulse.reviewservice.domain.ReviewStatus;
import be.pxl.companypulse.reviewservice.service.ReviewService;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers
class ReviewControllerTests {

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
    private ReviewService reviewService;

    @BeforeEach
    void setUp() {
        ReviewController reviewController = new ReviewController(reviewService);
        mockMvc = MockMvcBuilders.standaloneSetup(reviewController).build();
    }

    @Test
    void getPendingPosts_Failure() throws Exception {
        String username = "testUser";
        when(reviewService.getPendingPosts(anyString()))
                .thenThrow(new RuntimeException("Error getting pending posts"));

        mockMvc.perform(get("/reviews/{username}/pending", username))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error getting pending posts"));
    }


    @Test
    void getReviewedPosts_Failure() throws Exception {
        String username = "testUser";
        when(reviewService.getReviewedPosts(anyString()))
                .thenThrow(new RuntimeException("Error getting reviewed posts"));

        mockMvc.perform(get("/reviews/{username}/reviewed", username))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error getting reviewed posts"));
    }

    @Test
    void reviewPost_Success() throws Exception {
        ReviewPostRequest request = new ReviewPostRequest(
                1L, "Test Post", false, "Reviewer", "Needs improvement", "Author");
        doNothing().when(reviewService).reviewPost(any(ReviewPostRequest.class));

        mockMvc.perform(post("/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(reviewService).reviewPost(any(ReviewPostRequest.class));
    }

    @Test
    void reviewPost_Failure() throws Exception {
        ReviewPostRequest request = new ReviewPostRequest(
                1L, "Test Post", false, "Reviewer", "Needs improvement", "Author");
        doThrow(new RuntimeException("Error reviewing post"))
                .when(reviewService).reviewPost(any(ReviewPostRequest.class));

        mockMvc.perform(post("/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error reviewing post"));
    }
}