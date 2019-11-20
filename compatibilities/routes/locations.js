const router = require('express').Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

const locationService = require('./../service/locations');

router.get('/allLocations', jsonParser, (req, res) => {
  res.send(locationService.findAllLocations())
});

module.exports = router;