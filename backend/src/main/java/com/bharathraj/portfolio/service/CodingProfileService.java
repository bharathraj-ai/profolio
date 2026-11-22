package com.bharathraj.portfolio.service;

import com.bharathraj.portfolio.dto.CodingProfileRequest;
import com.bharathraj.portfolio.dto.CodingProfileResponse;
import com.bharathraj.portfolio.entity.CodingProfile;
import com.bharathraj.portfolio.exception.ResourceNotFoundException;
import com.bharathraj.portfolio.repository.CodingProfileRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CodingProfileService {

    private final CodingProfileRepository codingProfileRepository;

    public CodingProfileService(CodingProfileRepository codingProfileRepository) {
        this.codingProfileRepository = codingProfileRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable("public-coding-profiles")
    public List<CodingProfileResponse> findAll() {
        return codingProfileRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder", "id")).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @CacheEvict(value = {"public-coding-profiles", "public-bundle"}, allEntries = true)
    public CodingProfileResponse create(CodingProfileRequest req) {
        CodingProfile cp = new CodingProfile();
        mapToEntity(req, cp);
        CodingProfile saved = codingProfileRepository.save(cp);
        return mapToResponse(saved);
    }

    @CacheEvict(value = {"public-coding-profiles", "public-bundle"}, allEntries = true)
    public CodingProfileResponse update(Long id, CodingProfileRequest req) {
        CodingProfile cp = codingProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CodingProfile", "id", id));
        mapToEntity(req, cp);
        CodingProfile saved = codingProfileRepository.save(cp);
        return mapToResponse(saved);
    }

    @CacheEvict(value = {"public-coding-profiles", "public-bundle"}, allEntries = true)
    public void delete(Long id) {
        if (!codingProfileRepository.existsById(id)) {
            throw new ResourceNotFoundException("CodingProfile", "id", id);
        }
        codingProfileRepository.deleteById(id);
    }

    private void mapToEntity(CodingProfileRequest req, CodingProfile cp) {
        cp.setPlatformName(req.platformName());
        cp.setIconText(req.iconText());
        cp.setDescription(req.description());
        cp.setProfileUrl(req.profileUrl());
        cp.setSortOrder(req.sortOrder());
    }

    private CodingProfileResponse mapToResponse(CodingProfile cp) {
        return new CodingProfileResponse(
                cp.getId(),
                cp.getPlatformName(),
                cp.getIconText(),
                cp.getDescription(),
                cp.getProfileUrl()
        );
    }
}
