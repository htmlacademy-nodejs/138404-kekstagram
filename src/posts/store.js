'use strict';

const db = require(`../database/db`);
const setupPosts = async () => (await db).collection(`posts`);

class PostsStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getPost(date) {
    return (await this.collection).findOne({
      date
    });
  }

  get allPosts() {
    return (async () => (await this.collection).find())();
  }

  async save(data) {
    return (await this.collection).insertOne(data);
  }
}

module.exports = new PostsStore(setupPosts()
  .catch((err) => console.error(`Field to setup collections 'posts'`, err)));
