// docker run --name mongodb -p 27017:27017 --rm -it mongo:4.0.5
//  docker exec -it mongodb mongo

const express = require('express')
const mongoose = require('mongoose')
const nunjucks = require('nunjucks')
const path = require('path')
const bodyParser = require('body-parser');
require('dotenv').config();

const logger = require('./utils/logger');

const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());



/*
**  Env Vars
*/
const APP_PORT = process.env.APP_PORT;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_HOST = process.env.MONGO_HOST;
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

/*
**  nunjucks env
*/
app.set('views', path.join(__dirname, 'views'));
nunjucks.configure('views', {
  express: app,
  autoescape: true
});
app.engine( 'html', nunjucks.render ) ;
app.set('view engine', 'njk');


app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
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


const userService = require('./service/users');

let usersArray = [];
let userProfile;

userService.findAllUsers()
  .then((users) => {
    logger.info(`retrieving ${users.length} users`);
    // res.status(200).json({
    //   message: `retrieving ${users.length} users`,
    //   users
    // });
    usersArray = users;

  })
  .catch((err) => {
    logger.error(`error retrieving users: ${err}`);
    // res.status(400).json({error: err});
  })

logger.info(`length of users returned: ${usersArray.length}`)

// set the verbose flag to display the matches
let populateString = 'interests matches';


const loggedInUser = {};


  userService.searchUsers({ 'loginCredentials.isLoggedIn': true })
  .then(async (users) => {
    logger.info(`found ${users.length} logged in, piceking the first`)


    if(users.length === 1) {
      loggedInUser = users
    }

  })
  .catch(err => {
    logger.error(`error searching for logged in users: ${err}`)
  });


  // userService.findOneUser(userId)
  // .populate(populateString)
  // .exec(async (err, userProfile) => {
  //   if(err) {
  //     logger.error(`there was an error with finding the user: ${userId}, please try again: ${err}`)
  //     res.status(400).json({
  //       message: `there was an error with finding the user: ${userId}, please try again`,
  //       error: `${err}`
  //     });
  //   }
  //   // if there is no profile for the userId, it will return <null>
  //   // to handle the response, the API will send a 400 response
  //   if(userProfile == null) {
  //     logger.info(`there is no profile for user: ${userId}`)
  //     // res.status(404).json({
  //     //   message: `there is no profile for user: ${userId}`,
  //     //   response: {}
  //     // });
  //     return;
  //   }

  //   return await userProfile;
  // });





app.get('/', function (req, res) {
  // TODO: refactor with promise returns?

  userService.findAllUsers()
  .then((users) => {
    logger.info(`retrieving ${users.length} users`);
    // res.status(200).json({
    //   message: `retrieving ${users.length} users`,
    //   users
    // });
    usersArray = users;

  })
  .catch((err) => {
    logger.error(`error retrieving users: ${err}`);
    // res.status(400).json({error: err});
  })

  logger.info(`getting all users: ${usersArray.length}`);
  // logger.warn(`is the user an admin??`)
  



  //  this will contain all of the interests that are available in the service
  const pageData = {
    interests: [
      { "_id": "5d9b2594a82680443d2a55e3",
        "name": "watching football",
        "category": "sport",
        "updatedAt": "2019-10-07T11:46:28.659Z",
        "createdAt": "2019-10-07T11:46:28.659Z",
        "__v": 0
      }
    ],
    users: usersArray
  };

  




  logger.info(`parsing index page`)
    res.render('index.njk', { userProfile, pageData, loggedInUser })


  // end get user

});

 
app.get('/health', function (req, res) {
  logger.info(`sending hello world`)
  res.status(200).json({
    status: 'UP'
  });
});


logger.info(`Server running on port: ${APP_PORT}`);
app.listen(APP_PORT)
