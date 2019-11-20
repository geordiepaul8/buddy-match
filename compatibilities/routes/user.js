const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
// models
const User = require('./../models/all-models').userModel;
// service
const userService = require('./../service/users');
const compatibilitiesService = require('./../service/compatibilities');
const interestService = require('./../service/interests');
// utils
const updateUserMatchesProfile = require('./../utils/update-user-matches-profile');
// middleware
const { validateUserId, validateInterestId, validateMatchId, validateUserBody } = require('./../middleware/is-valid-object-id');
const isEmailRegistered = require('./../middleware/is-email-registered');
const checkUserToken = require('./../middleware/check-user-token');
// logger
const logger = require('./../utils/logger');





// function updateMatchesForUser(userId) {

router.get('/prune-matches-list/:userId', jsonParser,  async (req, res, next) => {

  logger.warn(`*******  PRUNING MATCHES FOR: ${req.params.userId} ********`)

  let users;
  const u = await userService.findAllUsers()
    // .cache()
    .then(results => {
      users = results;
    })
    .catch(err => {
      logger.error(`error with find all users: ${err}`)
    })
  
  logger.info(`users length:   ${users.length}`);

  let matches;
  await compatibilitiesService.db_getAllMatchesForSingleUser(req.params.userId)
    .then(results => {
      matches = results;
    })
    .catch(err => {
      logger.error(`error with find matches for user: [${req.params.userId}] : ${err}`)
    })

  logger.info(`matches length: ${matches.length}`);

  // const user = users.filter(u =>
  //   u._id == req.params.userId
  // )[0];


  // let matchesForUser = matches.splice(0).filter(m => {
  //   m.users.includes(req.params.userId)
  // });

  // logger.info(`matchesForUser length: ${matchesForUser.length}`)
  // logger.info(`matches length: ${matches.length}`)


  /*
  **  loop through the user matches and remove: 
  **    - all 0 scores
  **    - any user id that does not exist anymore
  **    - update compatibilty scores for the users
  */

    // 1. check that the users exist when looping through matches array

    let nonExistantUserArray = [];

    matches.forEach(m => {
      let deletedUserId;

      // m.users[0]._id === req.params._id ? deletedUserId = m.users[1]._id : deletedUserId = m.users[0]._id;

      logger.info(`*************** match id: ${m._id} **************************`)
        logger.info(`users     : ${m.users}`)
      
      let otherUserInMatch;
      if (m.users.includes(req.params.userId)) {
        
        otherUserInMatch = m.users.filter(u => u != req.params.userId)
        logger.info(`other user: ${otherUserInMatch}`)
      }



      // does other user exist in the userList
      let _usersArray = users.filter(u => String(u._id) == String(otherUserInMatch))

      logger.info(`_usersArray: ${_usersArray.length}`)
      logger.info(`users      : ${users.length}`)

      if(_usersArray.length === 0) {
        nonExistantUserArray.push(m._id)
      }

      logger.info(`************end match id: ${m._id} **************************`)
      logger.info(` `);

    })


    logger.info(`There are ${nonExistantUserArray.length} matches ready for deleting : [non existing users]`)
    // logger.info(` `);

    nonExistantUserArray.forEach( m => {

      // delete from the user db
      userService.removeInterestFromUser(req.params.userId, m)
      .then(res => {
        logger.warn(`deleted match id: [${m}] for user: ${req.params.userId} in user profile`)
        logger.warn(`result: ${res}`)
      });

      // delete from the matches db
      compatibilitiesService.deleteMatch(m)
        .then(result => {
          logger.warn(`deleted match id [${m}] for user: ${req.params.userId} in match collection`)
          // logger.warn(`result: ${result}`)
        })



    })




  let matchesAbove0 = matches
                    .filter(m => m.compatibilityScore > 0);

  // these matches will be deleted

  let matchesEqual0 = matches
                        .filter(m => m.compatibilityScore === 0);

  // deletedMatches.forEach( dm => {

  //   // remove from the user profile
  //   userService.removeMatchesFromUser(dm._id, req.params.userId)
  //     .then(r => {
  //       logger.info(`deleted match id [${dm._id}] for user: ${req.params.userId} in user profile - compatibility score = 0`)
  //     });

  //   // call the delete to db
  //   compatibilitiesService.deleteMatch(dm._id)
  //     .then(r => {
  //       logger.info(`deleted match id [${dm._id}] for user: ${req.params.userId} in match collection`)
  //     })

  //     .catch(err => {
  //       logger.error(`error: ${err}`)
  //     })
  // });



  logger.info(`matchesAbove0:  ${matchesAbove0.length}`)
  logger.info(`matchesEqual0:  ${matchesEqual0.length}`)


  /*
  **  if this is a function that deetes a user 
  **
  */
  
 logger.warn(`*******  END PRUNING MATCHES FOR: ${req.params.userId} ********`)

  res.status(200).json({
    message: 'ok',
    matches_length: matches.length,
    users_length: users.length
  })


});



/*
**  param {userId} ObjectId the uniqie mongoId of the user to be deleted
**  param {matcheslist} object the list of the matches
*/
function removeUserFromMatchesList(userId, matchesList) {}




router.post('/register', jsonParser,  async (req, res, next) => {


  let error = false;

  logger.info('******************************************')
  logger.info(`adding a user with name: ${req.body.name} | ${req.body.loginCredentials.email}`)
  logger.info('******************************************')


  bcrypt.hash(req.body.loginCredentials.password, 10)
  .then(async hash => {
    let newUser = new User({
      name: req.body.name,
      age: req.body.age,
      interests: req.body.interests,
      matches: [],
      location: {
        latitude: req.body.location.latitude,
        longitude: req.body.location.longitude,
        city: req.body.location.city
      },
      loginCredentials: {
        email: req.body.loginCredentials.email,
        password: hash,
      },
      loginMetrics: {
        isLoggedIn: false
      },
      settings: {
        searchDistance: 50, // default to 50nm
        ageFilter: {
          isSet: false,
          min: -1,
          max: -1
        }
      }
    },
    {
      _id: false
    });

//  -=-=-=-=-=-=-=-=-=
    // // TODO: move these within the foreach function below to avoid a cache hit
    // let usersArray;
    // // find all the users in the db
    // const u = await userService.findAllUsers()
    // .then(async(userProfile) => {
    //   usersArray = userProfile;
    //   return usersArray;
    // })
    // logger.info(`found ${usersArray.length} users in the db`)

    // let interestsArray = [];
    // const i = await interestService.findAllInterests()
    // .cache()
    // .then((interests) => {
    //   interestsArray = interests;
    //   return interestsArray;
    // });
    // logger.info(`found ${interestsArray.length} interests in the db`)

//  -=-=-=-=-=-=-=-=-=-=

let uid;


    // 3. create the user profile on the db
    const createUser = await userService.createUser(newUser)
    .then( userProfile => {
      logger.info(`user created:   [${userProfile._id}] - name:     [${userProfile.name}]`);

      uid = userProfile._id;

      // create a new compatibility entry for this user id and others
    
      // let pairsArray = compatibilitiesService.generateMatches([...usersArray]);

      // logger.info(`******************************`)
      // logger.info(`users length         : ${usersArray.length}`);
      // logger.info(`pairsArray length    : ${pairsArray.length}`)
      // logger.info(`******************************`)

      

      // usersArray.forEach(otherUser => {

      //   let otherUserId = otherUser._id;
  
      //   // get compatibility score
      //   let matchModel = compatibilitiesService.generateMatchModel(userProfile, otherUser, interestsArray);
      //   // logger.info(`matchModel: ${matchModel.compatibilityScore}`)
  
      //   compatibilitiesService.db_newUserRegisterCompatibility(matchModel)
      //     .then((newMatchEntry) => {
      //       //logger.info(`result of match save: ${newMatchEntry._id}`)

    
      //       // logger.info(`saving match id: ${newMatchEntry._id} to users: ${newUser._id} | ${otherUserId}`)
    
      //       // save the match id to both users
      //       const um = userService.updateUserMatches(newUser._id, newMatchEntry._id)
      //         .then((result) => {
      //       //    logger.info(`match id: ${newMatchEntry._id} saved to user: ${newUserId}`)
      //         });
            
    
      //       const um2 = userService.updateUserMatches(otherUserId, newMatchEntry._id)
      //         .then((result) => {
      //           //logger.info(`match id: ${newMatchEntry._id} saved to user: ${otherUserId}`)
      //         });
            
      //     })
      //     .catch(error => {
      //       logger.error(`there was an error registering the matches model for the user: ${error}`)
      //     });
      // }); // usersArray.forEach
    }); // createUser


    // store in redis
    const client = require('./../service-config/redis');
    client.del("{\"collection\":\"matches\"}")
    client.del("{\"collection\":\"users\"}")


    // send to register q

    const RABBIT_USER = process.env.RABBIT_USER || 'user';
    const RABBIT_PASS = process.env.RABBIT_PASS || 'user';
    const RABBIT_HOST = process.env.RABBIT_HOST || 'localhost';
    const RABBIT_VHOST = process.env.RABBIT_VHOST || 'vhost';
    const RABBIT_PORT = process.env.RABBIT_PORT || 5672;
    const RABBIT_REGISTER_X = process.env.RABBIT_REGISTER_X || 'RegisterExchange';



    const amqp = require('amqplib')

    amqp.connect(`amqp://${RABBIT_USER}:${RABBIT_PASS}@${RABBIT_HOST}:${RABBIT_PORT}/${RABBIT_VHOST}`)
      .then(async conn => {
        logger.info(`RabbitMQ connection established on port: ${RABBIT_PORT}`);

        await conn.createChannel()
          .then(async channel => {

            // logger.info(`${RABBIT_LOGIN_X} exchange is bound to ${RABBIT_LOGIN_Q} queue and is ready to publish`)

            await channel.publish(RABBIT_REGISTER_X, 'registerMatchToUser', Buffer.from(JSON.stringify(uid)))
            logger.info(`sent to ${RABBIT_REGISTER_X}`)
              
          })
          .catch(err => {
            logger.error(`error creating channel: ${err}`)
          })
      })
      .catch(err => {
        logger.error(`Error with RabbitMQ connection: ${err}`)
      });


    res.status(200).json({
      message: 'Registration successfull',
    });

    return;
  })
  .catch(error => {
    logger.error(`error: ${error}`)
    res.status(401).json({
      error,
      message: `error with registration`
    });
    return;
  })
});

/*
* @description - logs user in and sets a jwt
* @param {username} string - the email
* @param {password} string - the password (not encoded)
* @returns {object}:
*   @param {message} string - the response string
*   @param {user} object - the user profile object
*   @param {token} string - the jwt
*/
router.post('/login', (req, res, next) => {
 
  const userEmail = req.body.username;
  const password = req.body.password;

  let populateString = '';

  userService.findOneUserByEmail(userEmail)
    // .populate(populateString)
    .exec((err, userProfile) => {
      if (err || userProfile == null)  {
        logger.error(`there was an error with finding the user with email: ${userEmail}, please try again.`)
        res.status(401).json({
          message: `there was an error with finding the user with email: ${userEmail}, please try again`,
        });
        return
      }

      bcrypt.compare(password, userProfile.loginCredentials.password,  (err, result) => {
        if(err) {
          logger.error(`err`)
        }

        if(!result) {
          logger.error(`there was an error with finding the user with email: ${userEmail}, please try again.`)
          res.status(401).json({
            message: `there was an error with finding the user with email: ${userEmail}, please try again`,
          });
          return
        }

        // TODO: set the isLoggedIn to true
        let token = null;
        if(process.env.SET_AUTH === 'true') {
          // set the token 
          token = jwt.sign(
            {email: userProfile.loginCredentials.email, password: userProfile._id}, 
            process.env.AUTH_KEY, 
            { expiresIn: '1h' }
          );
        }

        logger.info(`token: ${process.env.SET_AUTH}`)
        logger.info(`token: ${token}`)


    // send to register q

    const RABBIT_USER = process.env.RABBIT_USER || 'user';
    const RABBIT_PASS = process.env.RABBIT_PASS || 'user';
    const RABBIT_HOST = process.env.RABBIT_HOST || 'localhost';
    const RABBIT_VHOST = process.env.RABBIT_VHOST || 'vhost';
    const RABBIT_PORT = process.env.RABBIT_PORT || 5672;
    const RABBIT_LOGIN_X = process.env.RABBIT_LOGIN_X || 'LoginExchange';
    const RABBIT_LOGIN_Q = process.env.RABBIT_LOGIN_Q || 'LoginQueue';
    const RABBIT_REGISTER_X = process.env.RABBIT_REGISTER_X || 'RegisterExchange';
    const RABBIT_REGISTER_Q = process.env.RABBIT_REGISTER_Q || 'RegisterQueue';

    const amqp = require('amqplib')


    amqp.connect(`amqp://${RABBIT_USER}:${RABBIT_PASS}@${RABBIT_HOST}:${RABBIT_PORT}/${RABBIT_VHOST}`)
      .then(async conn => {
        logger.info(`RabbitMQ connection established on port: ${RABBIT_PORT}`);

        await conn.createChannel()
          .then(async channel => {

            // logger.info(`${RABBIT_LOGIN_X} exchange is bound to ${RABBIT_LOGIN_Q} queue and is ready to publish`)

            await channel.publish(RABBIT_LOGIN_X, '', Buffer.from(JSON.stringify(userProfile._id)))
            logger.info(`sent to ${RABBIT_LOGIN_X}`)
              
          })
          .catch(err => {
            logger.error(`error creating channel: ${err}`)
          })
      })
      .catch(err => {
        logger.error(`Error with RabbitMQ connection: ${err}`)
      });



        logger.info(`successfully retrieved user profile for email: ${userProfile.loginCredentials.email}`)
        res.status(200).json({
          message: `successfully retrieved user profile for email: ${userProfile.loginCredentials.email}`,
          user: userProfile,
          token
        });
        return
      });
    });
});






router.get('/setLogin/:userId/:loggedInStatus', (req, res) => {


  logger.info(`loggedInStatus: ${req.params.loggedInStatus}`)

  // TODO: check the user exists in the db.

  // set the isLoggedin to true or false

  let logged = false;

  if( req.params.loggedInStatus == 'true') {
    logged = true;
  }

  userService.loginUser(req.params.userId, logged)
  .then(result => {
    if (!logged) {
      logger.info(`logging in user: ${req.params.userId}`);
    } else {
      logger.info(`logging out user: ${req.params.userId}`);
    }
    
    res.status(200).json({
      message: 'ok',
      loggedInStatus: !logged
    })
  })
  .catch(err => {
    logger.error(`error with login / logout function for user: ${req.params.userId}`)
    res.status(404).json({
      message: 'not ok',
      loggedInStatus: logged
    })
  })




});


/* requires authentication */
// 
router.get('/getUser/:userId',  checkUserToken, jsonParser, validateUserId, async (req, res) => {
  logger.info(`calling get user: ${req.params.userId}`)
  let interestsQuery = false;
  let matchesQuery = false;
  let populateString = '';


  if(req.query != null) {
    req.query.interests != null ? interestsQuery = req.query.interests : interestsQuery = false;
    req.query.matches != null ? matchesQuery = req.query.matches : matchesQuery = false;
    populateString = `${interestsQuery == 'true' ? 'interests' : ''} ${matchesQuery == 'true' ? 'matches' : ''}`;
  }
  // logger.warn(`populate string: ${populateString}`)
  // this will populate the details from the interests category 
  // into the category array by referening the _id
  const user = await userService.findOneUser(req.params.userId)


    .populate(populateString)
    .then((userProfile) => {
      if(userProfile === null) {
        logger.error(`there was an error with finding the user: ${req.params.userId}, please try again: ${err}`)
        res.status(400).json({
          message: `there was an error with finding the user, please try again`,
          error: `${err}`
        });
      }

      client.set(req.params.userId, JSON.stringify(userProfile), (err, response) => {
        logger.info(`user saved to cache: ${response}`)
      })

      logger.info(`successfully retrieved user profile for ${req.params.userId}`)
      res.status(200).json({
        message: `successfully retrieved user profile for ${req.params.userId}`,
        user: userProfile
      });
    })
    .catch(err => {
      logger.error(`there was an error with finding the user: ${req.params.userId}, please try again: ${err}`)
      res.status(400).json({
        message: `there was an error with finding the user, please try again`,
        error: `${err}`
      });
    });


});



router.post('/addInterest/:userId/:interestId', jsonParser, validateUserId, validateInterestId, (req, res) => {
  userService.doesUserHaveInterest(req.params.userId, req.params.interestId)
  .then(result => {
    logger.info(`# of interests that match the new one to add: ${result.length}`);
    // if the record length > 0 return a 304 status - not Modified
    // if the record length = 0 then update the interest
    if(result.length > 0) {
      // TODO: 304 response does not send a message in the body
      logger.info(`user ${req.params.userId} already has ${req.params.interestId} on their profile - not added`);
      res.status(304).json({});
    } else {
      userService.updateUserInterest(req.params.userId, req.params.interestId)
      .exec((error, updatedInterestResult) => {
        if(error) {
          logger.error(`error adding interest ${req.params.interestId} to user ${req.params.userId}: ${error}`);
          res.status(400).json({
            message: `error adding interest ${req.params.interestId} to user ${req.params.userId}`,
            error: error
          })
          return;
        }

        // update the matches array
        if( updateUserMatchesProfile(req.params.userId) ) {
          logger.info(`user profile matches updated`)
        } else {
          logger.warn(`there was a problem updating the user matches`)
        }

        logger.info(`interest ${req.params.interestId} added to user ${req.params.userId}`);
        res.status(201).json({
          message: `interest ${req.params.interestId} added to user ${req.params.userId}`,
          user: updatedInterestResult
        });
      })
    }
  })
  .catch(error => {
    logger.error(`error finding user ${req.params.userId} with interest ${req.params.interestId}: ${error}`);
    res.status(400).json({
      message: `error finding user ${req.params.userId} with interest ${req.params.interestId}: ${error}`,
      error: error
    });
  })
})

/*
**  delete the interest from the user account
**  TODO: update the user matches information
*/
router.patch('/deleteInterest/:userId/:interestId', jsonParser, validateUserId, validateInterestId, (req, res) => {
  userService.removeInterestFromUser(req.params.userId, req.params.interestId)
    .then(r => {
      logger.info(`interest ${req.params.interestId} removed from user ${req.params.userId}`);
      // 204?
      res.status(200).json({
        message: `Interest removed successfully`
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: err
      });
    });
});

/*
**  Do Not Use: delete a match from the user account
*/
router.patch('/deleteMatch/:userId/:matchId', jsonParser, validateUserId, validateMatchId, async (req, res) => {
  let match = true;
  // find the entry in the db
  // await compatibilitiesService.db_getMatchById(req.params.matchId)
  // .then((result) => {
  //   if(result == undefined || result == null || result == '') {
  //     logger.warn(`no data in the match database for the id: ${req.params.matchId}`);
  //     res.status(404).json({
  //       message: `no data in the match database for the id: ${req.params.matchId}`
  //     });
  //     match = false;
  //     return;
  //   }else {
  //     logger.info(`we have one match: ${req.params.matchId}`)
  //     logger.info(`res: ${result.count}`)
  //   }
  // })
  // .catch((err) => {
  //   logger.error(`there was an error finding the entry: ${req.params.matchId}`);
  //   res.status(404).json({
  //     message: `there was an error finding the entry: ${req.params.matchId}: ${err}`
  //   });
  //   return;
  // })

  // if(!match) {
  //   return;
  // }
  // delete the interest from the matches db

  await compatibilitiesService.deleteMatch(req.params.matchId)
  .then((result) => {
    logger.info(`match ${req.params.matchId} removed from the matches db`)
  })


  // TODO: remove the interest from the other users db
  // logger.info(`match: ${match}`)

  // remove the interest id from the user matches array

  await userService.removeMatchesFromUser(req.params.userId, req.params.matchId)
    .then(r => {
      logger.info(`match ${req.params.matchId} removed from user ${req.params.userId}`);
      res.status(204).json({});
    })
    .catch((error) => {
      logger.error(`there was an error deleting the entry: ${req.params.matchId} from the match db: ${error}`);
      res.status(404).json({
        message: `there was an error deleting the entry: ${req.params.matchId} from the match db: ${error}`,
        error
      });
      return;
    })
})

module.exports = router;