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
    }

    public List<NotificationDTO> getNotifications(String receiver) {
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
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Notification not found"));
        notification.setRead();
        notificationRepository.save(notification);
    }
}
