package edu.psgv.sweng861.domain;

import static edu.psgv.sweng861.domain.EmployeeInformationTestSamples.*;
import static edu.psgv.sweng861.domain.ItemTestSamples.*;
import static edu.psgv.sweng861.domain.OrderAnItemTestSamples.*;
import static edu.psgv.sweng861.domain.OrderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import edu.psgv.sweng861.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class OrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Order.class);
        Order order1 = getOrderSample1();
        Order order2 = new Order();
        assertThat(order1).isNotEqualTo(order2);

        order2.setId(order1.getId());
        assertThat(order1).isEqualTo(order2);

        order2 = getOrderSample2();
        assertThat(order1).isNotEqualTo(order2);
    }

    @Test
    void employeeInformationTest() {
        Order order = getOrderRandomSampleGenerator();
        EmployeeInformation employeeInformationBack = getEmployeeInformationRandomSampleGenerator();

        order.setEmployeeInformation(employeeInformationBack);
        assertThat(order.getEmployeeInformation()).isEqualTo(employeeInformationBack);

        order.employeeInformation(null);
        assertThat(order.getEmployeeInformation()).isNull();
    }

    @Test
    void itemTest() {
        Order order = getOrderRandomSampleGenerator();
        Item itemBack = getItemRandomSampleGenerator();

        order.addItem(itemBack);
        assertThat(order.getItems()).containsOnly(itemBack);
        assertThat(itemBack.getOrder()).isEqualTo(order);

        order.removeItem(itemBack);
        assertThat(order.getItems()).doesNotContain(itemBack);
        assertThat(itemBack.getOrder()).isNull();

        order.items(new HashSet<>(Set.of(itemBack)));
        assertThat(order.getItems()).containsOnly(itemBack);
        assertThat(itemBack.getOrder()).isEqualTo(order);

        order.setItems(new HashSet<>());
        assertThat(order.getItems()).doesNotContain(itemBack);
        assertThat(itemBack.getOrder()).isNull();
    }

    @Test
    void orderAnItemTest() {
        Order order = getOrderRandomSampleGenerator();
        OrderAnItem orderAnItemBack = getOrderAnItemRandomSampleGenerator();

        order.addOrderAnItem(orderAnItemBack);
        assertThat(order.getOrderAnItems()).containsOnly(orderAnItemBack);
        assertThat(orderAnItemBack.getOrder()).isEqualTo(order);

        order.removeOrderAnItem(orderAnItemBack);
        assertThat(order.getOrderAnItems()).doesNotContain(orderAnItemBack);
        assertThat(orderAnItemBack.getOrder()).isNull();

        order.orderAnItems(new HashSet<>(Set.of(orderAnItemBack)));
        assertThat(order.getOrderAnItems()).containsOnly(orderAnItemBack);
        assertThat(orderAnItemBack.getOrder()).isEqualTo(order);

        order.setOrderAnItems(new HashSet<>());
        assertThat(order.getOrderAnItems()).doesNotContain(orderAnItemBack);
        assertThat(orderAnItemBack.getOrder()).isNull();
    }
}
