package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.MenuItemReview;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * The MenuItemReviewRepository is a repository for MenuItemReview entities.
 */

@Repository
public interface MenuItemReviewRepository extends CrudRepository<MenuItemReview, Long> {
  /**
   * This method returns all UCSBDate entities with a given quarterYYYYQ.
   * @param itemId refers to the id of some menu item 
   * @return all UCSBDate entities with a given quarterYYYYQ
   */
  Iterable<MenuItemReview> findAllByItemId(long itemId);
}