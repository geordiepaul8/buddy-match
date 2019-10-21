const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp');


/*
**  Users
*/
//TODO: update the required fields for loginCredentials
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false
  },
  interests: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref:'Interests' 
  }],
  matches: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref:'Matches' 
  }],
  location: {
    latitude: Number,
    longitude: Number,
    city: String
  },
  loginCredentials: {
    email: {
      type: String
    },
    password: String
  },
  loginMetrics: {
    isLoggedIn: {
      type: Boolean
    }
  }
  
});

userSchema.plugin(timestamps);

userSchema.index({
  "loginCredentials.email" : 1
}, {
  unique: true
});

/*
**  Interests
*/
const interestSchema = mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

interestSchema.plugin(timestamps);

/*
**  Matches
*/
const matchesSchema = mongoose.Schema({
  users: { 
      type: Array,
      required: true
  },
  compatibilityScore: {
    type: Number,
    required: true
  },
  compatibilityResultsObject: {
    type: Array,
    required: false
  }
})

matchesSchema.plugin(timestamps);


/*
**  Models
*/
const interestModel = mongoose.model('Interests', interestSchema);
const userModel     = mongoose.model('User', userSchema);
const matchesModel  = mongoose.model('Matches', matchesSchema);

module.exports = {
  
  userModel,
  interestModel,
  matchesModel

}