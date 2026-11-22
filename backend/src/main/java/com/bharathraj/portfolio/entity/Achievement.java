package com.bharathraj.portfolio.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "achievement")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "place_label", nullable = false, length = 20)
    private String placeLabel;

    @Column(name = "medal_type", nullable = false, length = 10)
    private String medalType;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "event_name", nullable = false, length = 200)
    private String eventName;

    @Column(name = "sort_order")
    private Integer sortOrder;

    public Achievement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlaceLabel() { return placeLabel; }
    public void setPlaceLabel(String placeLabel) { this.placeLabel = placeLabel; }

    public String getMedalType() { return medalType; }
    public void setMedalType(String medalType) { this.medalType = medalType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
