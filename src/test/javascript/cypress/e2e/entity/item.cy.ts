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

describe('Item e2e test', () => {
  const itemPageUrl = '/item';
  const itemPageUrlPattern = new RegExp('/item(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const itemSample = { asin: 'sit eek excitable' };

  let item;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/items+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/items').as('postEntityRequest');
    cy.intercept('DELETE', '/api/items/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (item) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/items/${item.id}`,
      }).then(() => {
        item = undefined;
      });
    }
  });

  it('Items menu should load Items page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('item');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Item').should('exist');
    cy.url().should('match', itemPageUrlPattern);
  });

  describe('Item page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(itemPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Item page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/item/new$'));
        cy.getEntityCreateUpdateHeading('Item');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', itemPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/items',
          body: itemSample,
        }).then(({ body }) => {
          item = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/items+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/items?page=0&size=20>; rel="last",<http://localhost/api/items?page=0&size=20>; rel="first"',
              },
              body: [item],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(itemPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Item page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('item');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', itemPageUrlPattern);
      });

      it('edit button click should load edit Item page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Item');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', itemPageUrlPattern);
      });

      it('edit button click should load edit Item page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Item');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', itemPageUrlPattern);
      });

      it('last delete button click should delete instance of Item', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('item').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', itemPageUrlPattern);

        item = undefined;
      });
    });
  });

  describe('new Item page', () => {
    beforeEach(() => {
      cy.visit(`${itemPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Item');
    });

    it('should create an instance of Item', () => {
      cy.get(`[data-cy="asin"]`).type('cobble');
      cy.get(`[data-cy="asin"]`).should('have.value', 'cobble');

      cy.get(`[data-cy="productTitle"]`).type('minus apropos');
      cy.get(`[data-cy="productTitle"]`).should('have.value', 'minus apropos');

      cy.get(`[data-cy="productPrice"]`).type('treaty gigantic');
      cy.get(`[data-cy="productPrice"]`).should('have.value', 'treaty gigantic');

      cy.get(`[data-cy="productOriginalPrice"]`).type('pricey oof');
      cy.get(`[data-cy="productOriginalPrice"]`).should('have.value', 'pricey oof');

      cy.get(`[data-cy="currency"]`).type('fatal repackage hastily');
      cy.get(`[data-cy="currency"]`).should('have.value', 'fatal repackage hastily');

      cy.get(`[data-cy="productStarRating"]`).type('to upliftingly gosh');
      cy.get(`[data-cy="productStarRating"]`).should('have.value', 'to upliftingly gosh');

      cy.get(`[data-cy="productNumRatings"]`).type('18587');
      cy.get(`[data-cy="productNumRatings"]`).should('have.value', '18587');

      cy.get(`[data-cy="productUrl"]`).type('meh');
      cy.get(`[data-cy="productUrl"]`).should('have.value', 'meh');

      cy.get(`[data-cy="productPhoto"]`).type('uselessly');
      cy.get(`[data-cy="productPhoto"]`).should('have.value', 'uselessly');

      cy.get(`[data-cy="productNumOffers"]`).type('4706');
      cy.get(`[data-cy="productNumOffers"]`).should('have.value', '4706');

      cy.get(`[data-cy="productMinimumOfferPrice"]`).type('complain in');
      cy.get(`[data-cy="productMinimumOfferPrice"]`).should('have.value', 'complain in');

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

      cy.get(`[data-cy="salesVolume"]`).type('worship on in');
      cy.get(`[data-cy="salesVolume"]`).should('have.value', 'worship on in');

      cy.get(`[data-cy="delivery"]`).type('why');
      cy.get(`[data-cy="delivery"]`).should('have.value', 'why');

      cy.get(`[data-cy="couponText"]`).type('revise trusty');
      cy.get(`[data-cy="couponText"]`).should('have.value', 'revise trusty');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        item = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', itemPageUrlPattern);
    });
  });
});
