import { interceptCommonContent } from '../support/app.po';

describe('When rendering the blog', () => {
  beforeEach(() => {
    interceptCommonContent();

    cy.intercept('/assets/content/home.md', '# content.md').as('content');
    cy.visit('/');
  });

  it('should combine the content header and title from the configuration', () => {
    cy.title().should('eq', 'content.md — Well, Hello, there!');
  });

  it('should have a header, content, sidebar, and footer', () => {
    cy.get('.blog-header').should('exist').should('contain.text', 'header.md');
    cy.get('.blog-content')
      .should('exist')
      .should('contain.text', 'content.md');
    cy.get('.blog-sidebar')
      .should('exist')
      .should('contain.text', 'sidebar.md');
    cy.get('.blog-footer').should('exist').should('contain.text', 'footer.md');
  });
});
