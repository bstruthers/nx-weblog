import { interceptCommonContent } from '../support/app.po';

describe('When rendering a tag', () => {
  beforeEach(() => {
    interceptCommonContent();

    cy.intercept('/assets/content/tags/tag.md', '# tag.md').as('content');
    cy.visit('/tags/tag');
  });

  it('should show the tag content', () => {
    cy.get('.blog-content').should('exist').should('contain.text', 'tag.md');
  });

  it('should go to the not found page when the tag does not exist', () => {
    cy.intercept('assets/tags/not-found', { statusCode: 404 });
    cy.visit('/tags/not-found', { failOnStatusCode: false });
    cy.url().should('equal', 'http://localhost:4200/tags/not-found');
  });
});
