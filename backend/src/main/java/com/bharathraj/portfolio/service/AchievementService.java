package com.bharathraj.portfolio.service;

import com.bharathraj.portfolio.dto.AchievementRequest;
import com.bharathraj.portfolio.dto.AchievementResponse;
import com.bharathraj.portfolio.entity.Achievement;
import com.bharathraj.portfolio.exception.ResourceNotFoundException;
import com.bharathraj.portfolio.repository.AchievementRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AchievementService {

    private final AchievementRepository achievementRepository;

    public AchievementService(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }

    @Transactional(readOnly = true)
    public List<AchievementResponse> findAll() {
        return achievementRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder", "id")).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AchievementResponse create(AchievementRequest req) {
        Achievement a = new Achievement();
        mapToEntity(req, a);
        Achievement saved = achievementRepository.save(a);
        return mapToResponse(saved);
    }

    public AchievementResponse update(Long id, AchievementRequest req) {
        Achievement a = achievementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement", "id", id));
        mapToEntity(req, a);
        Achievement saved = achievementRepository.save(a);
        return mapToResponse(saved);
    }

    public void delete(Long id) {
        if (!achievementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Achievement", "id", id);
        }
        achievementRepository.deleteById(id);
    }

    private void mapToEntity(AchievementRequest req, Achievement a) {
        a.setPlaceLabel(req.placeLabel());
        a.setMedalType(req.medalType() != null ? req.medalType() : "other");
        a.setTitle(req.title());
        a.setEventName(req.eventName());
        a.setSortOrder(req.sortOrder());
    }

    private AchievementResponse mapToResponse(Achievement a) {
        return new AchievementResponse(
                a.getId(),
                a.getPlaceLabel(),
                a.getMedalType(),
                a.getTitle(),
                a.getEventName(),
                a.getSortOrder() != null ? a.getSortOrder() : 0
        );
    }
}

