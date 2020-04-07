/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */

const path = require('path');
const express = require('express');
const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const compression = require('compression');
const _ = require('lodash');
const serverConfig = require('./config/config').default.getOptions().app_server;
const webpack = (serverConfig.isDev) ? require('webpack') : null;
const webpackConfig = (serverConfig.isDev) ? require('./webpack.config.js') : null;
const webpackMiddleware = (serverConfig.isDev) ? require('webpack-dev-middleware') : null;
const webpackHotMiddleware = (serverConfig.isDev) ? require('webpack-hot-middleware') : null;
const chokidar = (serverConfig.isDev) ? require('chokidar') : null;

/*
 * Catch-all error handler
 */
const errorHandler = (err, req, res, next) => {
  if (req.timedout) {
    const errorMsg = `Request timed out at ${serverConfig.request_timeout / 1000} sec.`;

    console.log(`Error: ${errorMsg}`);
    if (!res.headersSent) res.status(500).send({ error: `${errorMsg}` });
  } else {
    console.log(err || 'Unknown error');
    next(err);
  }
};
const app = express();
require('console-stamp')(console, { pattern: 'yyyy-mm-dd HH:MM:ss.l' });

/*
 * Server configuration
 */
app.use(timeout(serverConfig.request_timeout));
app.use(bodyParser.json(serverConfig.body_parser.json));
app.use(bodyParser.urlencoded(serverConfig.body_parser.urlencoded));
app.use(compression());
// app.use((req, res, next) => {
//   require('./server/routes').default(req, res, next); // eslint-disable-line global-require
// });
app.use(errorHandler);

/*
 * Hook up webpack middleware in dev or serve static build
 */
if (serverConfig.isDev) {
  const watcher = chokidar.watch(['./server', './config']);
  const compiler = webpack(webpackConfig);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'app',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  // Proxy to webpack dev server
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', (req, res) => {
    if (res.finished) return;

    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'public/build/index.html')));
    res.end();
  });

  // Enable hot-reloading of dev server files
  watcher.on('ready', () => {
    watcher.on('all', () => {
      console.log('Clearing cached server files');
      Object.keys(require.cache).forEach((id) => {
        if (_.isString(id) && /[/\\](server|config)[/\\]/.test(id)) delete require.cache[id];
      });
    });
  });
} else {
  // In production, use static files
  app.use(express.static(path.join(__dirname, 'public/build')));
  app.get('*', (req, res) => {
    if (res.finished) return;
    res.sendFile(path.join(__dirname, 'public/build/index.html'));
  });
}

app.listen(serverConfig.port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.info(`Listening on port ${serverConfig.port}`);
    if (serverConfig.isDev) console.info('Wait for webpack to finish bundling...');
  }
});
