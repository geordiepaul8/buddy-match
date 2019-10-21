const isValidObjectId = require('./../utils/is-valid-object-id');
// logger
const logger = require('./../utils/logger');


function validateUserId(req, res, next) {
  if(!isValidObjectId(req.params.userId)) {
    logger.error(`invalid userId query parameter supplied: ${req.params.userId}`);
    res.status(422).json({
      message: `invalid userId query parameter supplied: ${req.params.userId}`,
      error: {}
    });
    return;
  }
  next();
}

function validateInterestId(req, res, next) {
  if(!isValidObjectId(req.params.interestId)) {
    logger.error(`invalid interestId query parameter supplied: ${req.params.interestId}`);
    res.status(422).json({
      message: `invalid interestId query parameter supplied: ${req.params.interestId}`,
      error: {}
    });
    return;
  }
  next();
}

function validateMatchId(req, res, next) {
  if(!isValidObjectId(req.params.matchId)) {
    logger.error(`invalid matchId query parameter supplied: ${req.params.matchId}`);
    res.status(422).json({
      message: `invalid matchId query parameter supplied: ${req.params.matchId}`,
      error: {}
    });
    return;
  }
  next();
}

function validateUserBody(req, res, next) {

  logger.info(`validateUserBody: `)
  logger.info(req.body)

  if(!(req.body.location.longitude || req.body.location.latitude)) {
    logger.error(`invalid location data supplied, latitude: ${req.body.location.latitude}, longitude: ${req.body.location.longitude}`);
    res.status(422).json({ 
      message: `invalid location data supplied, latitude: ${req.body.location.latitude}, longitude: ${req.body.location.longitude}`,
      error: {}
    });
    return;
  } else {
    req.body.location = {
      latitude: req.body.location.latitude,
      longitude: req.body.location.longitude,
      city: 'my-city',
    };
  }

  if(!(req.body.loginCredentials.email || req.body.loginCredentials.password)) {
    logger.error(`invalid login credentials data supplied, email: ${req.body.loginCredentials.email}, password: ${req.body.loginCredentials.password}`);
    res.status(422).json({ 
      message: `invalid login credentials data supplied, email: ${req.body.loginCredentials.email}, password: ${req.body.loginCredentials.password}`,
      error: {}
    });
    return;
  } else {
    req.body.loginCredentials = {
      email: req.body.loginCredentials.email,
      password: req.body.loginCredentials.password,
    };
  }


  if(!req.body.name || !req.body.age) {
    logger.error(`invalid body data supplied, name: ${req.body.name}, age: ${req.body.age}`);
    res.status(422).json({ 
      message: `invalid body data supplied, name: ${req.body.name}, age: ${req.body.age}`,
      error: {}
    });
    return;
  }

  logger.info('--------')
  logger.info(req.body)
  next();
}

function validateInterestBody(req, res, next) {
  if(!req.body.name || !req.body.category) {
    logger.error(`invalid body data supplied, name: ${req.body.name}, category: ${req.body.age}`);
    res.status(422).json({ 
      message: `invalid body data supplied, name: ${req.body.name}, age: ${req.body.category}`,
      error: {}
    });
    return;
  }
  next();
}

module.exports = {
  validateUserId,
  validateInterestId,
  validateMatchId,
  validateUserBody,
  validateInterestBody
}