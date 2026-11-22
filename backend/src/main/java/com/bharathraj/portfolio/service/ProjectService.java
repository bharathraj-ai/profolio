package com.bharathraj.portfolio.service;

import com.bharathraj.portfolio.dto.ProjectRequest;
import com.bharathraj.portfolio.dto.ProjectResponse;
import com.bharathraj.portfolio.entity.Project;
import com.bharathraj.portfolio.entity.ProjectFeature;
import com.bharathraj.portfolio.entity.ProjectTechnology;
import com.bharathraj.portfolio.exception.ResourceNotFoundException;
import com.bharathraj.portfolio.repository.ProjectRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> findAll() {
        return projectRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder", "id")).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse findById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return mapToResponse(project);
    }

    public ProjectResponse create(ProjectRequest req) {
        Project project = new Project();
        project.setName(req.name());
        project.setTagline(req.tagline());
        project.setDescription(req.description());
        project.setGithubUrl(req.githubUrl());
        project.setDemoUrl(req.demoUrl());
        project.setImageUrl(req.imageUrl());
        project.setIsFeatured(req.isFeatured());
        project.setSortOrder(req.sortOrder());
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        if (req.technologies() != null) {
            int order = 0;
            for (String techName : req.technologies()) {
                if (techName != null && !techName.isBlank()) {
                    ProjectTechnology tech = new ProjectTechnology();
                    tech.setName(techName.trim());
                    tech.setProject(project);
                    tech.setSortOrder(order++);
                    project.getTechnologies().add(tech);
                }
            }
        }

        if (req.features() != null) {
            int order = 0;
            for (String featText : req.features()) {
                if (featText != null && !featText.isBlank()) {
                    ProjectFeature feat = new ProjectFeature();
                    feat.setFeatureText(featText.trim());
                    feat.setProject(project);
                    feat.setSortOrder(order++);
                    project.getFeatures().add(feat);
                }
            }
        }

        Project saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    public ProjectResponse update(Long id, ProjectRequest req) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        project.setName(req.name());
        project.setTagline(req.tagline());
        project.setDescription(req.description());
        project.setGithubUrl(req.githubUrl());
        project.setDemoUrl(req.demoUrl());
        project.setImageUrl(req.imageUrl());
        project.setIsFeatured(req.isFeatured());
        project.setSortOrder(req.sortOrder());
        project.setUpdatedAt(LocalDateTime.now());

        project.getTechnologies().clear();
        if (req.technologies() != null) {
            int order = 0;
            for (String techName : req.technologies()) {
                if (techName != null && !techName.isBlank()) {
                    ProjectTechnology tech = new ProjectTechnology();
                    tech.setName(techName.trim());
                    tech.setProject(project);
                    tech.setSortOrder(order++);
                    project.getTechnologies().add(tech);
                }
            }
        }

        project.getFeatures().clear();
        if (req.features() != null) {
            int order = 0;
            for (String featText : req.features()) {
                if (featText != null && !featText.isBlank()) {
                    ProjectFeature feat = new ProjectFeature();
                    feat.setFeatureText(featText.trim());
                    feat.setProject(project);
                    feat.setSortOrder(order++);
                    project.getFeatures().add(feat);
                }
            }
        }

        Project saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project", "id", id);
        }
        projectRepository.deleteById(id);
    }

    private ProjectResponse mapToResponse(Project p) {
        List<String> techs = p.getTechnologies().stream()
                .sorted(Comparator.comparingInt((ProjectTechnology t) -> t.getSortOrder() != null ? t.getSortOrder() : 0)
                        .thenComparing(ProjectTechnology::getId))
                .map(ProjectTechnology::getName)
                .toList();

        List<String> feats = p.getFeatures().stream()
                .sorted(Comparator.comparingInt((ProjectFeature f) -> f.getSortOrder() != null ? f.getSortOrder() : 0)
                        .thenComparing(ProjectFeature::getId))
                .map(ProjectFeature::getFeatureText)
                .toList();

        return new ProjectResponse(
                p.getId(),
                p.getName(),
                p.getTagline(),
                p.getDescription(),
                p.getGithubUrl(),
                p.getDemoUrl(),
                p.getImageUrl(),
                Boolean.TRUE.equals(p.getIsFeatured()),
                p.getSortOrder() != null ? p.getSortOrder() : 0,
                techs,
                feats
        );
    }
}
