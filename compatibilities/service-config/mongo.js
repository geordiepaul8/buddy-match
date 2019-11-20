const mongoose = require('mongoose');

const cfg = require('./../lib/env-vars.js');
const logger = require('./../utils/logger');

module.exports = {
  connect: mongoose.connect(`mongodb://${cfg.MONGO_HOST}:${cfg.MONGO_PORT}/${cfg.MONGO_DB}`, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then( () => {
    logger.info(`MongoDB connection established : http://${cfg.MONGO_HOST}:${cfg.MONGO_PORT} - db    : [${cfg.MONGO_DB}]`)
  })
  .catch( (err) => {
    logger.error(`error connecting to db: ${err}`);
    throw new Error(`error connecting to mongoDb running on ${cfg.MONGO_HOST}, port: ${cfg.MONGO_PORT}, using db: ${cfg.MONGO_DB}`)
  })
}