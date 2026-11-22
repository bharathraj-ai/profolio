package com.bharathraj.portfolio.service;

import com.bharathraj.portfolio.dto.EducationRequest;
import com.bharathraj.portfolio.dto.EducationResponse;
import com.bharathraj.portfolio.entity.Education;
import com.bharathraj.portfolio.exception.ResourceNotFoundException;
import com.bharathraj.portfolio.repository.EducationRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EducationService {

    private final EducationRepository educationRepository;

    public EducationService(EducationRepository educationRepository) {
        this.educationRepository = educationRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable("public-education")
    public List<EducationResponse> findAll() {
        return educationRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder", "id")).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @CacheEvict(value = {"public-education", "public-bundle"}, allEntries = true)
    public EducationResponse create(EducationRequest req) {
        Education education = new Education();
        mapToEntity(req, education);
        Education saved = educationRepository.save(education);
        return mapToResponse(saved);
    }

    @CacheEvict(value = {"public-education", "public-bundle"}, allEntries = true)
    public EducationResponse update(Long id, EducationRequest req) {
        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education", "id", id));
        mapToEntity(req, education);
        Education saved = educationRepository.save(education);
        return mapToResponse(saved);
    }

    @CacheEvict(value = {"public-education", "public-bundle"}, allEntries = true)
    public void delete(Long id) {
        if (!educationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Education", "id", id);
        }
        educationRepository.deleteById(id);
    }

    private void mapToEntity(EducationRequest req, Education e) {
        e.setDegree(req.degree());
        e.setInstitution(req.institution());
        e.setFieldOfStudy(req.fieldOfStudy());
        e.setStartYear(req.startYear());
        e.setEndYear(req.endYear());
        e.setIsCurrent(req.isCurrent());
        e.setDescription(req.description());
        e.setSortOrder(req.sortOrder());
    }

    private EducationResponse mapToResponse(Education e) {
        return new EducationResponse(
                e.getId(),
                e.getDegree(),
                e.getInstitution(),
                e.getFieldOfStudy(),
                e.getStartYear(),
                e.getEndYear(),
                Boolean.TRUE.equals(e.getIsCurrent()),
                e.getDescription()
        );
    }
}
