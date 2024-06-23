package edu.psgv.sweng861.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Item.
 */
@Entity
@Table(name = "item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Item implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "asin", nullable = false)
    private String asin;

    @Column(name = "product_title")
    private String productTitle;

    @Column(name = "product_price")
    private String productPrice;

    @Column(name = "product_original_price")
    private String productOriginalPrice;

    @Column(name = "currency")
    private String currency;

    @Column(name = "product_star_rating")
    private String productStarRating;

    @Column(name = "product_num_ratings")
    private Integer productNumRatings;

    @Column(name = "product_url")
    private String productUrl;

    @Column(name = "product_photo")
    private String productPhoto;

    @Column(name = "product_num_offers")
    private Integer productNumOffers;

    @Column(name = "product_minimum_offer_price")
    private String productMinimumOfferPrice;

    @Column(name = "is_best_seller")
    private Boolean isBestSeller;

    @Column(name = "is_amazon_choice")
    private Boolean isAmazonChoice;

    @Column(name = "is_prime")
    private Boolean isPrime;

    @Column(name = "climate_pledge_friendly")
    private Boolean climatePledgeFriendly;

    @Column(name = "sales_volume")
    private String salesVolume;

    @Column(name = "delivery")
    private String delivery;

    @Column(name = "coupon_text")
    private String couponText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "employeeInformation", "items", "orderAnItems" }, allowSetters = true)
    private Order order;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Item id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAsin() {
        return this.asin;
    }

    public Item asin(String asin) {
        this.setAsin(asin);
        return this;
    }

    public void setAsin(String asin) {
        this.asin = asin;
    }

    public String getProductTitle() {
        return this.productTitle;
    }

    public Item productTitle(String productTitle) {
        this.setProductTitle(productTitle);
        return this;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public String getProductPrice() {
        return this.productPrice;
    }

    public Item productPrice(String productPrice) {
        this.setProductPrice(productPrice);
        return this;
    }

    public void setProductPrice(String productPrice) {
        this.productPrice = productPrice;
    }

    public String getProductOriginalPrice() {
        return this.productOriginalPrice;
    }

    public Item productOriginalPrice(String productOriginalPrice) {
        this.setProductOriginalPrice(productOriginalPrice);
        return this;
    }

    public void setProductOriginalPrice(String productOriginalPrice) {
        this.productOriginalPrice = productOriginalPrice;
    }

    public String getCurrency() {
        return this.currency;
    }

    public Item currency(String currency) {
        this.setCurrency(currency);
        return this;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getProductStarRating() {
        return this.productStarRating;
    }

    public Item productStarRating(String productStarRating) {
        this.setProductStarRating(productStarRating);
        return this;
    }

    public void setProductStarRating(String productStarRating) {
        this.productStarRating = productStarRating;
    }

    public Integer getProductNumRatings() {
        return this.productNumRatings;
    }

    public Item productNumRatings(Integer productNumRatings) {
        this.setProductNumRatings(productNumRatings);
        return this;
    }

    public void setProductNumRatings(Integer productNumRatings) {
        this.productNumRatings = productNumRatings;
    }

    public String getProductUrl() {
        return this.productUrl;
    }

    public Item productUrl(String productUrl) {
        this.setProductUrl(productUrl);
        return this;
    }

    public void setProductUrl(String productUrl) {
        this.productUrl = productUrl;
    }

    public String getProductPhoto() {
        return this.productPhoto;
    }

    public Item productPhoto(String productPhoto) {
        this.setProductPhoto(productPhoto);
        return this;
    }

    public void setProductPhoto(String productPhoto) {
        this.productPhoto = productPhoto;
    }

    public Integer getProductNumOffers() {
        return this.productNumOffers;
    }

    public Item productNumOffers(Integer productNumOffers) {
        this.setProductNumOffers(productNumOffers);
        return this;
    }

    public void setProductNumOffers(Integer productNumOffers) {
        this.productNumOffers = productNumOffers;
    }

    public String getProductMinimumOfferPrice() {
        return this.productMinimumOfferPrice;
    }

    public Item productMinimumOfferPrice(String productMinimumOfferPrice) {
        this.setProductMinimumOfferPrice(productMinimumOfferPrice);
        return this;
    }

    public void setProductMinimumOfferPrice(String productMinimumOfferPrice) {
        this.productMinimumOfferPrice = productMinimumOfferPrice;
    }

    public Boolean getIsBestSeller() {
        return this.isBestSeller;
    }

    public Item isBestSeller(Boolean isBestSeller) {
        this.setIsBestSeller(isBestSeller);
        return this;
    }

    public void setIsBestSeller(Boolean isBestSeller) {
        this.isBestSeller = isBestSeller;
    }

    public Boolean getIsAmazonChoice() {
        return this.isAmazonChoice;
    }

    public Item isAmazonChoice(Boolean isAmazonChoice) {
        this.setIsAmazonChoice(isAmazonChoice);
        return this;
    }

    public void setIsAmazonChoice(Boolean isAmazonChoice) {
        this.isAmazonChoice = isAmazonChoice;
    }

    public Boolean getIsPrime() {
        return this.isPrime;
    }

    public Item isPrime(Boolean isPrime) {
        this.setIsPrime(isPrime);
        return this;
    }

    public void setIsPrime(Boolean isPrime) {
        this.isPrime = isPrime;
    }

    public Boolean getClimatePledgeFriendly() {
        return this.climatePledgeFriendly;
    }

    public Item climatePledgeFriendly(Boolean climatePledgeFriendly) {
        this.setClimatePledgeFriendly(climatePledgeFriendly);
        return this;
    }

    public void setClimatePledgeFriendly(Boolean climatePledgeFriendly) {
        this.climatePledgeFriendly = climatePledgeFriendly;
    }

    public String getSalesVolume() {
        return this.salesVolume;
    }

    public Item salesVolume(String salesVolume) {
        this.setSalesVolume(salesVolume);
        return this;
    }

    public void setSalesVolume(String salesVolume) {
        this.salesVolume = salesVolume;
    }

    public String getDelivery() {
        return this.delivery;
    }

    public Item delivery(String delivery) {
        this.setDelivery(delivery);
        return this;
    }

    public void setDelivery(String delivery) {
        this.delivery = delivery;
    }

    public String getCouponText() {
        return this.couponText;
    }

    public Item couponText(String couponText) {
        this.setCouponText(couponText);
        return this;
    }

    public void setCouponText(String couponText) {
        this.couponText = couponText;
    }

    public Order getOrder() {
        return this.order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Item order(Order order) {
        this.setOrder(order);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Item)) {
            return false;
        }
        return getId() != null && getId().equals(((Item) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Item{" +
            "id=" + getId() +
            ", asin='" + getAsin() + "'" +
            ", productTitle='" + getProductTitle() + "'" +
            ", productPrice='" + getProductPrice() + "'" +
            ", productOriginalPrice='" + getProductOriginalPrice() + "'" +
            ", currency='" + getCurrency() + "'" +
            ", productStarRating='" + getProductStarRating() + "'" +
            ", productNumRatings=" + getProductNumRatings() +
            ", productUrl='" + getProductUrl() + "'" +
            ", productPhoto='" + getProductPhoto() + "'" +
            ", productNumOffers=" + getProductNumOffers() +
            ", productMinimumOfferPrice='" + getProductMinimumOfferPrice() + "'" +
            ", isBestSeller='" + getIsBestSeller() + "'" +
            ", isAmazonChoice='" + getIsAmazonChoice() + "'" +
            ", isPrime='" + getIsPrime() + "'" +
            ", climatePledgeFriendly='" + getClimatePledgeFriendly() + "'" +
            ", salesVolume='" + getSalesVolume() + "'" +
            ", delivery='" + getDelivery() + "'" +
            ", couponText='" + getCouponText() + "'" +
            "}";
    }
}
