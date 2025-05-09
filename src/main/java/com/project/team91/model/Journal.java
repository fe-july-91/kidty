package com.project.team91.model;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Month;
import java.time.Year;

@NoArgsConstructor
@Getter
@Setter
@MappedSuperclass
public abstract class Journal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Year year;
    @Column(nullable = false)
    private Month month;
    @Column(nullable = false)
    private short value;
    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted;

    public Journal(Long id) {
        this.id = id;
    }
}
