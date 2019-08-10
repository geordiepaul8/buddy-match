const returnAgeMetric = require('./get-age-score');
const getCountOfInterestMatches = require('./get-count-of-interest-matches');
const getCountOfInterestCategoryMatches = require('./get-count-of-interest-category-matches');
// logger
const logger = require('./logger');


// pairsArray = array of matching userIds

module.exports = (pairsArray) => {

    logger.info('in matches: ' + pairsArray)
    //logger.info(`users in matches: ${pairsUsers}`);

    let matchArray = [];
    let ageMatchScore = 0;
    let ageDifference = 0;
    let interestMatchScore = 0;
    let countOfInterestMatches = 0;
    let interestCategoryMatchScore = 0;
    let countOfInterestCategoryMatches = 0;
    let totalCompatibilityScore = 0;

    // caluclate age diff & score
    ageDifference = Math.abs(currentUser.age - allUsers[i].age);

    // loop through current user interests and match category with temp user
    ageMatchScore = returnAgeMetric(ageDifference);

    // get the interest id from the current user and loop through each one
    if(currentUser.interests.length > 0 && allUsers[i].interests.length > 0) {
        // if they match on category, but not becessartily interest, they will still have a compatibility score
        // increased
        countOfInterestMatches = getCountOfInterestMatches(currentUser.interests, allUsers[i].interests);          
        interestMatchScore = 10 * countOfInterestMatches; 

        // now check that their interests match as it will futher enhance their compatibility score
        countOfInterestCategoryMatches = getCountOfInterestCategoryMatches(currentUser.interests, allUsers[i].interests, interests);
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

    //if the compatibility score == 0 dont add
    if(totalCompatibilityScore > 0) {
        currentUser.matches.push({
            _id: allUsers[i]._id,
            name: allUsers[i].name,
            compatibilityScore: totalCompatibilityScore,
            compatibilityResultsObject,
        })
    }

    let users = [
        { _id: allUsers[i]._id, name: allUsers[i].name },
        { _id: currentUser._id, name: currentUser.name} 
    ];

    matchArray.push({
        users,
        compatibilityScore: totalCompatibilityScore,
        compatibilityResultsObject,
    });






    return matchArray;
}