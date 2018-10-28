'use strict';

const express = require(`express`);
// eslint-disable-next-line new-cap
const router = express.Router();
const multer = require(`multer`);

const {
  Duplex
} = require(`stream`);
const MongoError = require(`mongodb`).MongoError;

const jsonParse = express.json();
const upload = multer();

const validate = require(`./validate`);
const NotFoundError = require(`../error/not-found-error`);
const ValidateError = require(`../error/validate`);

const SKIP_DEFAULT = 0;
const LIMIT_DEFAULT = 50;

const asyncWrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const toStream = (buffer) => {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const toPage = async (cursor, skip = SKIP_DEFAULT, limit = LIMIT_DEFAULT) =>
  await cursor
  .skip(skip)
  .limit(limit)
  .toArray();

router.get(`/`, asyncWrap(async (req, res) => {
  const skip = parseInt(req.query.skip, 10) || SKIP_DEFAULT;
  const limit = parseInt(req.query.limit, 10) || LIMIT_DEFAULT;
  const data = await router.postsStore.allPosts;

  res.send(await toPage(data, skip, limit));
}));

router.get(`/:date`, asyncWrap(async (req, res) => {
  const date = parseInt(req.params.date, 10);
  const post = await router.postsStore.getPost(date);

  if (!post) {
    throw new NotFoundError(`Не найден пост с датой`);
  }

  const {
    stream,
    info
  } = await router.imageStore.get(post._id);

  if (!stream) {
    throw new NotFoundError(`Аватар не найден!`);
  }

  res.set({
    'Content-Type': post.filename.mimetype,
    'Content-Length': info.length
  });

  res.on(`error`, console.error);
  res.on(`end`, res.end);
  stream.on(`error`, console.error);
  stream.on(`end`, res.end);
  stream.pipe(res);


  res.send(post);
}));

router.post(``, jsonParse, upload.single(`filename`), asyncWrap(async (req, res, _next) => {
  const {
    body,
    file
  } = req;

  if (file) {
    const {
      mimetype,
      originalname
    } = file;
    body.filename = {
      mimetype,
      name: originalname
    };
  }

  const validated = validate(body);
  validated.date = Date.now();
  const result = await router.postsStore.save(validated);
  const insertedId = result.insertedId;

  if (file) {
    await router.imageStore.save(insertedId, toStream(file.buffer));
    res.type(file.mimetype);
    res.send(file.buffer);
    return;
  }

  res.send(validated);
}));

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Page was not found`);
};

const ERROR_HANDLER = (err, req, res, _next) => {
  console.error(err);
  if (err instanceof ValidateError) {
    res.status(err.code).json(err.errors);
    return;
  } else if (err instanceof MongoError) {
    res.status(400).json(err.message);
    return;
  }

  res.status(err.code || 500).send(err.message);
};

router.use(ERROR_HANDLER);
router.use(NOT_FOUND_HANDLER);

module.exports = function (postsStore, imageStore) {
  router.postsStore = postsStore;
  router.imageStore = imageStore;
  return router;
};
