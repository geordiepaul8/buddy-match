const mongoose = require('mongoose');
const Match = require('./../models/all-models').matchesModel;


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
  db_getAllMatches: async function db_getAllMatches() {
    return await Match.find({});
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

  deleteMatch: async function deleteMatch(matchId) {
    return await Match.findOneAndRemove({ _id: matchId });
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

  generateCompatibilityResultsObject: function generateCompatibilityResultsObject(user1, user2, interests) {
    let ageMatchScore = 0;
    let ageDifference = 0;
    let interestMatchScore = 0;
    let countOfInterestMatches = 0;
    let interestCategoryMatchScore = 0;
    let countOfInterestCategoryMatches = 0;
    let totalCompatibilityScore = 0;

    // caluclate age diff & score
    ageDifference = Math.abs(user1.age - user2.age);

    // loop through current user interests and match category with temp user
    ageMatchScore = returnAgeScore(ageDifference);

    // get the interest id from the current user and loop through each one
    if(user1.interests.length > 0 && user2.interests.length > 0) {
      // if they match on category, but not becessartily interest, they will still have a compatibility score
      // increased
      countOfInterestMatches = getCountOfInterestMatches(user1.interests, user2.interests);          
      interestMatchScore = 10 * countOfInterestMatches; 

      // now check that their interests match as it will futher enhance their compatibility score
      countOfInterestCategoryMatches = getCountOfInterestCategoryMatches(user1.interests, user2.interests);
      interestCategoryMatchScore = 10 * countOfInterestCategoryMatches;
    } 

    totalCompatibilityScore = interestCategoryMatchScore + interestMatchScore + ageMatchScore;

    let compatibilityResultsObject = {
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
          countOfInterestMatches
      }
    }

    return compatibilityResultsObject;

  },

  /*
  **  takes ${pairsArray} and returns a Match model
  **  will send to the db in <compatibilities> collection
  */
  generateMatchModel: function generateMatchModel(user1, user2, interests) {

    let ageMatchScore = 0;
    let ageDifference = 0;
    let interestMatchScore = 0;
    let countOfInterestMatches = 0;
    let interestCategoryMatchScore = 0;
    let countOfInterestCategoryMatches = 0;
    let totalCompatibilityScore = 0;

    logger.info(`/generateMatchModel`);
    // logger.info(`user 1 interests: ${user1.interests.length}`);
    // logger.info(`user 2 interests: ${user2.interests.length}`);
    
    // caluclate age diff & score
    ageDifference = Math.abs(user1.age - user2.age);

    // loop through current user interests and match category with temp user
    ageMatchScore = returnAgeScore(ageDifference);

    // get the interest id from the current user and loop through each one
    if(user1.interests.length > 0 && user2.interests.length > 0) {
      // if they match on category, but not becessartily interest, they will still have a compatibility score
      // increased
      countOfInterestMatches = getCountOfInterestMatches(user1.interests, user2.interests);          
      interestMatchScore = 10 * countOfInterestMatches; 

      // now check that their interests match as it will futher enhance their compatibility score
      countOfInterestCategoryMatches = getCountOfInterestCategoryMatches(user1.interests, user2.interests, interests);
      interestCategoryMatchScore = 10 * countOfInterestCategoryMatches;
    } 

    totalCompatibilityScore = interestCategoryMatchScore + interestMatchScore + ageMatchScore;

    let match = new Match({
      users: [],
      compatibilityScore: totalCompatibilityScore,
      compatibilityResultsObject: [],
    });

    let compatibilityResultsObject = {
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
          countOfInterestMatches
      }
    } 

    match.users.push(user1._id);
    match.users.push(user2._id);
    match.compatibilityResultsObject.push(compatibilityResultsObject);
     
    return match;
  },

  /*
  **  takes an array of pairs in the format : ["id1234-id5678"] and splits to generate an 
  **  array of match model = ${matchArray}
  */
  generateMatchesArray: function generateMatchesArray(pairsArray, usersArray, interestsArray) {


    // logger.info(`usersArray length: ${usersArray.length}`)
    // logger.info(`interestsArray length: ${interestsArray.length}`)
    // logger.info(`pairsArray length: ${pairsArray.length}`)


    let matchesArray = [];

  pairsArray.forEach(users => {
    // get the user models
    let user = users.split(/-/);
    let userProfile1 = findObjectByKey([...usersArray], '_id', user[0]);
    let userProfile2 = findObjectByKey([...usersArray], '_id', user[1]);
  
    // generate the compatibility object for the 2 profiles
    let match = this.generateMatchModel(userProfile1, userProfile2, interestsArray);

    matchesArray.push(match);
    

    // update the users matches array if the id does not exist



    // if( userProfile2.matches.indexOf(user[0]) === -1 ) { 
      // console.log('2 matches array does not contain this id')
    // }



  });

  return matchesArray


  },


};