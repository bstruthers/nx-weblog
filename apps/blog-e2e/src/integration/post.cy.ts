import { interceptCommonContent } from '../support/app.po';

describe('When rendering a post with just a slug', () => {
  beforeEach(() => {
    interceptCommonContent();

    cy.intercept('/assets/content/posts/slug.md', '# slug.md').as('content');
    cy.visit('/posts/slug');
  });

  it('should show the post content', () => {
    cy.get('.blog-content').should('exist').should('contain.text', 'slug.md');
  });

  it('should go to the not found page when the slug does not exist', () => {
    cy.intercept('assets/posts/not-found', { statusCode: 404 });
    cy.visit('/posts/not-found', { failOnStatusCode: false });
    cy.url().should('equal', 'http://localhost:4200/not-found');
  });
});

describe('When rendering a post with year, month, and slug', () => {
  beforeEach(() => {
    interceptCommonContent();

    cy.intercept(
      '/assets/content/posts/2023/01/slug.md',
      '# year, month, slug.md'
    ).as('content');
    cy.visit('/posts/2023/01/slug');
  });

  it('should show the post content', () => {
    cy.get('.blog-content')
      .should('exist')
      .should('contain.text', 'year, month, slug.md');
  });

  it('should go to the not found page when the year, month, and slug does not exist', () => {
    cy.intercept('assets/posts/2023/01/not-found', { statusCode: 404 });
    cy.visit('/posts/2023/01/not-found', { failOnStatusCode: false });
    cy.url().should('equal', 'http://localhost:4200/not-found');
  });
});
