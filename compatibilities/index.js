// docker run --name mongodb -p 27017:27017 --rm -it mongo:4.0.5
//  docker exec -it mongodb mongo

const express = require('express')
const app = express();

const logger = require('./utils/logger');
/* injest config details */
const cfg = require('./lib/env-vars.js');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

/*
**  Server connection details
*/
logger.info(`Applying JWT Authorization: ${cfg.SET_AUTH}`)

/*
**  MongoDb / mongoose connection details
*/
require('./service-config/mongo.js').connect;

/*
**  Redis connection
*/
const client = require('./service-config/redis');
require('./service/cache')(client);

/*
**  RabbitMQ 
*/
require('./service-config/rabbitmq.js').createClient();

// const ch = require('./service-config/rabbitmq.js').createClient();

// ch.then(channel => {
//   // console.log(channel)


// })



/* 
**  Set access control middleware
*/
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
  next();
});

/*
**  Routers
*/
app.use('/v1/admin', require('./routes/admin'));
app.use('/v1/user', require('./routes/user'));
app.use('/v1/users', require('./routes/users'));
app.use('/v1/interests', require('./routes/interests'));
app.use('/v1/matches', require('./routes/matches'));
app.use('/v1/locations', require('./routes/locations'));



/*
*   Helathcheck endpoint
*/
app.get('/health', function (req, res) {
  res.status(200).json({
    status: 'UP'
  });
});


logger.info(`Server running on port: ${cfg.APP_PORT}`);
app.listen(cfg.APP_PORT);
