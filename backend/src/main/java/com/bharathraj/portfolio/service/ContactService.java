package com.bharathraj.portfolio.service;

import com.bharathraj.portfolio.dto.ContactMessageResponse;
import com.bharathraj.portfolio.dto.ContactRequest;
import com.bharathraj.portfolio.entity.ContactMessage;
import com.bharathraj.portfolio.exception.ResourceNotFoundException;
import com.bharathraj.portfolio.repository.ContactMessageRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@Transactional
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public ContactMessageResponse save(ContactRequest req) {
        ContactMessage message = new ContactMessage();
        message.setSenderName(req.name());
        message.setSenderEmail(req.email());
        message.setMessage(req.message());
        message.setSubmittedAt(LocalDateTime.now());
        message.setStatus(ContactMessage.Status.UNREAD);

        ContactMessage saved = contactMessageRepository.save(message);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ContactMessageResponse> findAll() {
        return contactMessageRepository.findAll(Sort.by(Sort.Direction.DESC, "submittedAt", "id")).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ContactMessageResponse> findByStatus(String statusStr) {
        if (statusStr == null || statusStr.isBlank()) {
            return findAll();
        }
        ContactMessage.Status status = ContactMessage.Status.valueOf(statusStr.toUpperCase());
        return contactMessageRepository.findByStatusOrderBySubmittedAtDesc(status).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ContactMessageResponse updateStatus(Long id, String statusStr) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ContactMessage", "id", id));
        message.setStatus(ContactMessage.Status.valueOf(statusStr.toUpperCase()));
        ContactMessage saved = contactMessageRepository.save(message);
        return mapToResponse(saved);
    }

    private ContactMessageResponse mapToResponse(ContactMessage m) {
        Instant instant = m.getSubmittedAt() != null
                ? m.getSubmittedAt().atZone(ZoneId.systemDefault()).toInstant()
                : Instant.now();

        return new ContactMessageResponse(
                m.getId(),
                m.getSenderName(),
                m.getSenderEmail(),
                m.getMessage(),
                instant,
                m.getStatus() != null ? m.getStatus().name() : "UNREAD"
        );
    }
}

