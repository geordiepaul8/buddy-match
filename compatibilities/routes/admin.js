const router = require('express').Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
// services
const compatibilitiesService = require('./../service/compatibilities');
const interestService = require('./../service/interests');
const userService = require('./../service/users');
// logger
const logger = require('./../utils/logger');
// middleware
const checkUserToken = require('./../middleware/check-user-token');
const { validateInterestId } = require('./../middleware/is-valid-object-id');


// get all users

// checkUserToken, 
router.get('/user/getAllUsers', jsonParser, async (req, res) => {
  const allUsers = await userService.findAllUsers()
    .cache()
    .then((users) => {
      logger.info(`retrieving ${users.length} users`);
      res.status(200).json({
        message: `retrieving ${users.length} users`,
        users
      });
    })
    .catch((err) => {
      logger.error(`error retrieving users: ${err}`);
      res.status(400).json({error: err});
    });
});


// validateInterestId, 
router.delete('/interests/deleteInterest/:id',jsonParser, (req, res) => {
  const client = require('./../service-config/redis');

  logger.info(`deleting an interest with name: ${req.body.name}`)

  let i = interestService.deleteInterest(req.params.id)
  .then( result => {
    logger.info(`interest: [${req.params.id}] deleted`);

    //remove the key from the cache so on the next 'getAll' the cache will be updated with the lates
    client.del("{\"collection\":\"interests\"}")

    res.status(201).json({
      message: `interest: [${req.params.id}] deleted`,
    });
  })
  .catch( err => {
    logger.error(`error deleting interest: ${err}`);
    res.status(400).json({ 
      message: `error deleting interest: ${err}`,
    });
  });
});




// if you remove an interest from the catalog then it may 
// impact anyone who has subscribed to it

// TODO: loop through user accounts to remove the deleted interest id
router.delete('/:interest_id', jsonParser, (req, res) => {
  // loop through all user records and set a remove marker?
  // for now it will just delete the record

  interestService.deleteInterest(req.params.interest_id)
    .then(r => {
      res.status(204).json();
    })
    .catch((err) => {
      res.status(400).json({
        message: err
      });
  });
});


/*
*   @param {id} the ObjectId of the user that has been deleted
*/
async function purgeMatchesListFromDeleteUser(id) {

  const client = require('./../service-config/redis');
  client.del("{\"collection\":\"matches\"}")

  logger.warn(`*******  PRUNING MATCHES FOR: ${id} ********`)

  let users;
  const u = await userService.findAllUsers()
    .cache()
    .then(results => {
      users = results;
    })
    .catch(err => {
      logger.error(`Error finding all users: ${err}`);
    })
  
  logger.info(`users length:   ${users.length}`);

  // 1. filter all matches for that user id

  let matches;
  let m = await compatibilitiesService.db_getAllMatchesForSingleUser(id)
    .then(results => {
      matches = results.filter(m => m.users.includes(id));
    })
    .catch(e => {
      logger.error(`error: ${e}`);
    });

  logger.info(`matches length: ${matches.length}`);

    // send the matches to the delete Q to be processed by another server

    /*
    *   push the data to the delete match Q
    */

    const RABBIT_USER = process.env.RABBIT_USER || 'user';
    const RABBIT_PASS = process.env.RABBIT_PASS || 'user';
    const RABBIT_HOST = process.env.RABBIT_HOST || 'localhost';
    const RABBIT_VHOST = process.env.RABBIT_VHOST || 'vhost';
    const RABBIT_PORT = process.env.RABBIT_PORT || 5672;
    const RABBIT_DELETE_X = process.env.RABBIT_DELETE_X || 'DeleteExchange';

    const amqp = require('amqplib')

    amqp.connect(`amqp://${RABBIT_USER}:${RABBIT_PASS}@${RABBIT_HOST}:${RABBIT_PORT}/${RABBIT_VHOST}`)
      .then(async conn => {
        logger.info(`RabbitMQ connection established on port: ${RABBIT_PORT}`);

        await conn.createChannel()
          .then(async channel => {
            // Buffer.from(JSON.stringify(matches)
            await channel.publish(RABBIT_DELETE_X, 'deleteMatch', Buffer.from(id))
            logger.info(`sent to ${RABBIT_DELETE_X}`)
            // client.del("{\"collection\":\"matches\"}")
          })
          .catch(err => {
            logger.error(`error creating channel: ${err}`)
          });
      })
      .catch(err => {
        logger.error(`Error with RabbitMQ connection: ${err}`)
      });
    
      // matches.forEach( m => {
      //   // logger.info(`m: ${m._id}`)

      //   // 2. delete interest from other users account
      //   let otherUserId = m.users.filter(u => u != id);
        
      //   logger.info(`other user id: ${otherUserId}`)
      //   let um = userService.removeMatchesFromUser(otherUserId, m._id)
      //     .then(r => {
      //       // logger.warn(`removed match id: [${m._id}] from user id: [${otherUserId}]`)
      //     })

      //   // 3. delete the match from the list
      //   let dm = compatibilitiesService.deleteMatch(m._id)
      //     .then((response) => {
      //       // logger.warn(`removed ${response._id} from match array`);
      //     })
      //     .catch(e => {
      //       logger.error(`error: ${e}`);
      //     });
      // });

      logger.warn('********************************************')
}


router.delete('/user/deleteUser/:user_id', jsonParser, (req, res) => {

  logger.info(`deleting user ${req.params.user_id}`);
  // loop through all user records and set a remove marker?
  // for now it will just delete the record

  const p = purgeMatchesListFromDeleteUser(req.params.user_id);


  // var query = {_id : req.params.user_id};
  // User.findOneAndRemove(query)
  let u = userService.deleteUser(req.params.user_id)
    .then(r => {
      logger.info(`user [${req.params.user_id}] has been successfully deleted`)

      const client = require('./../service-config/redis');
      //remove the key from the cache so on the next 'getAll' the cache will be updated with the lates
      client.del("{\"collection\":\"users\"}")

      res.status(204).json();
    })
    .catch((err) => {
      res.status(400).json({
        message: err
      });
  });
});



module.exports = router;