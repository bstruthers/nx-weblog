import { interceptCommonContent } from '../support/app.po';

describe('When rendering the about page', () => {
  beforeEach(() => {
    interceptCommonContent();
    cy.intercept('/assets/content/about.md', '# about page.md').as('content');

    cy.visit('/about');
  });

  it('should show the about page content', () => {
    cy.get('.blog-content')
      .should('exist')
      .should('contain.text', 'about page.md');
  });
});
