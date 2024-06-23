package edu.psgv.sweng861.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ItemTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Item getItemSample1() {
        return new Item()
            .id(1L)
            .asin("asin1")
            .productTitle("productTitle1")
            .productPrice("productPrice1")
            .productOriginalPrice("productOriginalPrice1")
            .currency("currency1")
            .productStarRating("productStarRating1")
            .productNumRatings(1)
            .productUrl("productUrl1")
            .productPhoto("productPhoto1")
            .productNumOffers(1)
            .productMinimumOfferPrice("productMinimumOfferPrice1")
            .salesVolume("salesVolume1")
            .delivery("delivery1")
            .couponText("couponText1");
    }

    public static Item getItemSample2() {
        return new Item()
            .id(2L)
            .asin("asin2")
            .productTitle("productTitle2")
            .productPrice("productPrice2")
            .productOriginalPrice("productOriginalPrice2")
            .currency("currency2")
            .productStarRating("productStarRating2")
            .productNumRatings(2)
            .productUrl("productUrl2")
            .productPhoto("productPhoto2")
            .productNumOffers(2)
            .productMinimumOfferPrice("productMinimumOfferPrice2")
            .salesVolume("salesVolume2")
            .delivery("delivery2")
            .couponText("couponText2");
    }

    public static Item getItemRandomSampleGenerator() {
        return new Item()
            .id(longCount.incrementAndGet())
            .asin(UUID.randomUUID().toString())
            .productTitle(UUID.randomUUID().toString())
            .productPrice(UUID.randomUUID().toString())
            .productOriginalPrice(UUID.randomUUID().toString())
            .currency(UUID.randomUUID().toString())
            .productStarRating(UUID.randomUUID().toString())
            .productNumRatings(intCount.incrementAndGet())
            .productUrl(UUID.randomUUID().toString())
            .productPhoto(UUID.randomUUID().toString())
            .productNumOffers(intCount.incrementAndGet())
            .productMinimumOfferPrice(UUID.randomUUID().toString())
            .salesVolume(UUID.randomUUID().toString())
            .delivery(UUID.randomUUID().toString())
            .couponText(UUID.randomUUID().toString());
    }
}
