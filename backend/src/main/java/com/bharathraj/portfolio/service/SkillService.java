package com.bharathraj.portfolio.service;

import com.bharathraj.portfolio.dto.SkillCategoryRequest;
import com.bharathraj.portfolio.dto.SkillCategoryResponse;
import com.bharathraj.portfolio.dto.SkillRequest;
import com.bharathraj.portfolio.dto.SkillResponse;
import com.bharathraj.portfolio.entity.Skill;
import com.bharathraj.portfolio.entity.SkillCategory;
import com.bharathraj.portfolio.exception.ResourceNotFoundException;
import com.bharathraj.portfolio.repository.SkillCategoryRepository;
import com.bharathraj.portfolio.repository.SkillRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class SkillService {

    private final SkillCategoryRepository categoryRepository;
    private final SkillRepository skillRepository;

    public SkillService(SkillCategoryRepository categoryRepository, SkillRepository skillRepository) {
        this.categoryRepository = categoryRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable("public-skills")
    public List<SkillCategoryResponse> findAllCategories() {
        return categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder", "id")).stream()
                .map(this::mapCategoryToResponse)
                .toList();
    }

    @CacheEvict(value = {"public-skills", "public-bundle"}, allEntries = true)
    public SkillCategoryResponse createCategory(SkillCategoryRequest req) {
        SkillCategory cat = new SkillCategory();
        cat.setName(req.name());
        cat.setIconText(req.iconText());
        cat.setSortOrder(req.sortOrder());
        SkillCategory saved = categoryRepository.save(cat);
        return mapCategoryToResponse(saved);
    }

    @CacheEvict(value = {"public-skills", "public-bundle"}, allEntries = true)
    public SkillCategoryResponse updateCategory(Long id, SkillCategoryRequest req) {
        SkillCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SkillCategory", "id", id));
        cat.setName(req.name());
        cat.setIconText(req.iconText());
        cat.setSortOrder(req.sortOrder());
        SkillCategory saved = categoryRepository.save(cat);
        return mapCategoryToResponse(saved);
    }

    @CacheEvict(value = {"public-skills", "public-bundle"}, allEntries = true)
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("SkillCategory", "id", id);
        }
        categoryRepository.deleteById(id);
    }

    @CacheEvict(value = {"public-skills", "public-bundle"}, allEntries = true)
    public SkillResponse createSkill(SkillRequest req) {
        SkillCategory category = categoryRepository.findById(req.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("SkillCategory", "id", req.categoryId()));

        Skill skill = new Skill();
        skill.setName(req.name());
        skill.setCategory(category);
        skill.setSortOrder(req.sortOrder());
        Skill saved = skillRepository.save(skill);
        return new SkillResponse(saved.getId(), saved.getName(), saved.getSortOrder() != null ? saved.getSortOrder() : 0);
    }

    @CacheEvict(value = {"public-skills", "public-bundle"}, allEntries = true)
    public SkillResponse updateSkill(Long id, SkillRequest req) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
        if (req.categoryId() != null && !req.categoryId().equals(skill.getCategory().getId())) {
            SkillCategory newCategory = categoryRepository.findById(req.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("SkillCategory", "id", req.categoryId()));
            skill.setCategory(newCategory);
        }
        skill.setName(req.name());
        skill.setSortOrder(req.sortOrder());
        Skill saved = skillRepository.save(skill);
        return new SkillResponse(saved.getId(), saved.getName(), saved.getSortOrder() != null ? saved.getSortOrder() : 0);
    }

    @CacheEvict(value = {"public-skills", "public-bundle"}, allEntries = true)
    public void deleteSkill(Long id) {
        if (!skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill", "id", id);
        }
        skillRepository.deleteById(id);
    }

    private SkillCategoryResponse mapCategoryToResponse(SkillCategory c) {
        List<SkillResponse> skillResponses = c.getSkills().stream()
                .sorted(Comparator.comparingInt((Skill s) -> s.getSortOrder() != null ? s.getSortOrder() : 0)
                        .thenComparing(Skill::getId))
                .map(s -> new SkillResponse(s.getId(), s.getName(), s.getSortOrder() != null ? s.getSortOrder() : 0))
                .toList();

        return new SkillCategoryResponse(
                c.getId(),
                c.getName(),
                c.getIconText(),
                skillResponses
        );
    }
}
