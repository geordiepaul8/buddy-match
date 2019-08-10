// logger
const logger = require('./logger');

module.exports = (userArray) => {

  // validate non array ]

  // logger.info(`gereateuserIdArray - useraRRAY: ${userArray}`)

  let userIdArray = [];

  userArray.forEach(user => {
    userIdArray.push(user._id);
  })
  return userIdArray;

}