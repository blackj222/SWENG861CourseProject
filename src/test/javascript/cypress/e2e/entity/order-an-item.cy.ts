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

describe('OrderAnItem e2e test', () => {
  const orderAnItemPageUrl = '/order-an-item';
  const orderAnItemPageUrlPattern = new RegExp('/order-an-item(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const orderAnItemSample = { asin: 'grape' };

  let orderAnItem;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/order-an-items+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/order-an-items').as('postEntityRequest');
    cy.intercept('DELETE', '/api/order-an-items/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (orderAnItem) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/order-an-items/${orderAnItem.id}`,
      }).then(() => {
        orderAnItem = undefined;
      });
    }
  });

  it('OrderAnItems menu should load OrderAnItems page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('order-an-item');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('OrderAnItem').should('exist');
    cy.url().should('match', orderAnItemPageUrlPattern);
  });

  describe('OrderAnItem page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(orderAnItemPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create OrderAnItem page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/order-an-item/new$'));
        cy.getEntityCreateUpdateHeading('OrderAnItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', orderAnItemPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/order-an-items',
          body: orderAnItemSample,
        }).then(({ body }) => {
          orderAnItem = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/order-an-items+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [orderAnItem],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(orderAnItemPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details OrderAnItem page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('orderAnItem');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', orderAnItemPageUrlPattern);
      });

      it('edit button click should load edit OrderAnItem page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OrderAnItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', orderAnItemPageUrlPattern);
      });

      it('edit button click should load edit OrderAnItem page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OrderAnItem');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', orderAnItemPageUrlPattern);
      });

      it('last delete button click should delete instance of OrderAnItem', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('orderAnItem').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', orderAnItemPageUrlPattern);

        orderAnItem = undefined;
      });
    });
  });

  describe('new OrderAnItem page', () => {
    beforeEach(() => {
      cy.visit(`${orderAnItemPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('OrderAnItem');
    });

    it('should create an instance of OrderAnItem', () => {
      cy.get(`[data-cy="asin"]`).type('swiftly by');
      cy.get(`[data-cy="asin"]`).should('have.value', 'swiftly by');

      cy.get(`[data-cy="productTitle"]`).type('sans untried');
      cy.get(`[data-cy="productTitle"]`).should('have.value', 'sans untried');

      cy.get(`[data-cy="productPrice"]`).type('geez');
      cy.get(`[data-cy="productPrice"]`).should('have.value', 'geez');

      cy.get(`[data-cy="productOriginalPrice"]`).type('as anti stark');
      cy.get(`[data-cy="productOriginalPrice"]`).should('have.value', 'as anti stark');

      cy.get(`[data-cy="currency"]`).type('experience afore');
      cy.get(`[data-cy="currency"]`).should('have.value', 'experience afore');

      cy.get(`[data-cy="productStarRating"]`).type('till yippee');
      cy.get(`[data-cy="productStarRating"]`).should('have.value', 'till yippee');

      cy.get(`[data-cy="productNumRatings"]`).type('7930');
      cy.get(`[data-cy="productNumRatings"]`).should('have.value', '7930');

      cy.get(`[data-cy="productUrl"]`).type('apud');
      cy.get(`[data-cy="productUrl"]`).should('have.value', 'apud');

      cy.get(`[data-cy="productPhoto"]`).type('weekly blah boohoo');
      cy.get(`[data-cy="productPhoto"]`).should('have.value', 'weekly blah boohoo');

      cy.get(`[data-cy="productNumOffers"]`).type('12901');
      cy.get(`[data-cy="productNumOffers"]`).should('have.value', '12901');

      cy.get(`[data-cy="productMinimumOfferPrice"]`).type('jet');
      cy.get(`[data-cy="productMinimumOfferPrice"]`).should('have.value', 'jet');

      cy.get(`[data-cy="isBestSeller"]`).should('not.be.checked');
      cy.get(`[data-cy="isBestSeller"]`).click();
      cy.get(`[data-cy="isBestSeller"]`).should('be.checked');

      cy.get(`[data-cy="isAmazonChoice"]`).should('not.be.checked');
      cy.get(`[data-cy="isAmazonChoice"]`).click();
      cy.get(`[data-cy="isAmazonChoice"]`).should('be.checked');

      cy.get(`[data-cy="isPrime"]`).should('not.be.checked');
      cy.get(`[data-cy="isPrime"]`).click();
      cy.get(`[data-cy="isPrime"]`).should('be.checked');

      cy.get(`[data-cy="climatePledgeFriendly"]`).should('not.be.checked');
      cy.get(`[data-cy="climatePledgeFriendly"]`).click();
      cy.get(`[data-cy="climatePledgeFriendly"]`).should('be.checked');

      cy.get(`[data-cy="salesVolume"]`).type('ew');
      cy.get(`[data-cy="salesVolume"]`).should('have.value', 'ew');

      cy.get(`[data-cy="delivery"]`).type('that');
      cy.get(`[data-cy="delivery"]`).should('have.value', 'that');

      cy.get(`[data-cy="couponText"]`).type('angrily');
      cy.get(`[data-cy="couponText"]`).should('have.value', 'angrily');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        orderAnItem = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', orderAnItemPageUrlPattern);
    });
  });
});
