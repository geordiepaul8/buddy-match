// logger
const logger = require('./../utils/logger');

const userService = require('./../service/users');

module.exports = async (req, res, next) => {

  let email = req.body.email;

  logger.info(`email: ${email}`)

  next();

  await userService.findOneUserByEmail(email)
  .then( user => {
    logger.info(`Checking email: ${user.length}`)
    if (user && user.length > 0) {
      res.status(401).json({
        message: "Email already registered",
      });
    }

    next();
  })
  .catch(err => {
    res.status(401).json({
      message: "There was an error finding users by email",
    });
  });

}