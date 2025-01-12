package be.pxl.companypulse.service;

import be.pxl.companypulse.api.data.NotificationDTO;
import be.pxl.companypulse.api.data.NotificationRequest;
import be.pxl.companypulse.domain.Notification;
import be.pxl.companypulse.exception.NotFoundException;
import be.pxl.companypulse.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void sendMessage(NotificationRequest notificationRequest) {
        log.info("Entered method sendMessage");
        Notification notification = Notification.builder()
                .subject(notificationRequest.subject())
                .message(notificationRequest.message())
                .sender(notificationRequest.sender())
                .receiver(notificationRequest.receiver())
                .createdAt(LocalDateTime.now())
                .postId(notificationRequest.postId())
                .isRead(false)
                .build();
        notificationRepository.save(notification);
        log.info("Message sent to: {}", notificationRequest.receiver());
    }

    public List<NotificationDTO> getNotifications(String receiver) {
        log.info("Entered method getNotifications");
        return notificationRepository.findByReceiver(receiver)
                .stream()
                .map(notification -> NotificationDTO.builder()
                        .id(notification.getId())
                        .subject(notification.getSubject())
                        .message(notification.getMessage())
                        .sender(notification.getSender())
                        .receiver(notification.getReceiver())
                        .createdAt(notification.getCreatedAt())
                        .postId(notification.getPostId())
                        .isRead(notification.getIsRead())
                        .build()).toList();
    }

    public void markAsRead(long id) {
        log.info("Entered method markAsRead with id: {}", id);
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Notification not found with id: {}", id);
                    return new NotFoundException("Notification not found");
                });
        notification.setRead();
        notificationRepository.save(notification);
        log.info("Notification marked as read with id: {}", id);
    }
}
