const getCountOfInterestMatches = require('./get-count-of-interest-matches');

module.exports = (currentUserInterestArray, otherUserInterestArray) => {
    if(!Array.isArray(currentUserInterestArray) || !Array.isArray(otherUserInterestArray)) {
      throw new TypeError('Invalid Parameter Type')
    }

    // filter the interests copied array down to categories only
    let userCategoriesArray = [];
    let otherUserCategoriesArray = [];

    // logger.info(`currentUserInterestArray: ${currentUserInterestArray}`)
    // logger.info(`interests: ${interests}`)

    currentUserInterestArray.forEach((userInterest) => {
      // var obj = findObjectByKey(interests, '_id', userInterest);
      // logger.info(`obj: ${obj}`)
      let categoryForCurrentUser = userInterest.category;
      userCategoriesArray.push(categoryForCurrentUser);
    })  
  
    otherUserInterestArray.forEach((tempUserInterest) => {
      // var obj = findObjectByKey(interests, '_id', tempUserInterest);
      let categoryForCurrentUser = tempUserInterest.category;
      otherUserCategoriesArray.push(categoryForCurrentUser);
    })  
        
    let interestMatchCategoryScore = 0;
  
    // check the lenth of the array - the lowest will go first
    if(userCategoriesArray.length < otherUserCategoriesArray.length) {
      interestMatchCategoryScore = getCountOfInterestMatches(otherUserCategoriesArray, userCategoriesArray);
    } else {
      interestMatchCategoryScore = getCountOfInterestMatches(userCategoriesArray, otherUserCategoriesArray);
    }
  
    return interestMatchCategoryScore;
}