"use strict";
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */
Object.defineProperty(exports, "__esModule", { value: true });
const env = process.env.NODE_ENV || process.env.npm_config_env;
const port = process.env.PORT || process.env.npm_config_port;
const options = Object.assign(require('./env/all.json'), require(`./env/${env}.json`));
try {
  console.log(`Using environment config <${env}.json>`);
}
catch (e) {
  console.error('\nError: Environment config not found');
  process.exit();
}
if (port) {
  options.app_server = Object.assign(options.app_server || {}, { port });
}
exports.default = {
  /**
   * Get app settings based on environment
   * @return {EnvironmentOptions} App settings
   */
  getOptions: () => options,
};
