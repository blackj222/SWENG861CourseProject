package edu.psgv.sweng861.repository;

import edu.psgv.sweng861.domain.OrderAnItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OrderAnItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderAnItemRepository extends JpaRepository<OrderAnItem, Long> {}
