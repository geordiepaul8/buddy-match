// logger
const logger = require('./logger');

module.exports = (users, matchesArray) => {
  let matchFound = false;
  // for(let users of pairsMatchArray) {
    // let users = pair.split(/-/);
    logger.info(`......users: ${users}`)
    for(let match of matchesArray) {
      logger.info(`match.users: ${match.users} | users[0]: ${users[0]} | [index: ${match.users.indexOf(users[0])}]`)
      logger.info(`match.users: ${match.users} | users[1]: ${users[1]} | [index: ${match.users.indexOf(users[1])}]`)
      if( (match.users.indexOf(users[0]) != -1) && (match.users.indexOf(users[1]) != -1) ) {
        matchFound = true;
        break;
      }
    }
    if(matchFound) {
      logger.info(`match found`)
      // break;
    }
  // }
  return matchFound;
}