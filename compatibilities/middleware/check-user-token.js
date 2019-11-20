const jwt = require('jsonwebtoken');
const logger = require('./../utils/logger');

/*
*   @description Intercepts the request header and checks for a valid jwt
*   @param {req} - headers.authorization contains jwt in bearer
*   @return {next()}
*   @error {}
*/

module.exports = (req, res, next) => {
  try {
    if(process.env.SET_AUTH === 'true') {
      const token = (req.headers.authorization).split(" ")[1];
      jwt.verify(token, process.env.AUTH_KEY);
    }
    next();
  } catch(error) {
    logger.error(`token error: ${error}`)
    res.status(401).json({
      message: "Authorization failed",
      error
    });
  }
};