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
  },
  settings: {
    searchDistance: Number,
    ageFilter: {
      isSet: Boolean,
      max: Number,
      min: Number
    }
  }
  
});

userSchema.plugin(timestamps);

// enforces the email to be a unique value

// userSchema.index({
//   "loginCredentials.email" : 1
// }, {
//   unique: true
// });

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
});

interestSchema.methods.add = function(name, callback){
  this.name = name;
  return this.save(callback);
}

interestSchema.plugin(timestamps);

/*
**  Matches
*/
const matchesSchema_v1 = mongoose.Schema({
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
  },
  locationResultsObject: {
    distance: {
      type: Number
    },
    score: {
      type: Number
    }
  }
})

matchesSchema_v1.plugin(timestamps);


const matchesSchema = mongoose.Schema({
  users: { 
    type: Array,
    required: true
  },
  compatibilityResults: [{
    _id: String,
    name: String,
    target_id: String,
    target_name: String,
    totalCompatibilityScore: Number,
    age: {
      ageMatchScore: Number,
      ageDifference: Number
    },
    interestCategory: {
      interestCategoryMatchScore: Number,
      countOfInterestCategoryMatches: Number
    },
    interest: {
        interestMatchScore: Number,
        countOfInterestMatches: Number,
        interestMatched: Number
    },
    locationResultsObject: {
      distance: {
        type: Number
      },
      score: {
        type: Number
      }
    }
  }]
})

matchesSchema.plugin(timestamps);


/*
**  Models
*/
const interestModel = mongoose.model('Interests', interestSchema);
const userModel     = mongoose.model('User', userSchema);
const matchesModel  = mongoose.model('Matches', matchesSchema);
// const n_matchesModel  = mongoose.model('nMatches', n_matchesSchema);

module.exports = {
  userModel,
  interestModel,
  matchesModel
  // n_matchesModel
}