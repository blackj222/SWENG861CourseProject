import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('EmployeeInformation e2e test', () => {
  const employeeInformationPageUrl = '/employee-information';
  const employeeInformationPageUrlPattern = new RegExp('/employee-information(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const employeeInformationSample = { name: 'next', handle: 'grandmom meh' };

  let employeeInformation;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/employee-informations+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/employee-informations').as('postEntityRequest');
    cy.intercept('DELETE', '/api/employee-informations/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (employeeInformation) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/employee-informations/${employeeInformation.id}`,
      }).then(() => {
        employeeInformation = undefined;
      });
    }
  });

  it('EmployeeInformations menu should load EmployeeInformations page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('employee-information');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('EmployeeInformation').should('exist');
    cy.url().should('match', employeeInformationPageUrlPattern);
  });

  describe('EmployeeInformation page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(employeeInformationPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create EmployeeInformation page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/employee-information/new$'));
        cy.getEntityCreateUpdateHeading('EmployeeInformation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', employeeInformationPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/employee-informations',
          body: employeeInformationSample,
        }).then(({ body }) => {
          employeeInformation = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/employee-informations+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/employee-informations?page=0&size=20>; rel="last",<http://localhost/api/employee-informations?page=0&size=20>; rel="first"',
              },
              body: [employeeInformation],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(employeeInformationPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details EmployeeInformation page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('employeeInformation');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', employeeInformationPageUrlPattern);
      });

      it('edit button click should load edit EmployeeInformation page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EmployeeInformation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', employeeInformationPageUrlPattern);
      });

      it('edit button click should load edit EmployeeInformation page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EmployeeInformation');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', employeeInformationPageUrlPattern);
      });

      it('last delete button click should delete instance of EmployeeInformation', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('employeeInformation').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', employeeInformationPageUrlPattern);

        employeeInformation = undefined;
      });
    });
  });

  describe('new EmployeeInformation page', () => {
    beforeEach(() => {
      cy.visit(`${employeeInformationPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('EmployeeInformation');
    });

    it('should create an instance of EmployeeInformation', () => {
      cy.get(`[data-cy="name"]`).type('unique');
      cy.get(`[data-cy="name"]`).should('have.value', 'unique');

      cy.get(`[data-cy="handle"]`).type('because deceivingly psst');
      cy.get(`[data-cy="handle"]`).should('have.value', 'because deceivingly psst');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        employeeInformation = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', employeeInformationPageUrlPattern);
    });
  });
});
