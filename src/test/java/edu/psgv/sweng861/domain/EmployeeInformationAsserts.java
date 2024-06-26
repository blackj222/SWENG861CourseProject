package edu.psgv.sweng861.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class EmployeeInformationAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEmployeeInformationAllPropertiesEquals(EmployeeInformation expected, EmployeeInformation actual) {
        assertEmployeeInformationAutoGeneratedPropertiesEquals(expected, actual);
        assertEmployeeInformationAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEmployeeInformationAllUpdatablePropertiesEquals(EmployeeInformation expected, EmployeeInformation actual) {
        assertEmployeeInformationUpdatableFieldsEquals(expected, actual);
        assertEmployeeInformationUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEmployeeInformationAutoGeneratedPropertiesEquals(EmployeeInformation expected, EmployeeInformation actual) {
        assertThat(expected)
            .as("Verify EmployeeInformation auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEmployeeInformationUpdatableFieldsEquals(EmployeeInformation expected, EmployeeInformation actual) {
        assertThat(expected)
            .as("Verify EmployeeInformation relevant properties")
            .satisfies(e -> assertThat(e.getName()).as("check name").isEqualTo(actual.getName()))
            .satisfies(e -> assertThat(e.getHandle()).as("check handle").isEqualTo(actual.getHandle()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEmployeeInformationUpdatableRelationshipsEquals(EmployeeInformation expected, EmployeeInformation actual) {}
}
