describe('When rendering the blog', () => {
  beforeEach(() => {
    cy.intercept('/assets/header.md', '# header.md').as('header');
    cy.intercept('/assets/sidebar.md', '# sidebar.md').as('sidebar');
    cy.intercept('/assets/footer.md', '# footer.md').as('footer');
    cy.intercept('/assets/home.md', '# content.md').as('content');
    cy.intercept('/assets/config.yaml', 'title: Hello, there!').as('config');
    cy.visit('/');
  });

  it('should have the title from the configuration', () => {
    cy.title().should('eq', 'Hello, there!');
  });

  it('should have a header, content, sidebar, and footer', () => {
    cy.get('.blog-header').should('exist').should('contain.text', 'header.md');
    cy.get('.blog-content').should('exist').should('contain.text', 'content.md');
    cy.get('.blog-sidebar').should('exist').should('contain.text', 'sidebar.md');
    cy.get('.blog-footer').should('exist').should('contain.text', 'footer.md');
  });

  it('should use the title for the header there is no content', () => {
    cy.intercept('/assets/header.md', '').as('header');
    cy.visit('/');

    cy.get('.blog-header').should('exist').should('contain.text', 'Hello, there!');
  });

  it('should not show a sidebar when there is no content', () => {
    cy.intercept('/assets/sidebar.md', '').as('sidebar');
    cy.visit('/');

    cy.get('.blog-sidebar').should('not.exist')
  });

  it('should not show a footer when there is no content', () => {
    cy.intercept('/assets/footer.md', '').as('footer');
    cy.visit('/');

    cy.get('.blog-footer').should('not.exist')
  });
});
