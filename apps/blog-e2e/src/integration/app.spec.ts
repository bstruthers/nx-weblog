describe('blog', () => {
  beforeEach(() => {
    cy.intercept('/assets/config.yaml', 'title: Hello, there!').as('config');
    cy.visit('/');
  });

  it('should have the title from the configuration', () => {
    cy.title().should('eq', 'Hello, there!');
  });
});
