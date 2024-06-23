package edu.psgv.sweng861.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EmployeeInformationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static EmployeeInformation getEmployeeInformationSample1() {
        return new EmployeeInformation().id(1L).name("name1").handle("handle1");
    }

    public static EmployeeInformation getEmployeeInformationSample2() {
        return new EmployeeInformation().id(2L).name("name2").handle("handle2");
    }

    public static EmployeeInformation getEmployeeInformationRandomSampleGenerator() {
        return new EmployeeInformation()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .handle(UUID.randomUUID().toString());
    }
}
