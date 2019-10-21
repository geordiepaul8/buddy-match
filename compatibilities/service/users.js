const User = require('./../models/all-models').userModel;

module.exports = {
/*
**  find all users in the collection 'users'
*/
  findAllUsers: function findAllUsers() {
    return User.find({})
  },

/*
**  ${userId} = ObjectId()
*/
  findOneUser: function findOneUser(userId) {
    return User.findOne({ _id: userId });
  },

/*
**  ${searchQuery} example: { _id: "1234"  } or 
**                        : { name: "dave" }
*/
  searchUsers: async function searchUsers(searchQuery) {
    return await User.find(searchQuery)
  },

/*
*   Login a user
*/

  loginUser: function loginUser(userId) {
    const query = {_id : userId};
    const update = { $set: { 'logincredentials.isLoggedIn' : true } };
    const options = {new: true, upsert: true};
    return User.findOneAndUpdate(query, update, options);
  },

/*
**  ${query}      example : { _id: "1234"  }
**  ${payload}    exmaple : { $set : { matches: [1, 2] } }                    - overwrite the array
**                    or  : { $set : { matches: [1, 2], name: "Paul" } }      - overwrite the array and name fields
**                    or  : { $push: { interests: req.params.interest_id } }  - push into array
**  ${options}    example : { new : true, upsert: true }
*/
  updateUserInterest: function updateUserInterest(userId, interestId) {
    const query = {_id : userId};
    const update = { $push: { interests : interestId } };
    const options = {new: true, upsert: true};
    // return await User.updateOne(query, update, options);
    return User.findOneAndUpdate(query, update, options);
  },

  updateUserMatches: function updateUserMatches(userId, matchesId) {
    const query = {_id : userId};
    const update = { $push: { matches : matchesId } };
    const options = {new: true, upsert: true};
    // return await User.updateOne(query, update, options);
    return User.findOneAndUpdate(query, update, options);
  },

/*
**  ${user} = User model
*/
  createUser: async function createUser(user) {
    return await user.save();
  },

/*
**  ${userId} = ObjectId()
*/
  deleteUser: async function deleteUser(userId) {
    return await User.findOneAndRemove({ _id: userId });
  },

/*
**  ${userId}     = ObjectId()
**  ${interesId}  = ObjectId()
*/
  removeInterestFromUser: async function removeInterestFromUser(userId, interestId) {
    const query = {_id : userId};
    const update = { $pull: { interests : interestId } };
    const options = {new: true};
    return await User.findOneAndUpdate(query, update, options);
  },

  removeMatchesFromUser: async function removeMatchesFromUser(userId, matchesId) {
    const query = {_id : userId};
    const update = { $pull: { matches : matchesId } };
    const options = {new: true};
    return await User.findOneAndUpdate(query, update, options);
  },

  searchUserQuery: async function searchUserQuery(query, update, options) {
    return await User.findOne(query, update, options);
  },

  doesUserHaveInterest: async function doesUserHaveInterest(userId, interestId) {
    return await User.find({
      _id: userId,
      interests: { $in: interestId }
    });
  }
    
}