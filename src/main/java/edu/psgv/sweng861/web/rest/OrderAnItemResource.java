package edu.psgv.sweng861.web.rest;

import edu.psgv.sweng861.domain.OrderAnItem;
import edu.psgv.sweng861.repository.OrderAnItemRepository;
import edu.psgv.sweng861.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link edu.psgv.sweng861.domain.OrderAnItem}.
 */
@RestController
@RequestMapping("/api/order-an-items")
@Transactional
public class OrderAnItemResource {

    private final Logger log = LoggerFactory.getLogger(OrderAnItemResource.class);

    private static final String ENTITY_NAME = "orderAnItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderAnItemRepository orderAnItemRepository;

    public OrderAnItemResource(OrderAnItemRepository orderAnItemRepository) {
        this.orderAnItemRepository = orderAnItemRepository;
    }

    /**
     * {@code POST  /order-an-items} : Create a new orderAnItem.
     *
     * @param orderAnItem the orderAnItem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderAnItem, or with status {@code 400 (Bad Request)} if the orderAnItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<OrderAnItem> createOrderAnItem(@Valid @RequestBody OrderAnItem orderAnItem) throws URISyntaxException {
        log.debug("REST request to save OrderAnItem : {}", orderAnItem);
        if (orderAnItem.getId() != null) {
            throw new BadRequestAlertException("A new orderAnItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        orderAnItem = orderAnItemRepository.save(orderAnItem);
        return ResponseEntity.created(new URI("/api/order-an-items/" + orderAnItem.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, orderAnItem.getId().toString()))
            .body(orderAnItem);
    }

    /**
     * {@code PUT  /order-an-items/:id} : Updates an existing orderAnItem.
     *
     * @param id the id of the orderAnItem to save.
     * @param orderAnItem the orderAnItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderAnItem,
     * or with status {@code 400 (Bad Request)} if the orderAnItem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderAnItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<OrderAnItem> updateOrderAnItem(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OrderAnItem orderAnItem
    ) throws URISyntaxException {
        log.debug("REST request to update OrderAnItem : {}, {}", id, orderAnItem);
        if (orderAnItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderAnItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderAnItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        orderAnItem = orderAnItemRepository.save(orderAnItem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderAnItem.getId().toString()))
            .body(orderAnItem);
    }

    /**
     * {@code PATCH  /order-an-items/:id} : Partial updates given fields of an existing orderAnItem, field will ignore if it is null
     *
     * @param id the id of the orderAnItem to save.
     * @param orderAnItem the orderAnItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderAnItem,
     * or with status {@code 400 (Bad Request)} if the orderAnItem is not valid,
     * or with status {@code 404 (Not Found)} if the orderAnItem is not found,
     * or with status {@code 500 (Internal Server Error)} if the orderAnItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrderAnItem> partialUpdateOrderAnItem(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OrderAnItem orderAnItem
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrderAnItem partially : {}, {}", id, orderAnItem);
        if (orderAnItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderAnItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderAnItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrderAnItem> result = orderAnItemRepository
            .findById(orderAnItem.getId())
            .map(existingOrderAnItem -> {
                if (orderAnItem.getAsin() != null) {
                    existingOrderAnItem.setAsin(orderAnItem.getAsin());
                }
                if (orderAnItem.getProductTitle() != null) {
                    existingOrderAnItem.setProductTitle(orderAnItem.getProductTitle());
                }
                if (orderAnItem.getProductPrice() != null) {
                    existingOrderAnItem.setProductPrice(orderAnItem.getProductPrice());
                }
                if (orderAnItem.getProductOriginalPrice() != null) {
                    existingOrderAnItem.setProductOriginalPrice(orderAnItem.getProductOriginalPrice());
                }
                if (orderAnItem.getCurrency() != null) {
                    existingOrderAnItem.setCurrency(orderAnItem.getCurrency());
                }
                if (orderAnItem.getProductStarRating() != null) {
                    existingOrderAnItem.setProductStarRating(orderAnItem.getProductStarRating());
                }
                if (orderAnItem.getProductNumRatings() != null) {
                    existingOrderAnItem.setProductNumRatings(orderAnItem.getProductNumRatings());
                }
                if (orderAnItem.getProductUrl() != null) {
                    existingOrderAnItem.setProductUrl(orderAnItem.getProductUrl());
                }
                if (orderAnItem.getProductPhoto() != null) {
                    existingOrderAnItem.setProductPhoto(orderAnItem.getProductPhoto());
                }
                if (orderAnItem.getProductNumOffers() != null) {
                    existingOrderAnItem.setProductNumOffers(orderAnItem.getProductNumOffers());
                }
                if (orderAnItem.getProductMinimumOfferPrice() != null) {
                    existingOrderAnItem.setProductMinimumOfferPrice(orderAnItem.getProductMinimumOfferPrice());
                }
                if (orderAnItem.getIsBestSeller() != null) {
                    existingOrderAnItem.setIsBestSeller(orderAnItem.getIsBestSeller());
                }
                if (orderAnItem.getIsAmazonChoice() != null) {
                    existingOrderAnItem.setIsAmazonChoice(orderAnItem.getIsAmazonChoice());
                }
                if (orderAnItem.getIsPrime() != null) {
                    existingOrderAnItem.setIsPrime(orderAnItem.getIsPrime());
                }
                if (orderAnItem.getClimatePledgeFriendly() != null) {
                    existingOrderAnItem.setClimatePledgeFriendly(orderAnItem.getClimatePledgeFriendly());
                }
                if (orderAnItem.getSalesVolume() != null) {
                    existingOrderAnItem.setSalesVolume(orderAnItem.getSalesVolume());
                }
                if (orderAnItem.getDelivery() != null) {
                    existingOrderAnItem.setDelivery(orderAnItem.getDelivery());
                }
                if (orderAnItem.getCouponText() != null) {
                    existingOrderAnItem.setCouponText(orderAnItem.getCouponText());
                }

                return existingOrderAnItem;
            })
            .map(orderAnItemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderAnItem.getId().toString())
        );
    }

    /**
     * {@code GET  /order-an-items} : get all the orderAnItems.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderAnItems in body.
     */
    @GetMapping("")
    public List<OrderAnItem> getAllOrderAnItems() {
        log.debug("REST request to get all OrderAnItems");
        return orderAnItemRepository.findAll();
    }

    /**
     * {@code GET  /order-an-items/:id} : get the "id" orderAnItem.
     *
     * @param id the id of the orderAnItem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderAnItem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderAnItem> getOrderAnItem(@PathVariable("id") Long id) {
        log.debug("REST request to get OrderAnItem : {}", id);
        Optional<OrderAnItem> orderAnItem = orderAnItemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orderAnItem);
    }

    /**
     * {@code DELETE  /order-an-items/:id} : delete the "id" orderAnItem.
     *
     * @param id the id of the orderAnItem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderAnItem(@PathVariable("id") Long id) {
        log.debug("REST request to delete OrderAnItem : {}", id);
        orderAnItemRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
