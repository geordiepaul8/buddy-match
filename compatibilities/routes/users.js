const router = require('express').Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
// service
const userService = require('./../service/users');
// logger
const logger = require('./../utils/logger');

/*
**  GET all users in the collection <users>
*/


module.exports = router;