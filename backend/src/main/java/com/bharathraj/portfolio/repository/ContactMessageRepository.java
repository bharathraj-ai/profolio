package com.bharathraj.portfolio.repository;

import com.bharathraj.portfolio.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findByStatusOrderBySubmittedAtAsc(ContactMessage.Status status);

    List<ContactMessage> findByStatusOrderBySubmittedAtDesc(ContactMessage.Status status);
}
