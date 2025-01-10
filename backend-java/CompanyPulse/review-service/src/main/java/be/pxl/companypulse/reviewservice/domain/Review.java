package be.pxl.companypulse.reviewservice.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long postId;
    private String postTitle;
    private String comment;
    private String reviewer;
    private String author;
    private LocalDateTime reviewedAt;
    @Enumerated(EnumType.STRING)
    private ReviewStatus status;
}
