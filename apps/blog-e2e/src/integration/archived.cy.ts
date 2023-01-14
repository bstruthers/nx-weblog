import { interceptCommonContent } from '../support/app.po';

describe('When rendering an archived post', () => {
  beforeEach(() => {
    interceptCommonContent();

    cy.intercept(
      '/assets/content/archived/2009/01/old-post.md',
      '# archived.md'
    ).as('content');
    cy.visit('/archived/2009/01/old-post');
  });

  it('should show the archived content', () => {
    cy.get('.blog-content')
      .should('exist')
      .should('contain.text', 'archived.md');
  });

  it('should go to the not found page when the tag does not exist', () => {
    cy.intercept('assets/archived/not-found', { statusCode: 404 });
    cy.visit('/archived/not-found', { failOnStatusCode: false });
    cy.url().should('equal', 'http://localhost:4200/archived/not-found');
  });
});
