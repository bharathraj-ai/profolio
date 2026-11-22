package com.bharathraj.portfolio.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "certification")
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "issuer", length = 200)
    private String issuer;

    @Column(name = "issued_year")
    private Integer issuedYear;

    @Column(name = "cert_url", length = 500)
    private String certUrl;

    @Column(name = "sort_order")
    private Integer sortOrder;

    public Certification() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }

    public Integer getIssuedYear() { return issuedYear; }
    public void setIssuedYear(Integer issuedYear) { this.issuedYear = issuedYear; }

    public String getCertUrl() { return certUrl; }
    public void setCertUrl(String certUrl) { this.certUrl = certUrl; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
