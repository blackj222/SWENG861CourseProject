package edu.psgv.sweng861.web.rest;

import static edu.psgv.sweng861.domain.OrderAnItemAsserts.*;
import static edu.psgv.sweng861.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.psgv.sweng861.IntegrationTest;
import edu.psgv.sweng861.domain.OrderAnItem;
import edu.psgv.sweng861.repository.OrderAnItemRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OrderAnItemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrderAnItemResourceIT {

    private static final String DEFAULT_ASIN = "AAAAAAAAAA";
    private static final String UPDATED_ASIN = "BBBBBBBBBB";

    private static final String DEFAULT_PRODUCT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_PRODUCT_PRICE = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_PRICE = "BBBBBBBBBB";

    private static final String DEFAULT_PRODUCT_ORIGINAL_PRICE = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_ORIGINAL_PRICE = "BBBBBBBBBB";

    private static final String DEFAULT_CURRENCY = "AAAAAAAAAA";
    private static final String UPDATED_CURRENCY = "BBBBBBBBBB";

    private static final String DEFAULT_PRODUCT_STAR_RATING = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_STAR_RATING = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRODUCT_NUM_RATINGS = 1;
    private static final Integer UPDATED_PRODUCT_NUM_RATINGS = 2;

    private static final String DEFAULT_PRODUCT_URL = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_URL = "BBBBBBBBBB";

    private static final String DEFAULT_PRODUCT_PHOTO = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_PHOTO = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRODUCT_NUM_OFFERS = 1;
    private static final Integer UPDATED_PRODUCT_NUM_OFFERS = 2;

    private static final String DEFAULT_PRODUCT_MINIMUM_OFFER_PRICE = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_MINIMUM_OFFER_PRICE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_BEST_SELLER = false;
    private static final Boolean UPDATED_IS_BEST_SELLER = true;

    private static final Boolean DEFAULT_IS_AMAZON_CHOICE = false;
    private static final Boolean UPDATED_IS_AMAZON_CHOICE = true;

    private static final Boolean DEFAULT_IS_PRIME = false;
    private static final Boolean UPDATED_IS_PRIME = true;

    private static final Boolean DEFAULT_CLIMATE_PLEDGE_FRIENDLY = false;
    private static final Boolean UPDATED_CLIMATE_PLEDGE_FRIENDLY = true;

    private static final String DEFAULT_SALES_VOLUME = "AAAAAAAAAA";
    private static final String UPDATED_SALES_VOLUME = "BBBBBBBBBB";

    private static final String DEFAULT_DELIVERY = "AAAAAAAAAA";
    private static final String UPDATED_DELIVERY = "BBBBBBBBBB";

    private static final String DEFAULT_COUPON_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_COUPON_TEXT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/order-an-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private OrderAnItemRepository orderAnItemRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderAnItemMockMvc;

    private OrderAnItem orderAnItem;

    private OrderAnItem insertedOrderAnItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderAnItem createEntity(EntityManager em) {
        OrderAnItem orderAnItem = new OrderAnItem()
            .asin(DEFAULT_ASIN)
            .productTitle(DEFAULT_PRODUCT_TITLE)
            .productPrice(DEFAULT_PRODUCT_PRICE)
            .productOriginalPrice(DEFAULT_PRODUCT_ORIGINAL_PRICE)
            .currency(DEFAULT_CURRENCY)
            .productStarRating(DEFAULT_PRODUCT_STAR_RATING)
            .productNumRatings(DEFAULT_PRODUCT_NUM_RATINGS)
            .productUrl(DEFAULT_PRODUCT_URL)
            .productPhoto(DEFAULT_PRODUCT_PHOTO)
            .productNumOffers(DEFAULT_PRODUCT_NUM_OFFERS)
            .productMinimumOfferPrice(DEFAULT_PRODUCT_MINIMUM_OFFER_PRICE)
            .isBestSeller(DEFAULT_IS_BEST_SELLER)
            .isAmazonChoice(DEFAULT_IS_AMAZON_CHOICE)
            .isPrime(DEFAULT_IS_PRIME)
            .climatePledgeFriendly(DEFAULT_CLIMATE_PLEDGE_FRIENDLY)
            .salesVolume(DEFAULT_SALES_VOLUME)
            .delivery(DEFAULT_DELIVERY)
            .couponText(DEFAULT_COUPON_TEXT);
        return orderAnItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderAnItem createUpdatedEntity(EntityManager em) {
        OrderAnItem orderAnItem = new OrderAnItem()
            .asin(UPDATED_ASIN)
            .productTitle(UPDATED_PRODUCT_TITLE)
            .productPrice(UPDATED_PRODUCT_PRICE)
            .productOriginalPrice(UPDATED_PRODUCT_ORIGINAL_PRICE)
            .currency(UPDATED_CURRENCY)
            .productStarRating(UPDATED_PRODUCT_STAR_RATING)
            .productNumRatings(UPDATED_PRODUCT_NUM_RATINGS)
            .productUrl(UPDATED_PRODUCT_URL)
            .productPhoto(UPDATED_PRODUCT_PHOTO)
            .productNumOffers(UPDATED_PRODUCT_NUM_OFFERS)
            .productMinimumOfferPrice(UPDATED_PRODUCT_MINIMUM_OFFER_PRICE)
            .isBestSeller(UPDATED_IS_BEST_SELLER)
            .isAmazonChoice(UPDATED_IS_AMAZON_CHOICE)
            .isPrime(UPDATED_IS_PRIME)
            .climatePledgeFriendly(UPDATED_CLIMATE_PLEDGE_FRIENDLY)
            .salesVolume(UPDATED_SALES_VOLUME)
            .delivery(UPDATED_DELIVERY)
            .couponText(UPDATED_COUPON_TEXT);
        return orderAnItem;
    }

    @BeforeEach
    public void initTest() {
        orderAnItem = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedOrderAnItem != null) {
            orderAnItemRepository.delete(insertedOrderAnItem);
            insertedOrderAnItem = null;
        }
    }

    @Test
    @Transactional
    void createOrderAnItem() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the OrderAnItem
        var returnedOrderAnItem = om.readValue(
            restOrderAnItemMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderAnItem)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            OrderAnItem.class
        );

        // Validate the OrderAnItem in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertOrderAnItemUpdatableFieldsEquals(returnedOrderAnItem, getPersistedOrderAnItem(returnedOrderAnItem));

        insertedOrderAnItem = returnedOrderAnItem;
    }

    @Test
    @Transactional
    void createOrderAnItemWithExistingId() throws Exception {
        // Create the OrderAnItem with an existing ID
        orderAnItem.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderAnItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderAnItem)))
            .andExpect(status().isBadRequest());

        // Validate the OrderAnItem in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAsinIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        orderAnItem.setAsin(null);

        // Create the OrderAnItem, which fails.

        restOrderAnItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderAnItem)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOrderAnItems() throws Exception {
        // Initialize the database
        insertedOrderAnItem = orderAnItemRepository.saveAndFlush(orderAnItem);

        // Get all the orderAnItemList
        restOrderAnItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderAnItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].asin").value(hasItem(DEFAULT_ASIN)))
            .andExpect(jsonPath("$.[*].productTitle").value(hasItem(DEFAULT_PRODUCT_TITLE)))
            .andExpect(jsonPath("$.[*].productPrice").value(hasItem(DEFAULT_PRODUCT_PRICE)))
            .andExpect(jsonPath("$.[*].productOriginalPrice").value(hasItem(DEFAULT_PRODUCT_ORIGINAL_PRICE)))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY)))
            .andExpect(jsonPath("$.[*].productStarRating").value(hasItem(DEFAULT_PRODUCT_STAR_RATING)))
            .andExpect(jsonPath("$.[*].productNumRatings").value(hasItem(DEFAULT_PRODUCT_NUM_RATINGS)))
            .andExpect(jsonPath("$.[*].productUrl").value(hasItem(DEFAULT_PRODUCT_URL)))
            .andExpect(jsonPath("$.[*].productPhoto").value(hasItem(DEFAULT_PRODUCT_PHOTO)))
            .andExpect(jsonPath("$.[*].productNumOffers").value(hasItem(DEFAULT_PRODUCT_NUM_OFFERS)))
            .andExpect(jsonPath("$.[*].productMinimumOfferPrice").value(hasItem(DEFAULT_PRODUCT_MINIMUM_OFFER_PRICE)))
            .andExpect(jsonPath("$.[*].isBestSeller").value(hasItem(DEFAULT_IS_BEST_SELLER.booleanValue())))
            .andExpect(jsonPath("$.[*].isAmazonChoice").value(hasItem(DEFAULT_IS_AMAZON_CHOICE.booleanValue())))
            .andExpect(jsonPath("$.[*].isPrime").value(hasItem(DEFAULT_IS_PRIME.booleanValue())))
            .andExpect(jsonPath("$.[*].climatePledgeFriendly").value(hasItem(DEFAULT_CLIMATE_PLEDGE_FRIENDLY.booleanValue())))
            .andExpect(jsonPath("$.[*].salesVolume").value(hasItem(DEFAULT_SALES_VOLUME)))
            .andExpect(jsonPath("$.[*].delivery").value(hasItem(DEFAULT_DELIVERY)))
            .andExpect(jsonPath("$.[*].couponText").value(hasItem(DEFAULT_COUPON_TEXT)));
    }

    @Test
    @Transactional
    void getOrderAnItem() throws Exception {
        // Initialize the database
        insertedOrderAnItem = orderAnItemRepository.saveAndFlush(orderAnItem);

        // Get the orderAnItem
        restOrderAnItemMockMvc
            .perform(get(ENTITY_API_URL_ID, orderAnItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orderAnItem.getId().intValue()))
            .andExpect(jsonPath("$.asin").value(DEFAULT_ASIN))
            .andExpect(jsonPath("$.productTitle").value(DEFAULT_PRODUCT_TITLE))
            .andExpect(jsonPath("$.productPrice").value(DEFAULT_PRODUCT_PRICE))
            .andExpect(jsonPath("$.productOriginalPrice").value(DEFAULT_PRODUCT_ORIGINAL_PRICE))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY))
            .andExpect(jsonPath("$.productStarRating").value(DEFAULT_PRODUCT_STAR_RATING))
            .andExpect(jsonPath("$.productNumRatings").value(DEFAULT_PRODUCT_NUM_RATINGS))
            .andExpect(jsonPath("$.productUrl").value(DEFAULT_PRODUCT_URL))
            .andExpect(jsonPath("$.productPhoto").value(DEFAULT_PRODUCT_PHOTO))
            .andExpect(jsonPath("$.productNumOffers").value(DEFAULT_PRODUCT_NUM_OFFERS))
            .andExpect(jsonPath("$.productMinimumOfferPrice").value(DEFAULT_PRODUCT_MINIMUM_OFFER_PRICE))
            .andExpect(jsonPath("$.isBestSeller").value(DEFAULT_IS_BEST_SELLER.booleanValue()))
            .andExpect(jsonPath("$.isAmazonChoice").value(DEFAULT_IS_AMAZON_CHOICE.booleanValue()))
            .andExpect(jsonPath("$.isPrime").value(DEFAULT_IS_PRIME.booleanValue()))
            .andExpect(jsonPath("$.climatePledgeFriendly").value(DEFAULT_CLIMATE_PLEDGE_FRIENDLY.booleanValue()))
            .andExpect(jsonPath("$.salesVolume").value(DEFAULT_SALES_VOLUME))
            .andExpect(jsonPath("$.delivery").value(DEFAULT_DELIVERY))
            .andExpect(jsonPath("$.couponText").value(DEFAULT_COUPON_TEXT));
    }

    @Test
    @Transactional
    void getNonExistingOrderAnItem() throws Exception {
        // Get the orderAnItem
        restOrderAnItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOrderAnItem() throws Exception {
        // Initialize the database
        insertedOrderAnItem = orderAnItemRepository.saveAndFlush(orderAnItem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the orderAnItem
        OrderAnItem updatedOrderAnItem = orderAnItemRepository.findById(orderAnItem.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedOrderAnItem are not directly saved in db
        em.detach(updatedOrderAnItem);
        updatedOrderAnItem
            .asin(UPDATED_ASIN)
            .productTitle(UPDATED_PRODUCT_TITLE)
            .productPrice(UPDATED_PRODUCT_PRICE)
            .productOriginalPrice(UPDATED_PRODUCT_ORIGINAL_PRICE)
            .currency(UPDATED_CURRENCY)
            .productStarRating(UPDATED_PRODUCT_STAR_RATING)
            .productNumRatings(UPDATED_PRODUCT_NUM_RATINGS)
            .productUrl(UPDATED_PRODUCT_URL)
            .productPhoto(UPDATED_PRODUCT_PHOTO)
            .productNumOffers(UPDATED_PRODUCT_NUM_OFFERS)
            .productMinimumOfferPrice(UPDATED_PRODUCT_MINIMUM_OFFER_PRICE)
            .isBestSeller(UPDATED_IS_BEST_SELLER)
            .isAmazonChoice(UPDATED_IS_AMAZON_CHOICE)
            .isPrime(UPDATED_IS_PRIME)
            .climatePledgeFriendly(UPDATED_CLIMATE_PLEDGE_FRIENDLY)
            .salesVolume(UPDATED_SALES_VOLUME)
            .delivery(UPDATED_DELIVERY)
            .couponText(UPDATED_COUPON_TEXT);

        restOrderAnItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrderAnItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedOrderAnItem))
            )
            .andExpect(status().isOk());

        // Validate the OrderAnItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedOrderAnItemToMatchAllProperties(updatedOrderAnItem);
    }

    @Test
    @Transactional
    void putNonExistingOrderAnItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderAnItem.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderAnItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orderAnItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(orderAnItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderAnItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrderAnItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderAnItem.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderAnItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(orderAnItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderAnItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrderAnItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderAnItem.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderAnItemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderAnItem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderAnItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrderAnItemWithPatch() throws Exception {
        // Initialize the database
        insertedOrderAnItem = orderAnItemRepository.saveAndFlush(orderAnItem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the orderAnItem using partial update
        OrderAnItem partialUpdatedOrderAnItem = new OrderAnItem();
        partialUpdatedOrderAnItem.setId(orderAnItem.getId());

        partialUpdatedOrderAnItem
            .productTitle(UPDATED_PRODUCT_TITLE)
            .productPrice(UPDATED_PRODUCT_PRICE)
            .productOriginalPrice(UPDATED_PRODUCT_ORIGINAL_PRICE)
            .currency(UPDATED_CURRENCY)
            .productStarRating(UPDATED_PRODUCT_STAR_RATING)
            .productNumRatings(UPDATED_PRODUCT_NUM_RATINGS)
            .productUrl(UPDATED_PRODUCT_URL)
            .productPhoto(UPDATED_PRODUCT_PHOTO)
            .isBestSeller(UPDATED_IS_BEST_SELLER)
            .isPrime(UPDATED_IS_PRIME);

        restOrderAnItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderAnItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOrderAnItem))
            )
            .andExpect(status().isOk());

        // Validate the OrderAnItem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOrderAnItemUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedOrderAnItem, orderAnItem),
            getPersistedOrderAnItem(orderAnItem)
        );
    }

    @Test
    @Transactional
    void fullUpdateOrderAnItemWithPatch() throws Exception {
        // Initialize the database
        insertedOrderAnItem = orderAnItemRepository.saveAndFlush(orderAnItem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the orderAnItem using partial update
        OrderAnItem partialUpdatedOrderAnItem = new OrderAnItem();
        partialUpdatedOrderAnItem.setId(orderAnItem.getId());

        partialUpdatedOrderAnItem
            .asin(UPDATED_ASIN)
            .productTitle(UPDATED_PRODUCT_TITLE)
            .productPrice(UPDATED_PRODUCT_PRICE)
            .productOriginalPrice(UPDATED_PRODUCT_ORIGINAL_PRICE)
            .currency(UPDATED_CURRENCY)
            .productStarRating(UPDATED_PRODUCT_STAR_RATING)
            .productNumRatings(UPDATED_PRODUCT_NUM_RATINGS)
            .productUrl(UPDATED_PRODUCT_URL)
            .productPhoto(UPDATED_PRODUCT_PHOTO)
            .productNumOffers(UPDATED_PRODUCT_NUM_OFFERS)
            .productMinimumOfferPrice(UPDATED_PRODUCT_MINIMUM_OFFER_PRICE)
            .isBestSeller(UPDATED_IS_BEST_SELLER)
            .isAmazonChoice(UPDATED_IS_AMAZON_CHOICE)
            .isPrime(UPDATED_IS_PRIME)
            .climatePledgeFriendly(UPDATED_CLIMATE_PLEDGE_FRIENDLY)
            .salesVolume(UPDATED_SALES_VOLUME)
            .delivery(UPDATED_DELIVERY)
            .couponText(UPDATED_COUPON_TEXT);

        restOrderAnItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderAnItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOrderAnItem))
            )
            .andExpect(status().isOk());

        // Validate the OrderAnItem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOrderAnItemUpdatableFieldsEquals(partialUpdatedOrderAnItem, getPersistedOrderAnItem(partialUpdatedOrderAnItem));
    }

    @Test
    @Transactional
    void patchNonExistingOrderAnItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderAnItem.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderAnItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, orderAnItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(orderAnItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderAnItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrderAnItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderAnItem.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderAnItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(orderAnItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderAnItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrderAnItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderAnItem.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderAnItemMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(orderAnItem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderAnItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrderAnItem() throws Exception {
        // Initialize the database
        insertedOrderAnItem = orderAnItemRepository.saveAndFlush(orderAnItem);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the orderAnItem
        restOrderAnItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, orderAnItem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return orderAnItemRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected OrderAnItem getPersistedOrderAnItem(OrderAnItem orderAnItem) {
        return orderAnItemRepository.findById(orderAnItem.getId()).orElseThrow();
    }

    protected void assertPersistedOrderAnItemToMatchAllProperties(OrderAnItem expectedOrderAnItem) {
        assertOrderAnItemAllPropertiesEquals(expectedOrderAnItem, getPersistedOrderAnItem(expectedOrderAnItem));
    }

    protected void assertPersistedOrderAnItemToMatchUpdatableProperties(OrderAnItem expectedOrderAnItem) {
        assertOrderAnItemAllUpdatablePropertiesEquals(expectedOrderAnItem, getPersistedOrderAnItem(expectedOrderAnItem));
    }
}
