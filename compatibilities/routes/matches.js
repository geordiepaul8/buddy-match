const router = require('express').Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const mongoose = require('mongoose')
// models
const Interest = require('./../models/all-models').interestModel;
// services
const compatibilitiesService = require('./../service/compatibilities');
const interestService = require('./../service/interests');
const userService = require('./../service/users');
// utils
// const isValidObjectId = require('./../utils/is-valid-object-id');
const interestMatch = require('./../utils/interest-match');
const { validateUserId } = require('./../middleware/is-valid-object-id');
// logger
const logger = require('./../utils/logger');

const checkUserToken = require('./../middleware/check-user-token');


router.get('/matchesForOneUser/:userId', checkUserToken, jsonParser, validateUserId, (req, res) => {
  compatibilitiesService.db_getAllMatchesForSingleUser(req.params.userId)
    .then(results => {
      logger.info(`${results.length} matches successfully returned for ${req.params.userId}.`);
      res.status(200).json({
        message: `${results.length} matches successfully returned for ${req.params.userId}.`,
        matches: results
      });
    })
    .catch(err => {
      logger.error(`error with findOneUser: ${req.params.userId}: ${err}`)
      res.status(400).json({
        message: `error with findOneUser: ${req.params.userId}: ${err}`,
      });
    });

})

router.get('/allMatches', jsonParser, async (req, res) => {
  let am = await compatibilitiesService.db_getAllMatches()
    .cache()
    .then(matches => {
      logger.info(`${matches.length} matches`);
      res.status(200).json({
        message: `${matches.length} matches`,
        matches
      });
    })
    .catch(err => {
      logger.error(`error with /allMatches: ${err}`)
      res.status(400).json({
        message: `error with /allMatches: ${err}`,
      });
    });

});


router.get('/matchAllUsers', jsonParser, async (req, res) => {


  // console.log('matching all users and generating the db ');

  //logger.info(`get /matchAllUsers....`);

  let newUsers;

  let interestsArray;
  await Interest.find({})
    .then((interests) => {
      interestsArray = interests;
    });

  let usersArray;

  userService.findAllUsers()
    .then(users => {
      usersArray = users;
    })

  newUsers = interestMatch(usersArray, interestsArray, [] );
      
  // console.log(newUsers);
      
  // console.log('calling all users!');

  logger.info(`calling all users...`)
  
  res.status(201).json({
    message: 'ok',
    matches: newUsers
  });
})


router.post('/updateMatchObject/user/:userId', jsonParser, validateUserId, async(req, res) => {
  let id = mongoose.Types.ObjectId(req.params.userId);
  let interestsArray = [];
  let indexOfOtherUserId;
  let otherUserId;
  let otherUserProfile;
  let ownUserProfile;
  let updatedMatchModel;

  logger.info(`updating matches for user: ${id}`)

  await interestService.findAllInterests()
    .then((interests) => {
      interestsArray = interests;
    })
    .catch((err) => {
      logger.info(`error getting interests from the db: ${err}`);
      res.status(400).json({
        message: `error getting interests from the db: ${err}`
      });
      return;
    })

  // return all matches for that user and populate into an array
  await compatibilitiesService.db_getAllMatchesWithFilter({users: id})
  .then(userMatches => {
    logger.info(`userMatches length: ${userMatches.length}`)
    // for each match - calculate the new updated interest and update the 

    if(userMatches.length > 0) {
      userMatches.forEach(async userMatch => {
        logger.info(`user array: ${userMatch.users}, index OF own id: ${userMatch.users.indexOf(id)}`)
        
        indexOfOtherUserId = userMatch.users.indexOf(id) == 1 ? 0 : 1;
        otherUserId = userMatch.users[indexOfOtherUserId];

        logger.info(`other user id: ${otherUserId}`)

        await userService.findOneUser(otherUserId)
        .then(async userProfile => {
          otherUserProfile = userProfile;
       
        })
        .catch()
  
        await userService.findOneUser(id)
        .then(async userProfile => {
          ownUserProfile = userProfile;
        })
        .catch((err) => {
          logger.error(`there was a problem finding user: ${id}`)
        })

        updatedMatchModel = compatibilitiesService.generateMatchModel(ownUserProfile, otherUserProfile, interestsArray);
        logger.info(`updated matchModel score: ${updatedMatchModel.compatibilityScore}`)

        userMatch.compatibilityScore = 10;
        await compatibilitiesService.db_updateCompatibility(
            { _id: mongoose.Types.ObjectId(userMatch._id) },       
            { $set: { compatibilityScore: updatedMatchModel.compatibilityScore, compatibilityResultsObject: updatedMatchModel.compatibilityResultsObject } }, 
            { new: true, upsert: true }
            )
        .then(result => {
          logger.info(`updated user: ${id} match profile: ${userMatch._id}`);
        })
        .catch()
      })
    }
  })
  .catch((err) => {
    logger.info(`error getting interests from the db: ${err}`);
    res.status(400).json({
      message: `error getting interests from the db: ${err}`
    });
  });

  res.status(304).json({});
  return;

});


module.exports = router;
