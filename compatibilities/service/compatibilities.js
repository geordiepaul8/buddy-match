const mongoose = require('mongoose');
const Match = require('./../models/all-models').matchesModel;

// const nMatch = require('./../models/all-models').n_matchesModel;


const generateUserIdArray = require('./../utils/generate-user-id-array');
const generatePairsUserIdArray = require('./../utils/generate-pairs-user-id-array');
const returnAgeScore = require('./../utils/get-age-score');
const findObjectByKey = require('./../utils/find-object-by-key');
const getCountOfInterestMatches = require('./../utils/get-count-of-interest-matches');
const getCountOfInterestCategoryMatches = require('./../utils/get-count-of-interest-category-matches');
// logger
const logger = require('./../utils/logger');

module.exports = {
  /*
  *   get match by id
  */
 db_getMatchById: async function db_getMatchById(matchId) {
   return await Match.find({_id: mongoose.Types.ObjectId(matchId)})
 },

  /*
  **  get all matches for 1 user
  */
  db_getAllMatchesForSingleUser: async function db_getAllMatchesForSingleUser(userId) {
    return await Match.find({ users: mongoose.Types.ObjectId(userId) });
  },

  /*
  **  get all matches with a filter applied
  **  ${filter} = { _id: ObjectId("1234")}
  **  ${filter} = { users: ObjectId("1234") }
  */
 db_getAllMatchesWithFilter: async function db_getAllMatchesWithFilter(filter) {
  return await Match.find(filter);
  },

  /*
  **  get all matches
  */
  db_getAllMatches: function db_getAllMatches() {
    // return Match.find({});
    return Match.find({});
  },

  /*
  **  update one match entry based on the query & payload
  */
  db_updateCompatibility: async function db_updateCompatibility(query, payload, options) {
    return await Match.findOneAndUpdate(query, payload, options);
  },


  /*
  **  if a new user is added, they will register a key-pair with the other users 
  **  so the db can be updated with the model data later
  */
  db_newUserRegisterCompatibility: async function db_newUserRegisterCompatibility(match) {
    return await match.save();
  },

  deleteMatch: function deleteMatch(matchId) {
    return Match.findOneAndRemove({ _id: matchId });
  },

/*
**  usersArray  = the full db user profiles
*/
  generateMatches: function generateMatches(usersArray) {
    let userId1     = [];
    let userId2     = [];
    let pairsArray  = [];
  
    userId1     = generateUserIdArray(usersArray);
    userId2     = generateUserIdArray(usersArray);

    pairsArray  = generatePairsUserIdArray(userId1, userId2);

    return pairsArray;
  },



  /*
  **  takes ${pairsArray} and returns a Match model
  **  will send to the db in <compatibilities> collection
  **
  **  New rules associated with the generation of the match model
  **  1.  The totalCompatibilityScore will be zero'd if:
  **      a) the distance is outside of 50nm (this will change to user settings)
  **      b) only the age makes up the score - need interests to help the age bias the score
  */

  // TODO: only zero on user settings distance - let them decide who they wat to pair up with
  generateMatchModel: function generateMatchModel(user1, user2, interests) {

    let ageMatchScore = 0;
    let ageDifference = 0;
    let interestMatchScore = 0;
    let countOfInterestMatches = 0;
    let interestCategoryMatchScore = 0;
    let countOfInterestCategoryMatches = 0;
    let totalCompatibilityScore = -1;
    let matchLocationDistance = 0;
    let matchLocationScore = 0;

    let u1Compat;
    let u2Compat;

    logger.info(`/generateMatchModel`);
    logger.info(`user 1 ${user1.name} interests: ${user1.interests.length}`);
    logger.info(`user 2 ${user2.name} interests: ${user2.interests.length}`);

    // caluclate age diff & score
    ageDifference = Math.abs(user1.age - user2.age);
    ageMatchScore = returnAgeScore(ageDifference);


    // build the location object
    const getDistance = require('./../utils/get-distance-between-locations');
    const getDistanceScore = require('./../utils/get-distance-score');

    matchLocationDistance = getDistance(user1.location, user2.location);
    matchLocationScore = getDistanceScore(matchLocationDistance);

    if(user1.interests.length > 0 && user2.interests.length > 0) {
      // if they match on category, but not necessartily interest, they will still have a compatibility score
      // increased
      countOfInterestMatches = getCountOfInterestMatches(user1.interests, user2.interests);          
      interestMatchScore = 10 * countOfInterestMatches;
      let interestMatched = ((countOfInterestMatches / user1.interests.length) * 100).toFixed(2);;

      // now check that their interests match as it will futher enhance their compatibility score
      countOfInterestCategoryMatches = getCountOfInterestCategoryMatches(user1.interests, user2.interests, interests);
      interestCategoryMatchScore = 10 * countOfInterestCategoryMatches;

    // if the user only wants to see 50nm searchees, then zero the compat score if the 
    // distance is greater
    if (matchLocationDistance > user1.settings.searchDistance) {
      logger.info(`total = 0 as the distance is greater than the users search distance`)
      totalCompatibilityScore = 0;
    } else {

      totalCompatibilityScore = parseInt(interestCategoryMatchScore + interestMatchScore + ageMatchScore) + parseInt(interestMatched);
    }


    
    //check the age vs compat
    if(ageMatchScore === totalCompatibilityScore) {
      logger.info(`resetting toital as ageMatchscore score is totalCompat`)
      totalCompatibilityScore = 0;
    }
    

    logger.info(`user1 [${user1.name}] -> user2 [${user2.name}] : ${countOfInterestMatches}: [${interestCategoryMatchScore}] {${interestMatched}%} total = ${totalCompatibilityScore}`);

    // TODO: move outside of whether interests > 0
      u1Compat = {
        _id: user1._id,
        name: user1.name,
        target_id: user2._id,
        target_name: user2.name,
        totalCompatibilityScore,
        age: {
          ageMatchScore,
          ageDifference
        },
        interestCategory: {
          interestCategoryMatchScore,
          countOfInterestCategoryMatches
        },
        interest: {
          interestMatchScore,
          countOfInterestMatches,
          interestMatched
        },
        locationResultsObject: {
          distance: matchLocationDistance,
          score: matchLocationScore
        }
      }


      countOfInterestMatches = getCountOfInterestMatches(user2.interests, user1.interests);          
      interestMatchScore = 10 * countOfInterestMatches; 
      interestMatched = ((countOfInterestMatches / user2.interests.length) * 100).toFixed(2);

      // now check that their interests match as it will futher enhance their compatibility score
      countOfInterestCategoryMatches = getCountOfInterestCategoryMatches(user2.interests, user1.interests, interests);
      interestCategoryMatchScore = 10 * countOfInterestCategoryMatches;

    // TODO: if the user setting has changed from default, check it or zero it
    if (matchLocationDistance > user2.settings.searchDistance) {
      logger.info(`total = 0 as the distance is greater than the users search distance`)
      totalCompatibilityScore = 0;
    } else {
      totalCompatibilityScore = parseInt(interestCategoryMatchScore + interestMatchScore + ageMatchScore) + parseInt(interestMatched);
    }

    


    
    //check the age vs compat
    if(ageMatchScore === totalCompatibilityScore) {
      logger.info(`reseting total as ageMatchscore score is totalCompat`)
      totalCompatibilityScore = 0;
    }

      logger.info(`user2 [${user2.name}] -> user1 [${user1.name}] : ${countOfInterestMatches}: [${interestCategoryMatchScore}] {${interestMatched}%} total = ${totalCompatibilityScore}`);

      u2Compat = {
        _id: user2._id,
        name: user2.name,
        target_id: user1._id, 
        target_name: user1.name,
        totalCompatibilityScore,
        age: {
          ageMatchScore,
          ageDifference
        },
        interestCategory: {
          interestCategoryMatchScore,
          countOfInterestCategoryMatches
        },
        interest: {
          interestMatchScore,
          countOfInterestMatches,
          interestMatched
        },
        locationResultsObject: {
          distance: matchLocationDistance,
          score: matchLocationScore
        }
      }
    } 

    let match = new Match({
      users: [],
      compatibilityResults: [
        u1Compat,
        u2Compat
      ],
    });

    match.users.push(user1._id);
    match.users.push(user2._id);

    return match;
  }
};