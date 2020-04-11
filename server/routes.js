/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

const express = require('express');

const appRouter = express.Router();

const apiRoutes = {
  data: [
    './services/DataRoutes'
  ]
};

/**
 * API: Handle valid routes
 */
Object.keys(apiRoutes).forEach((namespace) => {
  apiRoutes[namespace].forEach((route) => {
    appRouter.use(`/api/${namespace}/`, (req, res, next) => {
      require(route)(req, res, next); // eslint-disable-line global-require
    });
  });
});

/**
 * API: Handle unknown routes
 */
appRouter.all('/api/*', (req, res) => {
  if (!req.timedout && !res.headersSent) res.status(404).send({ error: 'Not found' });
});

exports.default = appRouter;
