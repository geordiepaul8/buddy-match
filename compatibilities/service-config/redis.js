const redis = require('redis');
const logger = require('./../utils/logger');
const { REDIS_HOST, REDIS_PORT, REDIS_EXPIRY } = require('./../lib/env-vars.js');


const redisUrl = `redis://${REDIS_HOST}:${REDIS_PORT}`;
const client = redis.createClient(redisUrl);

client.expire('client', REDIS_EXPIRY); // 1 hour

client.on('connect', function() {
  logger.info(`Redis connection established: http://${REDIS_HOST}:${REDIS_PORT}, - expiry: [${REDIS_EXPIRY}]`)
});

module.exports = client;