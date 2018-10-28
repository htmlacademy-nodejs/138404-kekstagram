'use strict';

const {
  MongoClient
} = require(`mongodb`);

const {
  name
} = require(`../../package`);

const URL = `mongodb://localhost:27017/`;

module.exports = MongoClient.connect(URL, {
  useNewUrlParser: true
})
  .then((client) => client.db(name))
  .catch((err) => {
    console.error(`Failed to connect BD`, err);
    process.exit(1);
  });
