package be.pxl.companypulse.controller;

import be.pxl.companypulse.api.NotificationController;
import be.pxl.companypulse.api.data.NotificationDTO;
import be.pxl.companypulse.api.data.NotificationRequest;
import be.pxl.companypulse.domain.Notification;
import be.pxl.companypulse.exception.NotFoundException;
import be.pxl.companypulse.service.NotificationService;
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
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
class NotificationControllerTests {

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
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        NotificationController notificationController = new NotificationController(notificationService);
        mockMvc = MockMvcBuilders.standaloneSetup(notificationController).build();
    }

    @Test
    void sendNotification_Success() throws Exception {
        NotificationRequest request = new NotificationRequest("user1", "user2", "Test message", "Test subject", 1L);
        // Set necessary fields in request

        doNothing().when(notificationService).sendMessage(any(NotificationRequest.class));

        mockMvc.perform(post("/notifications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        verify(notificationService).sendMessage(any(NotificationRequest.class));
    }

    @Test
    void getNotifications_Success() throws Exception {
        String receiver = "user@example.com";
        List<NotificationDTO> notifications = Arrays.asList(
                new NotificationDTO(1L, "user2", "Test message", "Test subject", "message", LocalDateTime.now(), 1L, false),
                new NotificationDTO(2L, "user2", "Test message", "Test subject", "message", LocalDateTime.now(), 1L, false));
        when(notificationService.getNotifications(receiver)).thenReturn(notifications);

        mockMvc.perform(get("/notifications/{receiver}", receiver))
                .andExpect(status().isOk());

        verify(notificationService).getNotifications(receiver);
    }

    @Test
    void getNotifications_NotFound() throws Exception {
        String receiver = "nonexistent@example.com";
        when(notificationService.getNotifications(anyString()))
                .thenThrow(new NotFoundException("Receiver not found"));

        mockMvc.perform(get("/notifications/{receiver}", receiver))
                .andExpect(status().isNotFound());
    }

    @Test
    void getNotifications_BadRequest() throws Exception {
        String receiver = "invalid@example.com";
        when(notificationService.getNotifications(anyString()))
                .thenThrow(new RuntimeException("Invalid request"));

        mockMvc.perform(get("/notifications/{receiver}", receiver))
                .andExpect(status().isBadRequest());
    }

    @Test
    void markAsRead_Success() throws Exception {
        long notificationId = 1L;
        doNothing().when(notificationService).markAsRead(notificationId);

        mockMvc.perform(post("/notifications/{id}", notificationId))
                .andExpect(status().isOk());

        verify(notificationService).markAsRead(notificationId);
    }

    @Test
    void markAsRead_NotFound() throws Exception {
        long notificationId = 999L;
        doThrow(new NotFoundException("Notification not found"))
                .when(notificationService).markAsRead(anyLong());

        mockMvc.perform(post("/notifications/{id}", notificationId))
                .andExpect(status().isNotFound());
    }

    @Test
    void markAsRead_BadRequest() throws Exception {
        long notificationId = 1L;
        doThrow(new RuntimeException("Invalid request"))
                .when(notificationService).markAsRead(anyLong());

        mockMvc.perform(post("/notifications/{id}", notificationId))
                .andExpect(status().isBadRequest());
    }
}