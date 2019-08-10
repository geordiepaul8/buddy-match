module.exports = (totalCompatibilityScore, ageMatchScore, ageDifference , interestCategoryMatchScore, countOfInterestCategoryMatches, interestMatchScore, countOfInterestMatches) => {

  return {
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

}