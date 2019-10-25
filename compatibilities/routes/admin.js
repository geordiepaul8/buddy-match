const router = require('express').Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

// services
const compatibilitiesService = require('./../service/compatibilities');
const interestService = require('./../service/interests');
const userService = require('./../service/users');

// logger
const logger = require('./../utils/logger');


// get all interests
router.get('/interests/getAllInterests', (req, res) => {
  interestService.findAllInterests()
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

// get all matches
router.get('/user/getAllMatches', jsonParser, (req, res) => {
  compatibilitiesService.db_getAllMatches()
  .then((matches) => {
    logger.info(`retrieving ${matches.length} matches`);
    res.status(200).json({
      message: `retrieving ${matches.length} matches`,
      matches
    });
  })
  .catch((err) => {
    logger.error(`error retrieving matches: ${err}`);
    res.status(400).json({error: err});
  })
})


// get all users
router.get('/user/getAllUsers', jsonParser, (req, res) => {
  userService.findAllUsers()
  .then((users) => {
    logger.info(`retrieving ${users.length} users`);
    res.status(200).json({
      message: `retrieving ${users.length} users`,
      users
    });
  })
  .catch((err) => {
    logger.error(`error retrieving users: ${err}`);
    res.status(400).json({error: err});
  })
})




// if you remove an interest from the catalog then it may 
// impact anyone who has subscribed to it

// TODO: loop through user accounts to remove the deleted interest id
router.delete('/:interest_id', jsonParser, (req, res) => {
  // loop through all user records and set a remove marker?
  // for now it will just delete the record

  interestService.deleteInterest(req.params.interest_id)
    .then(r => {
      res.status(204).json();
    })
    .catch((err) => {
      res.status(400).json({
        message: err
      });
  });
})

router.delete('/user/deleteUser/:user_id', jsonParser, (req, res) => {

  logger.info(`deleting user ${req.params.user_id}`);
  // loop through all user records and set a remove marker?
  // for now it will just delete the record

  var query = {_id : req.params.user_id};

  let tempMatches;
  //remove all matches

  compatibilitiesService.db_getAllMatchesForSingleUser(req.params.user_id)
  .then((response) => {
    tempMatches = response;
    logger.info(`# of matches: ${tempMatches.length}`)

    // before deleting that match for the selected user, ensure the match for the other user has been deleted
    // let { users } = tempMatches.



    tempMatches.forEach(match => {

      let users = match.users.filter(x => x != req.params.user_id);


      userService.removeMatchesFromUser(users[0], match._id)
      .then(response => [
        logger.warn(`user: [${users[0]}] has had match [${match._id}] removed from their profile`)
      ])



      logger.warn(users)

      compatibilitiesService.deleteMatch(match._id)
      .then((response) => {
        logger.warn(`removed ${response._id} from match array`);
      })
    })

  });




  // User.findOneAndRemove(query)
  userService.deleteUser(req.params.user_id)
    .then(r => {
    logger.info(`user [${req.params.user_id}] has been successfully deleted`)

      res.status(204).json();
    })
    .catch((err) => {
      res.status(400).json({
        message: err
      });
  });

})



module.exports = router;