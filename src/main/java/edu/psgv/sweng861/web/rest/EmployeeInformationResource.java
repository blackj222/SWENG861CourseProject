package edu.psgv.sweng861.web.rest;

import edu.psgv.sweng861.domain.EmployeeInformation;
import edu.psgv.sweng861.repository.EmployeeInformationRepository;
import edu.psgv.sweng861.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link edu.psgv.sweng861.domain.EmployeeInformation}.
 */
@RestController
@RequestMapping("/api/employee-informations")
@Transactional
public class EmployeeInformationResource {

    private final Logger log = LoggerFactory.getLogger(EmployeeInformationResource.class);

    private static final String ENTITY_NAME = "employeeInformation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmployeeInformationRepository employeeInformationRepository;

    public EmployeeInformationResource(EmployeeInformationRepository employeeInformationRepository) {
        this.employeeInformationRepository = employeeInformationRepository;
    }

    /**
     * {@code POST  /employee-informations} : Create a new employeeInformation.
     *
     * @param employeeInformation the employeeInformation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new employeeInformation, or with status {@code 400 (Bad Request)} if the employeeInformation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<EmployeeInformation> createEmployeeInformation(@Valid @RequestBody EmployeeInformation employeeInformation)
        throws URISyntaxException {
        log.debug("REST request to save EmployeeInformation : {}", employeeInformation);
        if (employeeInformation.getId() != null) {
            throw new BadRequestAlertException("A new employeeInformation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        employeeInformation = employeeInformationRepository.save(employeeInformation);
        return ResponseEntity.created(new URI("/api/employee-informations/" + employeeInformation.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, employeeInformation.getId().toString()))
            .body(employeeInformation);
    }

    /**
     * {@code PUT  /employee-informations/:id} : Updates an existing employeeInformation.
     *
     * @param id the id of the employeeInformation to save.
     * @param employeeInformation the employeeInformation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated employeeInformation,
     * or with status {@code 400 (Bad Request)} if the employeeInformation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the employeeInformation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeInformation> updateEmployeeInformation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EmployeeInformation employeeInformation
    ) throws URISyntaxException {
        log.debug("REST request to update EmployeeInformation : {}, {}", id, employeeInformation);
        if (employeeInformation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, employeeInformation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!employeeInformationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        employeeInformation = employeeInformationRepository.save(employeeInformation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, employeeInformation.getId().toString()))
            .body(employeeInformation);
    }

    /**
     * {@code PATCH  /employee-informations/:id} : Partial updates given fields of an existing employeeInformation, field will ignore if it is null
     *
     * @param id the id of the employeeInformation to save.
     * @param employeeInformation the employeeInformation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated employeeInformation,
     * or with status {@code 400 (Bad Request)} if the employeeInformation is not valid,
     * or with status {@code 404 (Not Found)} if the employeeInformation is not found,
     * or with status {@code 500 (Internal Server Error)} if the employeeInformation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EmployeeInformation> partialUpdateEmployeeInformation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EmployeeInformation employeeInformation
    ) throws URISyntaxException {
        log.debug("REST request to partial update EmployeeInformation partially : {}, {}", id, employeeInformation);
        if (employeeInformation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, employeeInformation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!employeeInformationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EmployeeInformation> result = employeeInformationRepository
            .findById(employeeInformation.getId())
            .map(existingEmployeeInformation -> {
                if (employeeInformation.getName() != null) {
                    existingEmployeeInformation.setName(employeeInformation.getName());
                }
                if (employeeInformation.getHandle() != null) {
                    existingEmployeeInformation.setHandle(employeeInformation.getHandle());
                }

                return existingEmployeeInformation;
            })
            .map(employeeInformationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, employeeInformation.getId().toString())
        );
    }

    /**
     * {@code GET  /employee-informations} : get all the employeeInformations.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of employeeInformations in body.
     */
    @GetMapping("")
    public ResponseEntity<List<EmployeeInformation>> getAllEmployeeInformations(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of EmployeeInformations");
        Page<EmployeeInformation> page;
        if (eagerload) {
            page = employeeInformationRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = employeeInformationRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /employee-informations/:id} : get the "id" employeeInformation.
     *
     * @param id the id of the employeeInformation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the employeeInformation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeInformation> getEmployeeInformation(@PathVariable("id") Long id) {
        log.debug("REST request to get EmployeeInformation : {}", id);
        Optional<EmployeeInformation> employeeInformation = employeeInformationRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(employeeInformation);
    }

    /**
     * {@code DELETE  /employee-informations/:id} : delete the "id" employeeInformation.
     *
     * @param id the id of the employeeInformation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployeeInformation(@PathVariable("id") Long id) {
        log.debug("REST request to delete EmployeeInformation : {}", id);
        employeeInformationRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
