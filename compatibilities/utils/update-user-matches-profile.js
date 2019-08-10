const mongoose = require('mongoose')
// models
const models = require('./../models/all-models');
const User = models.userModel;
const Interest = models.interestModel;
const Match = models.matchesModel;
// services
const compatibilitiesService = require('./../service/compatibilities');
const interestService = require('./../service/interests');
const userService = require('./../service/users');
// utils
const isValidObjectId = require('./../utils/is-valid-object-id');
const interestMatch = require('./../utils/interest-match');
const areUsersMatchedAlready = require('./../utils/are-users-matched-already');
// logger
const pino = require('pino')
const logger = pino({
  prettyPrint: { colorize: true }
})

//TODO: all catch will return FALSE
module.exports = async (userId) => {


  if(!isValidObjectId(userId)) {
    logger.error(`invalid query parameter supplied: /${userId}`);
    res.status(422).json({
      message: `invalid query parameters supplied: /${userId}`
    });
    return;
  }

  let id = mongoose.Types.ObjectId(userId);

  logger.info(`updating matches for user: ${id}`)

  let interestsArray = [];

  await interestService.findAllInterests()
    .then((interests) => {
      interestsArray = interests;
    })
    .catch((err) => {
      console.log(err)
    })



  // return all matches for that user and populate into an array
  await compatibilitiesService.db_getAllMatchesWithFilter({users: id})
  .then(userMatches => {
    logger.info(`userMatches length: ${userMatches.length}`)
    // for each match - calculate the new updated interest and update the 

    if(userMatches.length > 0) {
      userMatches.forEach(async userMatch => {
        logger.info(`user array: ${userMatch.users}, index OF own id: ${userMatch.users.indexOf(id)}`)
        
        let indexOfOtherUserId = userMatch.users.indexOf(id) == 1 ? 0 : 1;
        let otherUserId = userMatch.users[indexOfOtherUserId];

        logger.info(`other user id: ${otherUserId}`)

        let otherUserProfile;
        await userService.findOneUser(otherUserId)
        .then(async userProfile => {
          otherUserProfile = userProfile;
       
        })
        .catch()

        let ownUserProfile;
        await userService.findOneUser(id)
        .then(async userProfile => {
          ownUserProfile = userProfile;
       
        })
        .catch()

        // logger.info(`other Profile: ${otherUserProfile}`);
        // logger.info(`own Profile: ${ownUserProfile}`);

        let updatedMatchModel = compatibilitiesService.generateMatchModel(ownUserProfile, otherUserProfile, interestsArray);
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
  .catch()

  return true;

}