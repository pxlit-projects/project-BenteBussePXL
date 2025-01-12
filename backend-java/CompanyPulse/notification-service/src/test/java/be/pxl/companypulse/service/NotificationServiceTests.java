package be.pxl.companypulse.service;

import be.pxl.companypulse.api.data.NotificationDTO;
import be.pxl.companypulse.api.data.NotificationRequest;
import be.pxl.companypulse.domain.Notification;
import be.pxl.companypulse.exception.NotFoundException;
import be.pxl.companypulse.repository.NotificationRepository;
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
public class NotificationServiceTests {

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
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        notificationService = new NotificationService(notificationRepository);
    }

    @Test
    void sendMessage_savesNotificationSuccessfully() {
        // Arrange
        NotificationRequest notificationRequest = new NotificationRequest(
                "Test Subject", "Test Message", "sender@test.com", "receiver@test.com", 1L
        );
        Notification notification = Notification.builder()
                .subject(notificationRequest.subject())
                .message(notificationRequest.message())
                .sender(notificationRequest.sender())
                .receiver(notificationRequest.receiver())
                .createdAt(LocalDateTime.now())
                .postId(notificationRequest.postId())
                .isRead(false)
                .build();

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        // Act
        notificationService.sendMessage(notificationRequest);

        // Assert
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void getNotifications_returnsNotificationsForReceiver() {
        // Arrange
        Notification notification1 = Notification.builder()
                .id(1L)
                .subject("Subject 1")
                .message("Message 1")
                .sender("sender@test.com")
                .receiver("receiver@test.com")
                .createdAt(LocalDateTime.now())
                .postId(1L)
                .isRead(false)
                .build();

        Notification notification2 = Notification.builder()
                .id(2L)
                .subject("Subject 2")
                .message("Message 2")
                .sender("sender2@test.com")
                .receiver("receiver@test.com")
                .createdAt(LocalDateTime.now())
                .postId(2L)
                .isRead(false)
                .build();

        when(notificationRepository.findByReceiver("receiver@test.com")).thenReturn(List.of(notification1, notification2));

        // Act
        List<NotificationDTO> notifications = notificationService.getNotifications("receiver@test.com");

        // Assert
        assertThat(notifications).hasSize(2);
        assertThat(notifications.get(0).subject()).isEqualTo("Subject 1");
        assertThat(notifications.get(1).subject()).isEqualTo("Subject 2");
    }

    @Test
    void markAsRead_updatesNotificationAsRead() {
        // Arrange
        Notification notification = Notification.builder()
                .id(1L)
                .subject("Subject")
                .message("Message")
                .sender("sender@test.com")
                .receiver("receiver@test.com")
                .createdAt(LocalDateTime.now())
                .postId(1L)
                .isRead(false)
                .build();

        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        // Act
        notificationService.markAsRead(1L);

        // Assert
        assertThat(notification.getIsRead()).isTrue();
        verify(notificationRepository, times(1)).save(notification);
    }

    @Test
    void markAsRead_throwsNotFoundExceptionForInvalidId() {
        // Arrange
        when(notificationRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class, () -> notificationService.markAsRead(1L));
    }
}
