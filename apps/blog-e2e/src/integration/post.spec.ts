describe('When rendering a post', () => {
  beforeEach(() => {
    cy.intercept('/assets/header.md', '# header.md').as('header');
    cy.intercept('/assets/sidebar.md', '# sidebar.md').as('sidebar');
    cy.intercept('/assets/footer.md', '# footer.md').as('footer');
    cy.intercept('/assets/posts/slug.md', '# slug.md').as('content');
    cy.intercept('/assets/config.yaml', 'title: Hello, there!').as('config');
    cy.visit('/posts/slug');
  });

  it('should show the not found page content', () => {
    cy.get('.blog-content').should('exist').should('contain.text', 'slug.md');
  });

  it('should go to the not found page when the slug does no exist', () => {
    cy.intercept('assets/posts/not-found', { statusCode: 404 });
    cy.visit('/posts/not-found', { failOnStatusCode: false });
    cy.url().should('equal', 'http://localhost:4200/not-found');
  });
});
