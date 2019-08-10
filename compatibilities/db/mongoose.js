const mongoose = require('mongoose')

const logger = require('./../utils/logger');


const MONGO_PORT = 27017;
const MONGO_HOST = '127.0.0.1';
const MONGO_DB = 'MyDb';

module.exports = function() {



    /*
     **  mongoDb connection details
     */
    mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`, { useNewUrlParser: true })
        .then(() => { logger.info(`mongoDb running on ${MONGO_HOST}, port: ${MONGO_PORT}, using db: ${MONGO_DB}`) })
        .catch(() => logger.error(`error connecting to MongoDb`));

    mongoose.set('useFindAndModify', false);
    mongoose.set('useNewUrlParser', true);

}