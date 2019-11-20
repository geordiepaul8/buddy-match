const Interest = require('./../models/all-models').interestModel;

module.exports = {
/*
**  find all interests in the collection 'interests'
*/
  findAllInterests: function findAllInterests() {
    return Interest.find({})
  },

/*
**  ${interest} = Interest model
*/
  createInterest: async function createInterest(interest) {
    return await interest.save()
  },

/*
**  ${interestId} = ObjectId()
*/
  deleteInterest: async function deleteInterest(interestId) {
    return await Interest.findOneAndRemove({ _id: interestId });
  }
}