package com.bharathraj.portfolio.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "coding_profile")
public class CodingProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "platform_name", nullable = false, length = 80)
    private String platformName;

    @Column(name = "icon_text", length = 20)
    private String iconText;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "profile_url", nullable = false, length = 500)
    private String profileUrl;

    @Column(name = "sort_order")
    private Integer sortOrder;

    public CodingProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlatformName() { return platformName; }
    public void setPlatformName(String platformName) { this.platformName = platformName; }

    public String getIconText() { return iconText; }
    public void setIconText(String iconText) { this.iconText = iconText; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getProfileUrl() { return profileUrl; }
    public void setProfileUrl(String profileUrl) { this.profileUrl = profileUrl; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
