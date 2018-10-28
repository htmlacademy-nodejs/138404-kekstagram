'use strict';

const Cursor = require(`./cursor-mock`);
const {generateData} = require(`./generate`);

class PostsStoreMock {
  constructor(data) {
    this.data = data;
  }

  async getPost(date) {
    return this.data.find((it) => it.date === date);
  }

  get allPosts() {
    return (async () => new Cursor(this.data))();
  }

  async save() {
    return {
      insertedId: 42
    };
  }
}

module.exports = new PostsStoreMock(generateData(17));
