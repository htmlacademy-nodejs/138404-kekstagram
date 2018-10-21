"use strict";

const supertest = require(`supertest`);
const assert = require(`assert`);
const {
  app
} = require(`../src/server`);

describe(`GET`, () => {
  describe(`GET /api/posts`, () => {
    it(`get all posts`, async () => {
      const response = await supertest(app)
        .get(`/api/posts`)
        .set(`Accept`, `application/json`)
        .expect(200)
        .expect(`Content-Type`, /json/);
      const posts = response.body;
      assert.strictEqual(posts.length, 17);
    });

    it(`get all posts with / at the end`, async () => {
      const response = await supertest(app)
        .get(`/api/posts/`)
        .set(`Accept`, `application/json`)
        .expect(200)
        .expect(`Content-Type`, /json/);
      const posts = response.body;
      assert.strictEqual(posts.length, 17);
    });

    it(`get data from unknown resource`, async () =>
      await supertest(app)
      .get(`/api/oneone`)
      .set(`Accept`, `application/json`)
      .expect(404)
      .expect(`Page was not found`)
      .expect(`Content-Type`, /html/));
  });

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

    it(`get post with / at the end`, async () => {
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
  describe(`POST /api/posts/`, () => {
    it(`send post as json`, async () => {
      const sent = {
        date: Date.now()
      };

      const response = await supertest(app)
        .post(`/api/posts`)
        .send(sent)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `application/json`)
        .expect(200)
        .expect(`Content-Type`, /json/);
      const post = response.body;
      assert.deepEqual(post, sent);
    });

    it(`send post as multipart/form-data`, async () => {
      const date = Date.now();
      const response = await supertest(app)
        .post(`/api/posts`)
        .field(`date`, date)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `multipart/form-data`)
        .expect(200)
        .expect(`Content-Type`, /json/);
      const post = response.body;
      assert.deepEqual(post, {
        date
      });
    });

    it(`send post with pick as multipart/form-data`, async () => {
      const date = Date.now();
      const response = await supertest(app)
        .post(`/api/posts`)
        .field(`date`, date)
        .attach(`url`, `test/fixtures/keks.png`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `multipart/form-data`)
        .expect(200)
        .expect(`Content-Type`, /json/);
      const post = response.body;
      assert.deepEqual(post, {
        date,
        url: `keks.png`
      });
    });
  });
});
