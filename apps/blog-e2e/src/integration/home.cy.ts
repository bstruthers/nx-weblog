import { interceptCommonContent } from '../support/app.po';

describe('When rendering the home page', () => {
  beforeEach(() => {
    interceptCommonContent();
    cy.intercept('/assets/content/home.md', '# home page.md').as('content');

    cy.visit('/');
  });

  it('should show the home page content', () => {
    cy.get('.blog-content')
      .should('exist')
      .should('contain.text', 'home page.md');
  });
});
