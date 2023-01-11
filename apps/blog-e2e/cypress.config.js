const { defineConfig } = require('cypress');

module.exports = defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  modifyObstructiveCode: false,
  video: true,
  videosFolder: '../../dist/cypress/apps/blog-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/blog-e2e/screenshots',
  chromeWebSecurity: false,
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    setupNodeEvents(on, config) {},
    specPattern: './src/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts',
  },
});
