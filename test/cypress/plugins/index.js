// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

module.exports = (on, config) => {
  // IMPORTANT to return the config object
  // with the any changed environment variables
  if (process.env.APPLITOOLS_API_KEY) {
    config.env.APPLITOOLS_SETUP = '1'
  }

  return config
}

require('@applitools/eyes-cypress')(module)