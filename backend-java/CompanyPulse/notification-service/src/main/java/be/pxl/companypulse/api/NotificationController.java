package be.pxl.companypulse.api;

import be.pxl.companypulse.api.data.NotificationRequest;
import be.pxl.companypulse.domain.Notification;
import be.pxl.companypulse.exception.NotFoundException;
import be.pxl.companypulse.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void sendNotification(@RequestBody NotificationRequest notificationRequest) {
        notificationService.sendMessage(notificationRequest);
    }

    @GetMapping("{receiver}")
    public ResponseEntity<?> getNotifications(@PathVariable String receiver) {
        try {
            return new ResponseEntity<>(notificationService.getNotifications(receiver), HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("{id}")
    public ResponseEntity<?> markAsRead(@PathVariable long id) {
        try {
            notificationService.markAsRead(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
