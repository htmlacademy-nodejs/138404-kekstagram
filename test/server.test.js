"use strict";

const supertest = require(`supertest`);
const assert = require(`assert`);
const express = require(`express`);

const postsStoreMock = require(`./mock/posts-store-mock`);
const imageStoreMock = require(`./mock/image-store-mock`);
const postsRouter = require(`../src/posts/route`)(
    postsStoreMock,
    imageStoreMock
);

const NUMBER_POSTS_ELEMENTS = 17;

const app = express();
app.use(`/api/posts`, postsRouter);

describe(`GET`, () => {
  it(`get all posts`, async () => {
    const response = await supertest(app)
      .get(`/api/posts`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);
    const posts = response.body;
    assert.strictEqual(posts.length, NUMBER_POSTS_ELEMENTS);
  });

  it(`get all posts with / at the end`, async () => {
    const response = await supertest(app)
      .get(`/api/posts/`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);
    const posts = response.body;
    assert.strictEqual(posts.length, NUMBER_POSTS_ELEMENTS);
  });

  //   it(`get data from unknown resource`, async () =>
  //     await supertest(app)
  //       .get(`/api/oneone`)
  //       .set(`Accept`, `application/json`)
  //       .expect(404)
  //       .expect(`Page was not found`)
  //       .expect(`Content-Type`, /html/));
  // });

  describe(`GET /api/posts/:date`, () => {
    // it(`get post with date 1 March 2029`, async () => {
    //   const date = new Date(2029, 2, 1);
    //   const response = await supertest(app)
    //     .get(`/api/posts/${date}`)
    //     .set(`Accept`, `application/json`)
    //     .expect(404)
    //     .expect(`Content-Type`, /html/);
    //   const post = response.body;
    //   assert.strictEqual(post.date, date);
    // });

    it(`get post with unknown date`, async () => {
      const date = new Date(2029, 2, 1);
      return await supertest(app)
        .get(`/api/posts/${date}/`)
        .set(`Accept`, `application/json`)
        .expect(404)
        .expect(`Не найден пост с датой`)
        .expect(`Content-Type`, /html/);
    });
  });

});

describe(`POST`, () => {
  describe(``, () => {
    it(`POST /api/posts/`, async () => {
      await supertest(app)
        .post(`/api/posts`)
        .field(`scale`, 77)
        .field(`effect`, `chrome`)
        .attach(`filename`, `test/fixtures/keks.png`)
        .set(`Accept`, `image/png`)
        .set(`Content-Type`, `multipart/form-data`)
        .expect(200)
        .expect(`Content-Type`, /image/);
    });

    it(`POST /api/posts/ without require param`, async () => {
      const response = await supertest(app)
        .post(`/api/posts`)
        .field(`scale`, `200`)
        .field(`effect`, `marvin`)
        .attach(`filename`, `test/fixtures/keks.png`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `multipart/form-data`)
        .expect(400)
        .expect(`Content-Type`, /json/);
      const post = response.body;
      assert.deepEqual(post[0].fieldName, `scale`);
    });
  });
});
