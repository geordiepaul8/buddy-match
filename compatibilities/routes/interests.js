const router = require('express').Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
// model
const Interest = require('./../models/all-models').interestModel;
// service
const interestService = require('./../service/interests');
// middleware
const { validateInterestBody } = require('./../middleware/is-valid-object-id');
// logger
const logger = require('./../utils/logger');





router.post('/addInterest', jsonParser, validateInterestBody, (req, res) => {
  logger.info(`adding an interest with name: ${req.body.name}`)

  let interest = new Interest({
    name: req.body.name,
    category: req.body.category
  });

  interestService.createInterest(interest)
  .then( result => {
    logger.info(`interest created: ${result._id}`);
    res.status(201).json({
      message: 'interest created',
      data: result,
    });
  })
  .catch( err => {
    logger.error(`error creating interest: ${err}`);
    res.status(400).json({ 
      message: `error creating interest: ${err}`,
    });
  });
});

module.exports = router;