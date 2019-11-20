const logger = require('./logger');

module.exports = (distance) => {

  logger.info(`distance           : ${distance}`)

  if(distance === undefined || distance === null || isNaN(distance)){
    throw new TypeError('distance must be of type number')
  }

  if (distance > 400) {
    return 0
  } else if(distance > 200) {
    return 2
  } else if (distance > 100 && distance <= 200) {
    return 4
  } else if (distance > 50 && distance <= 100) {
    return 6
  } else if (distance > 10 && distance <= 50) {
    return 8
  } else {
    return 10;
  }
}