const mongoose = require('mongoose');
const Match = require('./../models/all-models').matchesModel;


const returnAgeScore = require('./get-age-score');
const getCountOfInterestMatches = require('./get-count-of-interest-matches');
const getCountOfInterestCategoryMatches = require('./get-count-of-interest-category-matches');
const pino = require('pino')
const logger = pino({
  prettyPrint: {colorize: true}
});
  

  
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
function generateMatchModel(user1, user2, interests) {

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

    // logger.info(`/generateMatchModel`);




    // logger.info(`user 1 ${user1.name} interests: ${user1.interests.length}`);
    // logger.info(`user 2 ${user2.name} interests: ${user2.interests.length}`);

    // caluclate age diff & score
    ageDifference = Math.abs(user1.age - user2.age);
    ageMatchScore = returnAgeScore(ageDifference);


    // build the location object
    const getDistance = require('./get-distance-between-locations');
    const getDistanceScore = require('./get-distance-score');

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
      // logger.info(`total = 0 as the distance is greater than the users search distance`)
      totalCompatibilityScore = 0;
    } else {

      totalCompatibilityScore = parseInt(interestCategoryMatchScore + interestMatchScore + ageMatchScore) + parseInt(interestMatched);
    }


    
    //check the age vs compat
    if(ageMatchScore === totalCompatibilityScore) {
      // logger.info(`resetting toital as ageMatchscore score is totalCompat`)
      totalCompatibilityScore = 0;
    }
    

    // logger.info(`user1 [${user1.name}] -> user2 [${user2.name}] : ${countOfInterestMatches}: [${interestCategoryMatchScore}] {${interestMatched}%} total = ${totalCompatibilityScore}`);

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
      // logger.info(`total = 0 as the distance is greater than the users search distance`)
      totalCompatibilityScore = 0;
    } else {
      totalCompatibilityScore = parseInt(interestCategoryMatchScore + interestMatchScore + ageMatchScore) + parseInt(interestMatched);
    }

    


    
    //check the age vs compat
    if(ageMatchScore === totalCompatibilityScore) {
      // logger.info(`reseting total as ageMatchscore score is totalCompat`)
      totalCompatibilityScore = 0;
    }

      // logger.info(`user2 [${user2.name}] -> user1 [${user1.name}] : ${countOfInterestMatches}: [${interestCategoryMatchScore}] {${interestMatched}%} total = ${totalCompatibilityScore}`);

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


  module.exports = {
    generateMatchModel
}