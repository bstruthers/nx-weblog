import { interceptCommonContent } from '../support/app.po';

describe('When rendering the Not Found page', () => {
  beforeEach(() => {
    interceptCommonContent();

    cy.intercept('/assets/content/not-found.md', '# not-found page.md').as(
      'content'
    );
    cy.visit('/asdfadgfas');
  });

  it('should show the not found page content', () => {
    cy.get('.blog-content')
      .should('exist')
      .should('contain.text', 'not-found page.md');
  });
});
