package be.pxl.companypulse.repository;

import be.pxl.companypulse.api.data.NotificationDTO;
import be.pxl.companypulse.domain.Notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiver(String receiver);
}
