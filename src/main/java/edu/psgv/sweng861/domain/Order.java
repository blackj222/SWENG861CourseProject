package edu.psgv.sweng861.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Order.
 */
@Entity
@Table(name = "jhi_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    @NotNull
    @Column(name = "date", nullable = false)
    private Instant date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private EmployeeInformation employeeInformation;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "order")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "order" }, allowSetters = true)
    private Set<Item> items = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "order")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "order" }, allowSetters = true)
    private Set<OrderAnItem> orderAnItems = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Order id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Order title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return this.content;
    }

    public Order content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getDate() {
        return this.date;
    }

    public Order date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public EmployeeInformation getEmployeeInformation() {
        return this.employeeInformation;
    }

    public void setEmployeeInformation(EmployeeInformation employeeInformation) {
        this.employeeInformation = employeeInformation;
    }

    public Order employeeInformation(EmployeeInformation employeeInformation) {
        this.setEmployeeInformation(employeeInformation);
        return this;
    }

    public Set<Item> getItems() {
        return this.items;
    }

    public void setItems(Set<Item> items) {
        if (this.items != null) {
            this.items.forEach(i -> i.setOrder(null));
        }
        if (items != null) {
            items.forEach(i -> i.setOrder(this));
        }
        this.items = items;
    }

    public Order items(Set<Item> items) {
        this.setItems(items);
        return this;
    }

    public Order addItem(Item item) {
        this.items.add(item);
        item.setOrder(this);
        return this;
    }

    public Order removeItem(Item item) {
        this.items.remove(item);
        item.setOrder(null);
        return this;
    }

    public Set<OrderAnItem> getOrderAnItems() {
        return this.orderAnItems;
    }

    public void setOrderAnItems(Set<OrderAnItem> orderAnItems) {
        if (this.orderAnItems != null) {
            this.orderAnItems.forEach(i -> i.setOrder(null));
        }
        if (orderAnItems != null) {
            orderAnItems.forEach(i -> i.setOrder(this));
        }
        this.orderAnItems = orderAnItems;
    }

    public Order orderAnItems(Set<OrderAnItem> orderAnItems) {
        this.setOrderAnItems(orderAnItems);
        return this;
    }

    public Order addOrderAnItem(OrderAnItem orderAnItem) {
        this.orderAnItems.add(orderAnItem);
        orderAnItem.setOrder(this);
        return this;
    }

    public Order removeOrderAnItem(OrderAnItem orderAnItem) {
        this.orderAnItems.remove(orderAnItem);
        orderAnItem.setOrder(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Order)) {
            return false;
        }
        return getId() != null && getId().equals(((Order) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Order{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", content='" + getContent() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
