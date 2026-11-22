package com.bharathraj.portfolio.controller;

import com.bharathraj.portfolio.dto.ApiResponse;
import com.bharathraj.portfolio.dto.ContactMessageResponse;
import com.bharathraj.portfolio.dto.ContactRequest;
import com.bharathraj.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessageResponse>> submitContact(
            @Valid @RequestBody ContactRequest request) {
        ContactMessageResponse response = contactService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }
}

