package edu.psgv.sweng861.domain;

import static edu.psgv.sweng861.domain.EmployeeInformationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import edu.psgv.sweng861.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EmployeeInformationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EmployeeInformation.class);
        EmployeeInformation employeeInformation1 = getEmployeeInformationSample1();
        EmployeeInformation employeeInformation2 = new EmployeeInformation();
        assertThat(employeeInformation1).isNotEqualTo(employeeInformation2);

        employeeInformation2.setId(employeeInformation1.getId());
        assertThat(employeeInformation1).isEqualTo(employeeInformation2);

        employeeInformation2 = getEmployeeInformationSample2();
        assertThat(employeeInformation1).isNotEqualTo(employeeInformation2);
    }
}
