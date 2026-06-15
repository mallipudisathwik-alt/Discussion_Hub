package com.forum.notification;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public Notification createNotification(Long userId, String type, String title, String message, Long relatedId) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setRelatedId(relatedId);
        return notificationRepository.save(n);
    }

    public void markAsRead(Long id, Long userId) {
        Notification n = notificationRepository.findById(id).orElseThrow();
        if (n.getUserId().equals(userId)) {
            n.setRead(true);
            notificationRepository.save(n);
        }
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        unread.stream().filter(n -> !n.isRead()).forEach(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}