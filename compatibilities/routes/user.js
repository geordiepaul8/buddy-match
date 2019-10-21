const router = require('express').Router();
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
// logger
const logger = require('./../utils/logger');



// TODO: add function to add interest to account



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
    logger.info(`logging in user: ${req.params.userId}`);
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



router.get('/getUser/:userId', jsonParser, validateUserId, (req, res) => {

  let interestsQuery = false;
  let matchesQuery = false;
  let populateString = '';


  if(req.query != null) {
    req.query.interests != null ? interestsQuery = req.query.interests : interestsQuery = false;
    req.query.matches != null ? matchesQuery = req.query.matches : matchesQuery = false;
    populateString = `${interestsQuery == 'true' ? 'interests' : ''} ${matchesQuery == 'true' ? 'matches' : ''}`;
  }
  logger.warn(`populate string: ${populateString}`)
  // this will populate the details from the interests category 
  // into the category array by referening the _id
  userService.findOneUser(req.params.userId)
  .populate(populateString)
  .exec((err, userProfile) => {
    if(err) {
      logger.error(`there was an error with finding the user: ${req.params.userId}, please try again: ${err}`)
      res.status(400).json({
        message: `there was an error with finding the user: ${req.params.userId}, please try again`,
        error: `${err}`
      });
    }
    // if there is no profile for the userId, it will return <null>
    // to handle the response, the API will send a 400 response
    if(userProfile == null) {
      logger.info(`there is no profile for user: ${req.params.userId}`)
      res.status(404).json({
        message: `there is no profile for user: ${req.params.userId}`,
        response: {}
      });
      return;
    }
    logger.info(`successfully retrieved user profile for ${req.params.userId}`)
    res.status(200).json({
      message: `successfully retrieved user profile for ${req.params.userId}`,
      user: userProfile
    });
  })
});

// TODO: remove the interest adding to the new user profile
// TODO: when to calculate the match scores
// TODO: find geolocation and add tpo profile - set boundary to ~50nm for matching
router.post('/addUser', jsonParser, validateUserBody, async (req, res) => {

  let interestsArray = [];
  let error = false;

  logger.info(`adding a user with name: ${req.body.name}`)

  // Interest.find({})
  await interestService.findAllInterests()
    .then(async (interests) => {
      logger.info(`retrieving ${interests.length} interests`)
      interestsArray = interests;
    
      return await interestsArray;
    })
    .catch((err) => {
      logger.error(`error getting interests from the db: ${err}`);
      res.status(400).json({
        message: `error getting interests from the db.`,
        error: err
      });
      error = true;
      return;
    })

  if(error) {
    return;
  }

  // construct the new User model
  let newUser = new User({
    name: req.body.name,
    age: req.body.age,
    interests: [], //only adding this for debugging
    matches: [],
    location: {
      latitude: req.body.location.latitude,
      longitude: req.body.location.longitude,
      city: req.body.location.city
    },
    loginCredentials: {
      email: req.body.loginCredentials.email,
      password: req.body.loginCredentials.password,
    },
    loginMetrics: {
      isLoggedIn: false
    }
  },
  {
    _id: false
  });

  // load the usersArray with the list of users prior to the new one
  await userService.findAllUsers()
    // .populate('interests')
    .exec()
    .then(async(userProfile) => {
   
      usersArray = userProfile;
      return await usersArray;
    })
    .catch(err => {
      logger.info(`error getting users from the db: ${err}`);
      res.status(404).json({
        message: `error getting users from the db`,
        error: err
      });
      error = true;
      return;
    });

  if(error) {
    return;
  }

  userService.createUser(newUser)
  .then( userProfile => {
    logger.info(`user created: ${userProfile._id}, name: ${userProfile.name}`);

    // create a new compatibility entry for this user id and others
    
    let pairsArray = compatibilitiesService.generateMatches([...usersArray]);

    logger.info(`******************************`)
    logger.info(`users length         : ${usersArray.length}`);
    logger.info(`pairsArray length    : ${pairsArray.length}`)
    logger.info(`******************************`)

    const newUserId = userProfile._id;
    usersArray.forEach(otherUser => {

      let otherUserId = otherUser._id;

      // get compatibility score
      let matchModel = compatibilitiesService.generateMatchModel(userProfile, otherUser, interestsArray);
      logger.info(`matchModel: ${matchModel.compatibilityScore}`)

      compatibilitiesService.db_newUserRegisterCompatibility(matchModel)
      .then((newMatchEntry) => {
        logger.info(`result of match save: ${newMatchEntry._id}`)

        logger.info(`saving match id: ${newMatchEntry._id} to new user: ${newUserId} and existing user: ${otherUserId}`)

        // save the match id to both users
        userService.updateUserMatches(newUserId, newMatchEntry._id)
          .then((result) => {
            logger.info(`match id: ${newMatchEntry._id} saved to user: ${newUserId}`)
          })
          .catch((error) => {
            logger.error(`there was an error saving the match id to the user profile: ${newUserId}`);
            res.status(404).json({
              message: `there was an error saving the match id to the user profile: ${newUserId}`,
              error
            });
            error = true;
            return;
          });
        
        if(error) {
          return;
        }

        userService.updateUserMatches(otherUserId, newMatchEntry._id)
          .then((result) => {
            logger.info(`match id: ${newMatchEntry._id} saved to user: ${otherUserId}`)
          })
          .catch((error) => {
            logger.error(`there was an error saving the match id to the user profile: ${otherUserId}`)
            res.status(404).json({
              message: `there was an error saving the match id to the user profile: ${otherUserId}`,
              error
            });
            error = true;
            return;
          })
        
        if(error) {
          return;
        }

      })
      .catch((error) => {
        logger.error(`there was an error registering a new match`)
        res.status(404).json({
          message: `there was an error registering a new match`,
          error
        });
        error = true;
        return;
      });
    });

    if(error) {
      return;
    }

    // finally send the response
    res.status(201).json({
      message: `user created: ${userProfile._id}, name: ${userProfile.name}`,
      response: userProfile,
    });
    return;
  })
  .catch( error => {
    logger.error(`error creating user: ${error}`);
    res.status(404).json({
      message: `error creating user: ${error}`,
      error: error
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
      res.status(204).json({});
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
  await compatibilitiesService.db_getMatchById(req.params.matchId)
  .then((result) => {
    if(result == undefined || result == null || result == '') {
      logger.warn(`no data in the match database for the id: ${req.params.matchId}`);
      res.status(404).json({
        message: `no data in the match database for the id: ${req.params.matchId}`
      });
      match = false;
      return;
    }else {
      logger.info(`we have one match: ${req.params.matchId}`)
      logger.info(`res: ${result.count}`)
    }
  })
  .catch((err) => {
    logger.error(`there was an error finding the entry: ${req.params.matchId}`);
    res.status(404).json({
      message: `there was an error finding the entry: ${req.params.matchId}: ${err}`
    });
    return;
  })

  if(!match) {
    return;
  }
  // delete the interest from the matches db

  await compatibilitiesService.deleteMatch(req.params.matchId)
  .then((result) => {
    logger.info(`match ${req.params.matchId} removed from the matches db`)
  })
  .catch((error) => {
    logger.error(`there was an error deleting the entry: ${req.params.matchId} from the match db: ${error}`);
    res.status(404).json({
      message: `there was an error deleting the entry: ${req.params.matchId} from the match db: ${error}`
    });
    return;
  })

  // TODO: remove the interest from the other users db
  // logger.info(`match: ${match}`)

  // remove the interest id from the user matches array

  await userService.removeMatchesFromUser(req.params.userId, req.params.matchId)
    .then(r => {
      logger.info(`match ${req.params.matchId} removed from user ${req.params.userId}`);
      res.status(204).json({});
    })
    .catch((err) => {
      res.status(400).json({
        message: err
      });
    });
})

module.exports = router;