// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import '@applitools/eyes-cypress/commands'
import './commands'

if (Cypress.env('APPLITOOLS_SETUP')) {
    beforeEach(() => {
        cy.eyesOpen({
            appName: 'Umami - Drupal Site!',
            batchName: 'Umami - Drupal Site!',
            browser: [
                { width: 1920, height: 1080, name: 'chrome' },
                { width: 1024, height: 768, name: 'firefox' },
                { width: 1440, height: 900, name: 'safari' },
                { width: 1200, height: 800, name: 'edgechromium' },
                { deviceName: 'iPhone X' },
                { deviceName: 'iPad' },
                { deviceName: 'Pixel 2' },
            ],
            concurrency: 50,
        });
    });

    afterEach(() => {
        cy.eyesClose();
    });

} else {
    // do nothing for visual test commands
    Cypress.Commands.overwrite(
        'eyesCheckWindow',
        (eyesCheckWindow, options = {}) => {
            if (options.tag) {
                cy.log(`👀 skipping screenshot **${options.tag}**`);
            } else {
                cy.log(`👀 skipping screenshot`);
            }
        },
    )
}


Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
});
