// docker run --name mongodb -p 27017:27017 --rm -it mongo:4.0.5
//  docker exec -it mongodb mongo

const express = require('express')
const app = express()
const mongoose = require('mongoose')




const port = 3000;

const logger = require('./utils/logger');





const MONGO_PORT = 27017;
const MONGO_HOST = '127.0.0.1';
const MONGO_DB = 'MyDb';

/*
**  mongoDb connection details
*/

mongoose.set('useCreateIndex', true)

mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);

logger.info(`mongoDb running on ${MONGO_HOST}, port: ${MONGO_PORT}, using db: ${MONGO_DB}`)


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
  res.send('Hello World')
})

logger.info(`Server running on port: ${port}`);
app.listen(port)