package edu.psgv.sweng861.domain;

import static edu.psgv.sweng861.domain.ItemTestSamples.*;
import static edu.psgv.sweng861.domain.OrderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import edu.psgv.sweng861.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Item.class);
        Item item1 = getItemSample1();
        Item item2 = new Item();
        assertThat(item1).isNotEqualTo(item2);

        item2.setId(item1.getId());
        assertThat(item1).isEqualTo(item2);

        item2 = getItemSample2();
        assertThat(item1).isNotEqualTo(item2);
    }

    @Test
    void orderTest() {
        Item item = getItemRandomSampleGenerator();
        Order orderBack = getOrderRandomSampleGenerator();

        item.setOrder(orderBack);
        assertThat(item.getOrder()).isEqualTo(orderBack);

        item.order(null);
        assertThat(item.getOrder()).isNull();
    }
}
