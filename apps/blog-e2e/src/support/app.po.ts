export const interceptCommonContent = () => {
  cy.intercept('/assets/content/header.md', '# header.md').as('header');
  cy.intercept('/assets/content/sidebar.md', '# sidebar.md').as('sidebar');
  cy.intercept('/assets/content/footer.md', '# footer.md').as('footer');
  cy.intercept('/assets/config.yaml', 'title: "Well, Hello, there!"').as(
    'config'
  );
};
