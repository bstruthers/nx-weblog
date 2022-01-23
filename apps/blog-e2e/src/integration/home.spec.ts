describe('When rendering the home page', () => {
  beforeEach(() => {
    cy.intercept('/assets/header.md', '# header.md').as('header');
    cy.intercept('/assets/sidebar.md', '# sidebar.md').as('sidebar');
    cy.intercept('/assets/footer.md', '# footer.md').as('footer');
    cy.intercept('/assets/home.md', '# home page.md').as('content');
    cy.intercept('/assets/config.yaml', 'title: Hello, there!').as('config');
    cy.visit('/');
  });

  it('should show the home page content', () => {
    cy.get('.blog-content')
      .should('exist')
      .should('contain.text', 'home page.md');
  });
});
