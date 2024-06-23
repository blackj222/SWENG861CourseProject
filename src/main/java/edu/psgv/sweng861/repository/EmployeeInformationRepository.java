package edu.psgv.sweng861.repository;

import edu.psgv.sweng861.domain.EmployeeInformation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the EmployeeInformation entity.
 */
@Repository
public interface EmployeeInformationRepository extends JpaRepository<EmployeeInformation, Long> {
    default Optional<EmployeeInformation> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<EmployeeInformation> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<EmployeeInformation> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select employeeInformation from EmployeeInformation employeeInformation left join fetch employeeInformation.user",
        countQuery = "select count(employeeInformation) from EmployeeInformation employeeInformation"
    )
    Page<EmployeeInformation> findAllWithToOneRelationships(Pageable pageable);

    @Query("select employeeInformation from EmployeeInformation employeeInformation left join fetch employeeInformation.user")
    List<EmployeeInformation> findAllWithToOneRelationships();

    @Query(
        "select employeeInformation from EmployeeInformation employeeInformation left join fetch employeeInformation.user where employeeInformation.id =:id"
    )
    Optional<EmployeeInformation> findOneWithToOneRelationships(@Param("id") Long id);
}
