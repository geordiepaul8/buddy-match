// check age bracket

// <=5 years + 10
// <= 10 years + 5
// <= 15 years + 2

module.exports = (ageDifference) => {

  if(ageDifference === undefined || ageDifference === null || isNaN(ageDifference)){
    throw new TypeError('ageDifference must be of type number')
  }


  if(ageDifference > 15 || ageDifference < 0) {
    return 0
  } else if(ageDifference > 10 && ageDifference <= 15) {
    return 2
  } else if(ageDifference > 5 && ageDifference <= 10) {
    return 5
  } else {
    return 10;
  }
}