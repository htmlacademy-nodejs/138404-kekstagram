'use strict';
/* eslint max-nested-callbacks: ["error", 4]*/
const {
  generateEntity,
  effects,
  convertDaysToMilliseconds
} = require(`./mock/generate`);
const assert = require(`assert`);

const isStringTrue = (string) => assert.equal(typeof string, `string`);
const isNumberTrue = (number) => assert.equal(typeof number, `number`);

describe(`Data`, () => {
  let data;

  beforeEach(() => {
    data = generateEntity();
  });

  describe(`check data.url`, () =>
    it(`is a string`, () => isStringTrue(data.url)));

  describe(`check data.scale`, () => {
    it(`is number`, () => isNumberTrue(data.scale));
    it(`is in range 0 - 100`, () =>
      assert.equal(data.scale >= 0 && data.scale <= 100, true));
  });

  describe(`check data.effect`, () => {
    it(`is string`, () => isStringTrue(data.effect));
    it(`is in effects array`, () =>
      assert.equal(effects.includes(data.effect), true));
  });

  describe(`check data.description`, () => {
    it(`is string`, () => isStringTrue(data.description));
    it(`description of the correct length`, () =>
      assert.equal(data.description.length <= 140, true));
  });

  describe(`check data.hashtags`, () => {
    it(`is array`, () => assert.equal(Array.isArray(data.hashtags), true));
    it(`hashtags of the correct length`, () =>
      assert.equal(data.hashtags.length < 6, true));
    it(`hashtag item is string`, () =>
      data.hashtags.forEach((item) => isStringTrue(item)));
    it(`hashtags elements begins with #`, () =>
      data.hashtags.forEach((item) => assert.equal(item[0] === `#`, true)));
    it(`hashtags have only unique elements`, () =>
      assert.equal(
          data.hashtags
          .map((item) => item.toLowerCase())
          .filter((v, i, a) => a.indexOf(v) === i).length ===
          data.hashtags.length,
          true
      ));
    it(`hashtag item has no whitespace`, () =>
      data.hashtags.forEach((item) =>
        assert.equal(item.indexOf(` `) < 0, true)
      ));
  });

  describe(`check data.likes`, () => {
    it(`is number`, () => isNumberTrue(data.likes));
    it(`is in range 0 - 1000`, () =>
      assert.equal(data.likes >= 0 && data.scale <= 1000, true));
  });

  describe(`check data.comments`, () => {
    it(`is array`, () => assert.equal(Array.isArray(data.comments), true));
    it(`item is string`, () =>
      data.comments.forEach((item) => isStringTrue(item)));
    it(`item is correct length`, () =>
      data.comments.forEach((item) => assert.equal(item.length <= 140, true)));
  });

  describe(`check data.date`, () => {
    it(`is number`, () => isNumberTrue(data.date));
    it(`is in correct range`, () => {
      const now = Date.now();
      assert.equal(
          data.date <= now && data.date >= now - convertDaysToMilliseconds(7),
          true
      );
    });
  });
});
