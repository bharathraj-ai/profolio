package com.bharathraj.portfolio.service;

import com.bharathraj.portfolio.dto.CertificationRequest;
import com.bharathraj.portfolio.dto.CertificationResponse;
import com.bharathraj.portfolio.entity.Certification;
import com.bharathraj.portfolio.exception.ResourceNotFoundException;
import com.bharathraj.portfolio.repository.CertificationRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CertificationService {

    private final CertificationRepository certificationRepository;

    public CertificationService(CertificationRepository certificationRepository) {
        this.certificationRepository = certificationRepository;
    }

    @Transactional(readOnly = true)
    public List<CertificationResponse> findAll() {
        return certificationRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder", "id")).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CertificationResponse create(CertificationRequest req) {
        Certification c = new Certification();
        mapToEntity(req, c);
        Certification saved = certificationRepository.save(c);
        return mapToResponse(saved);
    }

    public CertificationResponse update(Long id, CertificationRequest req) {
        Certification c = certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "id", id));
        mapToEntity(req, c);
        Certification saved = certificationRepository.save(c);
        return mapToResponse(saved);
    }

    public void delete(Long id) {
        if (!certificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Certification", "id", id);
        }
        certificationRepository.deleteById(id);
    }

    private void mapToEntity(CertificationRequest req, Certification c) {
        c.setName(req.name());
        c.setIssuer(req.issuer());
        c.setIssuedYear(req.issuedYear());
        c.setCertUrl(req.certUrl());
        c.setSortOrder(req.sortOrder());
    }

    private CertificationResponse mapToResponse(Certification c) {
        return new CertificationResponse(
                c.getId(),
                c.getName(),
                c.getIssuer(),
                c.getIssuedYear(),
                c.getCertUrl()
        );
    }
}

