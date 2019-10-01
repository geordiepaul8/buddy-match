// docker run --name mongodb -p 27017:27017 --rm -it mongo:4.0.5
//  docker exec -it mongodb mongo

const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config();

const logger = require('./utils/logger');



const APP_PORT = process.env.APPLICATION_PORT || 3000;

const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_HOST = 'mongo'; //process.env.MONGO_HOST
const MONGO_DB = process.env.MONGO_DB;

/*
**  mongoDb connection details
*/
mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`, { 
  useUnifiedTopology: true, 
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then( () => {
  logger.info(`mongoDb running on ${MONGO_HOST}, port: ${MONGO_PORT}, using db: ${MONGO_DB}`)
})
.catch( (err) => {
  logger.error(`error connecting to db: ${err}`);
  throw new Error(`error connecting to mongoDb running on ${MONGO_HOST}, port: ${MONGO_PORT}, using db: ${MONGO_DB}`)
})


app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});


/*
**  Routers
*/
const adminRoutes = require('./routes/admin');
var userRoutes = require('./routes/user');
var usersRoutes = require('./routes/users');
var interestRoutes = require('./routes/interests');
var matchesRoutes = require('./routes/matches');
app.use('/v1/admin', adminRoutes);
app.use('/v1/user', userRoutes);
app.use('/v1/users', usersRoutes);
app.use('/v1/interests', interestRoutes);
app.use('/v1/matches', matchesRoutes);


 
app.get('/', function (req, res) {
  logger.info(`sending hello world`)
  res.send('Hello World')
  
})

logger.info(`Server running on port: ${APP_PORT}`);
app.listen(APP_PORT)