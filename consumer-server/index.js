const express = require('express')
const app = express();
const redis = require('redis');
const pino = require('pino')
const logger = pino({
  prettyPrint: {colorize: true}
});

const Match = require('./models/all-models').matchesModel;
const User = require('./models/all-models').userModel;
const Interest = require('./models/all-models').interestModel;

require('dotenv').config();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


function generateMatchesForuser(userdId, [...usersArray]) {
  logger.info(`generating matches for user: [${userId}] against users of length: ${usersArray.length}`)

  let pairsArray = [];

  usersArray.forEach(u => {
    pairsArray.push(`${userId}-${u._id}`);
  });

  return pairsArray;
}

const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
const redisClient = redis.createClient(redisUrl);

redisClient.expire('redisClient', process.env.REDIS_EXPIRY); // 1 hour

redisClient.on('connect', function() {
  logger.info(`Redis connection established: http://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}, - expiry: [${process.env.REDIS_EXPIRY}]`)
});


redisClient.keys('*', (err, keys) => {
  logger.info(`keys: ${keys}`)
})

redisClient.get("{\"collection\":\"interests\"}")


const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then( () => {
    logger.info(`MongoDB connection established : http://${process.env.MONGO_HOST}:${process.env.MONGO_PORT} - db    : [${process.env.MONGO_DB}]`)
  })
  .catch( (err) => {
    logger.error(`error connecting to db: ${err}`);
    throw new Error(`error connecting to mongoDb running on ${process.env.MONGO_HOST}, port: ${process.env.MONGO_PORT}, using db: ${process.env.MONGO_DB}`)
  });

  const open = require('amqplib').connect(`amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASS}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}/${process.env.RABBIT_VHOST}`);


const RABBIT_DELETE_M_Q = process.env.RABBIT_DELETE_M_Q || 'DeleteMatchesQ';
const RABBIT_REGISTER_M_Q = process.env.RABBIT_REGISTER_M_Q || 'RegisterMatchesQ'

const REDIS_EXPIRY = process.env.REDIS_EXPIRY || 3600;


// read the DeletematchesQ and process ny match updates due to the user being deleted
// this avoids any blocking threads on the main server

let userId;

 open
  .then(conn => { 
    return conn.createChannel()
  })
  .then(channel => {
    logger.info(`RabbitMQ connection established on port: ${process.env.RABBIT_PORT}`);

    channel.consume(RABBIT_REGISTER_M_Q, async (msg) => {
      userId = JSON.parse(Buffer.from(msg.content));

      let usersArray = await User.find();

      // filter the userid out of the array

      // logger.warn(`usersArray pre length: ${usersArray.length}`)

      usersArray = usersArray.filter(u => 
        !u._id.equals(userId)
      )

      // logger.warn(`usersArray post length: ${usersArray.length}`)

      let pairsArray = generateMatchesForuser(userId, usersArray);
      let interestsArray = await Interest.find();
      let userProfile = await User.findOne({ _id: userId });

      // logger.error(`userprofile: ${userProfile.name}`)

      const { generateMatchModel } = require('./utils/generate-match-model.js');


      usersArray.forEach(async otherUser => {
        let otherUserId = otherUser._id;

        let matchModel = generateMatchModel(userProfile, otherUser, [...interestsArray]);
        // logger.info(`matchModel: ${matchModel}`);

        // update the matches db
        let mdb = await matchModel.save();

        let u1 = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { matches: mdb._id } },
          { new: true, upsert: true }
        );

        let u2 = await User.findOneAndUpdate(
          { _id: otherUserId },
          { $push: { matches: mdb._id } },
          { new: true, upsert: true }
        );

        logger.info(`matches: [${mdb._id}] saved to users: [${userId}] and [${otherUserId}]`)

   

      });

      await channel.ack(msg)
    });


    channel.consume(RABBIT_DELETE_M_Q, async (msg) => {
      userId = Buffer.from(msg.content).toString();

      logger.info(`Deleting matches for ${userId}`);
        // update the mongodb
        Match.deleteMany({ users: mongoose.Types.ObjectId(userId) })
          .then(async result => {
            logger.info(`result: ${result}`)
            logger.info(result)
            if(result.deletedCount === 0 || result.ok !== 1) {
              logger.warn(`there was an issue deleting the records`)
            } else {
              logger.info(`Successully deleted ${result.deletedCount} records for user: [${userId}]`)
              //send the data to redis
              await channel.ack(msg);
            }
            // update the redis instance with all of the matches
            const allMatches = await Match.find()
              .then(results => {
                logger.info(`there are ${results.length} matches in the db`)
                redisClient.del("{\"collection\":\"matches\"}")
                redisClient.set("{\"collection\":\"matches\"}", JSON.stringify(results), 'EX', REDIS_EXPIRY);
              });            
          })
          .catch(err => {
            logger.error(`error: ${err}`)
          });
    });

    // channel.consume('DeleteMatchesQ',  (msg) => {
    //   userId = Buffer.from(msg.content).toString();

    //   logger.info(`Deleting matches for ${userId}`);
    //     // update the mongodb
    //     Match.deleteMany({ users: mongoose.Types.ObjectId(userId) })
    //       .then(async result => {
    //         logger.info(`result: ${result}`)
    //         logger.info(result)
    //         if(result.deletedCount === 0 || result.ok !== 1) {
    //           logger.warn(`there was an issue deleting the records`)
    //         } else {
    //           logger.info(`Successully deleted ${result.deletedCount} records for user: [${userId}]`)
    //           //send the data to redis
    //           await channel.ack(msg);
    //         }
    //         // update the redis instance with all of the matches
    //         const allMatches = await Match.find()
    //           .then(results => {
    //             logger.info(`there are ${results.length} matches in the db`)
    //             redisClient.del("{\"collection\":\"matches\"}")
    //             redisClient.set("{\"collection\":\"matches\"}", JSON.stringify(results), 'EX', REDIS_EXPIRY);
    //           });            
    //       })
    //       .catch(err => {
    //         logger.error(`error: ${err}`)
    //       });
    // });
  })
  .catch(err => {
    logger.error(`error: ${err}`)
  });

  


/*
*   Helathcheck endpoint
*/
app.get('/health', function (req, res) {
  res.status(200).json({
    status: 'UP'
  });
});


logger.info(`Server running on port: ${process.env.APP_PORT}`);
app.listen(process.env.APP_PORT);