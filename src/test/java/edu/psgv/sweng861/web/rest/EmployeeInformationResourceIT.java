package edu.psgv.sweng861.web.rest;

import static edu.psgv.sweng861.domain.EmployeeInformationAsserts.*;
import static edu.psgv.sweng861.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.psgv.sweng861.IntegrationTest;
import edu.psgv.sweng861.domain.EmployeeInformation;
import edu.psgv.sweng861.repository.EmployeeInformationRepository;
import edu.psgv.sweng861.repository.UserRepository;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EmployeeInformationResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class EmployeeInformationResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_HANDLE = "AAAAAAAAAA";
    private static final String UPDATED_HANDLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/employee-informations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EmployeeInformationRepository employeeInformationRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private EmployeeInformationRepository employeeInformationRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmployeeInformationMockMvc;

    private EmployeeInformation employeeInformation;

    private EmployeeInformation insertedEmployeeInformation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmployeeInformation createEntity(EntityManager em) {
        EmployeeInformation employeeInformation = new EmployeeInformation().name(DEFAULT_NAME).handle(DEFAULT_HANDLE);
        return employeeInformation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmployeeInformation createUpdatedEntity(EntityManager em) {
        EmployeeInformation employeeInformation = new EmployeeInformation().name(UPDATED_NAME).handle(UPDATED_HANDLE);
        return employeeInformation;
    }

    @BeforeEach
    public void initTest() {
        employeeInformation = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedEmployeeInformation != null) {
            employeeInformationRepository.delete(insertedEmployeeInformation);
            insertedEmployeeInformation = null;
        }
    }

    @Test
    @Transactional
    void createEmployeeInformation() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the EmployeeInformation
        var returnedEmployeeInformation = om.readValue(
            restEmployeeInformationMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(employeeInformation)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            EmployeeInformation.class
        );

        // Validate the EmployeeInformation in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEmployeeInformationUpdatableFieldsEquals(
            returnedEmployeeInformation,
            getPersistedEmployeeInformation(returnedEmployeeInformation)
        );

        insertedEmployeeInformation = returnedEmployeeInformation;
    }

    @Test
    @Transactional
    void createEmployeeInformationWithExistingId() throws Exception {
        // Create the EmployeeInformation with an existing ID
        employeeInformation.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmployeeInformationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(employeeInformation)))
            .andExpect(status().isBadRequest());

        // Validate the EmployeeInformation in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        employeeInformation.setName(null);

        // Create the EmployeeInformation, which fails.

        restEmployeeInformationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(employeeInformation)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkHandleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        employeeInformation.setHandle(null);

        // Create the EmployeeInformation, which fails.

        restEmployeeInformationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(employeeInformation)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEmployeeInformations() throws Exception {
        // Initialize the database
        insertedEmployeeInformation = employeeInformationRepository.saveAndFlush(employeeInformation);

        // Get all the employeeInformationList
        restEmployeeInformationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(employeeInformation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].handle").value(hasItem(DEFAULT_HANDLE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEmployeeInformationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(employeeInformationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEmployeeInformationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(employeeInformationRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEmployeeInformationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(employeeInformationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEmployeeInformationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(employeeInformationRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getEmployeeInformation() throws Exception {
        // Initialize the database
        insertedEmployeeInformation = employeeInformationRepository.saveAndFlush(employeeInformation);

        // Get the employeeInformation
        restEmployeeInformationMockMvc
            .perform(get(ENTITY_API_URL_ID, employeeInformation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(employeeInformation.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.handle").value(DEFAULT_HANDLE));
    }

    @Test
    @Transactional
    void getNonExistingEmployeeInformation() throws Exception {
        // Get the employeeInformation
        restEmployeeInformationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEmployeeInformation() throws Exception {
        // Initialize the database
        insertedEmployeeInformation = employeeInformationRepository.saveAndFlush(employeeInformation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the employeeInformation
        EmployeeInformation updatedEmployeeInformation = employeeInformationRepository.findById(employeeInformation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEmployeeInformation are not directly saved in db
        em.detach(updatedEmployeeInformation);
        updatedEmployeeInformation.name(UPDATED_NAME).handle(UPDATED_HANDLE);

        restEmployeeInformationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmployeeInformation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedEmployeeInformation))
            )
            .andExpect(status().isOk());

        // Validate the EmployeeInformation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEmployeeInformationToMatchAllProperties(updatedEmployeeInformation);
    }

    @Test
    @Transactional
    void putNonExistingEmployeeInformation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        employeeInformation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmployeeInformationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, employeeInformation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(employeeInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmployeeInformation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmployeeInformation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        employeeInformation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmployeeInformationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(employeeInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmployeeInformation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmployeeInformation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        employeeInformation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmployeeInformationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(employeeInformation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmployeeInformation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmployeeInformationWithPatch() throws Exception {
        // Initialize the database
        insertedEmployeeInformation = employeeInformationRepository.saveAndFlush(employeeInformation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the employeeInformation using partial update
        EmployeeInformation partialUpdatedEmployeeInformation = new EmployeeInformation();
        partialUpdatedEmployeeInformation.setId(employeeInformation.getId());

        partialUpdatedEmployeeInformation.handle(UPDATED_HANDLE);

        restEmployeeInformationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmployeeInformation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEmployeeInformation))
            )
            .andExpect(status().isOk());

        // Validate the EmployeeInformation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEmployeeInformationUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedEmployeeInformation, employeeInformation),
            getPersistedEmployeeInformation(employeeInformation)
        );
    }

    @Test
    @Transactional
    void fullUpdateEmployeeInformationWithPatch() throws Exception {
        // Initialize the database
        insertedEmployeeInformation = employeeInformationRepository.saveAndFlush(employeeInformation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the employeeInformation using partial update
        EmployeeInformation partialUpdatedEmployeeInformation = new EmployeeInformation();
        partialUpdatedEmployeeInformation.setId(employeeInformation.getId());

        partialUpdatedEmployeeInformation.name(UPDATED_NAME).handle(UPDATED_HANDLE);

        restEmployeeInformationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmployeeInformation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEmployeeInformation))
            )
            .andExpect(status().isOk());

        // Validate the EmployeeInformation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEmployeeInformationUpdatableFieldsEquals(
            partialUpdatedEmployeeInformation,
            getPersistedEmployeeInformation(partialUpdatedEmployeeInformation)
        );
    }

    @Test
    @Transactional
    void patchNonExistingEmployeeInformation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        employeeInformation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmployeeInformationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, employeeInformation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(employeeInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmployeeInformation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmployeeInformation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        employeeInformation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmployeeInformationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(employeeInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmployeeInformation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmployeeInformation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        employeeInformation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmployeeInformationMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(employeeInformation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmployeeInformation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmployeeInformation() throws Exception {
        // Initialize the database
        insertedEmployeeInformation = employeeInformationRepository.saveAndFlush(employeeInformation);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the employeeInformation
        restEmployeeInformationMockMvc
            .perform(delete(ENTITY_API_URL_ID, employeeInformation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return employeeInformationRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected EmployeeInformation getPersistedEmployeeInformation(EmployeeInformation employeeInformation) {
        return employeeInformationRepository.findById(employeeInformation.getId()).orElseThrow();
    }

    protected void assertPersistedEmployeeInformationToMatchAllProperties(EmployeeInformation expectedEmployeeInformation) {
        assertEmployeeInformationAllPropertiesEquals(
            expectedEmployeeInformation,
            getPersistedEmployeeInformation(expectedEmployeeInformation)
        );
    }

    protected void assertPersistedEmployeeInformationToMatchUpdatableProperties(EmployeeInformation expectedEmployeeInformation) {
        assertEmployeeInformationAllUpdatablePropertiesEquals(
            expectedEmployeeInformation,
            getPersistedEmployeeInformation(expectedEmployeeInformation)
        );
    }
}
