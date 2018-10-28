'use strict';

const express = require(`express`);
const path = require(`path`);
const colors = require(`colors/safe`);
const postsStore = require(`./posts/store`);
const imageStore = require(`./images/store`);
const postRouter = require(`./posts/route`)(postsStore, imageStore);

const {
  printCommand,
  printCommandError
} = require(`./commands/utils`);

const app = express();
const defaultPort = 3000;

const staticPath = path.resolve(__dirname, `../static/`);

const NOT_FOUND_HANDLER = (req, res) =>
  res.status(404).send(`Page was not found`);

const ERROR_HANDLER = (err, req, res, _next) => {
  if (err) {
    printCommandError(colors.red(err));
    res.status(err.code || 500).send(err.message);
  }
};

app.use(express.static(staticPath));
app.use(`/api/posts`, postRouter);
app.use(NOT_FOUND_HANDLER);
app.use(ERROR_HANDLER);

const start = (port = defaultPort) =>
  app.listen(port, () =>
    printCommand(`Server start at http://localhost:${port}`)
  );


module.exports = {
  start,
  app,
};

if (require.main === module) {
  start();
}
