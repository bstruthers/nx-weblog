import { interceptCommonContent } from '../support/app.po';

describe('When something is not found', () => {
  beforeEach(() => {
    interceptCommonContent();

    cy.intercept('/assets/content/not-found.md', '# not-found page.md').as(
      'content'
    );
    cy.visit('/asdfadgfas');
  });

  it('should check the archive content', () => {
    cy.intercept('/assets/content/archived/asdfadgfas.md', '# archived.md').as(
      'archived'
    );

    cy.get('.blog-content')
      .should('exist')
      .should('contain.text', 'archived.md');
  });

  it('should show the not found page content when nothing can be found', () => {
    cy.intercept('/assets/content/archived/asdfadgfas.md', { statusCode: 404 });

    cy.get('.blog-content')
      .should('exist')
      .should('contain.text', 'not-found page.md');
  });
});
