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


// get all interests
router.get('/getAllInterests',  async (req, res) => {
  const fi = await interestService.findAllInterests()
  .cache()
  .then((interest) => {
    logger.info(`retrieving ${interest.length} interests.`)
    res.status(200).json({
      message: `retrieving ${interest.length} interests.`,
      interest
    });
  })
  .catch((err) => {
    logger.error(`error retrieving interests: ${err}`)
    res.status(400).json({error: err});
  })
});

//
router.post('/addInterest', jsonParser, validateInterestBody, (req, res) => {
  const client = require('./../service-config/redis');

  logger.info(`adding an interest with name: ${req.body.name}`)

  let interest = new Interest({
    name: req.body.name,
    category: req.body.category
  });

  let i = interestService.createInterest(interest)
  .then( result => {
    logger.info(`interest created: ${result._id}`);

    //remove the key from the cache so on the next 'getAll' the cache will be updated with the lates
    client.del("{\"collection\":\"interests\"}")

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