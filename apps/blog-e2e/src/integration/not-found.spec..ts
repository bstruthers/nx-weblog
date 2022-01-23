describe('When rendering the Not Found page', () => {
  beforeEach(() => {
    cy.intercept('/assets/header.md', '# header.md').as('header');
    cy.intercept('/assets/sidebar.md', '# sidebar.md').as('sidebar');
    cy.intercept('/assets/footer.md', '# footer.md').as('footer');
    cy.intercept('/assets/not-found.md', '# not-found page.md').as('content');
    cy.intercept('/assets/config.yaml', 'title: Hello, there!').as('config');
    cy.visit('/asdfadgfas');
  });

  it('should show the not found page content', () => {
    cy.get('.blog-content').should('exist').should('contain.text', 'not-found page.md');
  });
});
