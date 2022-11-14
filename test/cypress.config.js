const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportHeight: 900,
  viewportWidth: 1440,
  waitForFileChanges: false,
  experimentalStudio: true,
  eyesTimeout: 180000,
  env: {
    cyAdminUser: 'admin',
    cyAdminPassword: 'admin',
    cyAdminRole: 'administrator',
    cyEditorUser: 'editor',
    cyEditorPassword: 'editor',
    cyEditorRole: 'editor',
  },
  eyesIsDisabled: false,
  eyesFailCypressOnDiff: true,
  eyesDisableBrowserFetching: false,
  eyesTestConcurrency: 5,
  appliConfFile: {
    batch: {
      id: 'f8da1590-2b07-4ea1-82a4-13a9dc0c64d9',
    },
  },
  eyesIsGlobalHooksSupported: false,
  eyesPort: 52873,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://niid9.lndo.site/',
  },
})
