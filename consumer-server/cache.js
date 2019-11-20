const mongoose = require('mongoose');
const util = require('util');
const logger = require('./../utils/logger');

const REDIS_EXPIRY = process.env.REDIS_EXPIRY || 3600;

module.exports = (client) => {
  client.get = util.promisify(client.get);

  const exec = mongoose.Query.prototype.exec;

  mongoose.Query.prototype.cache = function() {
    this.useCache = true;
    return this;
  }

  mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
      logger.warn(`[${this.useCache}]: retrieving from mongo: ${this.mongooseCollection.name}`);
      return await exec.apply(this, arguments);
    }

    // create a unique key based off any parameters and collection name
    const key = JSON.stringify(
      Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
      })
    );

    // see if we have a value for 'key' in redis
    const cacheValue = await client.get(key);

    if(cacheValue) {
      logger.warn(`retrieving from cache, key: [${key}]....`)
      const doc = JSON.parse(cacheValue)

      return Array.isArray(doc) 
        ? doc.map(d => new this.model(d))
        : new this.model(doc);
    }
    
    logger.warn(`[${this.useCache}]: retrieving from mongo: ${this.mongooseCollection.name}`);
    const result = await exec.apply(this, arguments);

    client.set(key, JSON.stringify(result), 'EX', REDIS_EXPIRY);

    return result;
  };
}
