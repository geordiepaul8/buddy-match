const router = require('express').Router();


module.exports = (channel) = (req, res) => {


  router.get('/q', (req, res) => {

      
      res.send('ok');

  });
  

  return router;
}