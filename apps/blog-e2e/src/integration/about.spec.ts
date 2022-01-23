describe('When rendering the about page', () => {
  beforeEach(() => {
    cy.intercept('/assets/header.md', '# header.md').as('header');
    cy.intercept('/assets/sidebar.md', '# sidebar.md').as('sidebar');
    cy.intercept('/assets/footer.md', '# footer.md').as('footer');
    cy.intercept('/assets/about.md', '# about page.md').as('content');
    cy.intercept('/assets/config.yaml', 'title: Hello, there!').as('config');
    cy.visit('/about');
  });

  it('should show the about page content', () => {
    cy.get('.blog-content').should('exist').should('contain.text', 'about page.md');
  });
});
