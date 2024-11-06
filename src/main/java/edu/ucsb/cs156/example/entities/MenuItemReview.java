package edu.ucsb.cs156.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.time.LocalDateTime;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 
 * This is a JPA entity that represents a UCSBDiningCommons
 * 
 * A UCSBDiningCommons is a dining commons at UCSB
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "menuitemreview")
public class MenuItemReview {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  
  private long itemId; // refers to the id of some item in UCSBDiningCommonsMenuItem
  private String reviewerEmail;
  private int stars;
  private LocalDateTime dateReviewed;
  private String comments;
}