const mocha = require('mocha');
const { expect, should } = require('chai');

const Match = require('../../models/all-models').matchesModel;

// services
const compatibilitiesService = require('../../service/compatibilities');
// utils
const areUsersMatchedAlready = require('./../../utils/are-users-matched-already');

let newMatch1 = new Match(
  {
    "users": [
        "5d2c8e0fabb8913bd8ecb267",
        "5d2c8e13abb8913bd8ecb268"
    ],
    "compatibilityResultsObject": [
      {
        "totalCompatibilityScore": 30,
        "age": {
          "ageMatchScore": 10,
          "ageDifference": 0
        },
        "interestCategory": {
          "interestCategoryMatchScore": 10,
          "countOfInterestCategoryMatches": 1
        },
        "interest": {
          "interestMatchScore": 10,
          "countOfInterestMatches": 1
        }
      }
    ],
    "_id": "5d2db290188fce56cd01f379",
    "compatibilityScore": 30,
    "updatedAt": "2019-07-16T11:18:40.970Z",
    "createdAt": "2019-07-16T11:18:40.970Z",
    "__v": 0
  }
);

let newMatch2 = new Match(
  {
    "users": [
        "5d2c8e0fabb8913bd8ecb298",
        "5d2c8e13abb8913bd8ecb299"
    ],
    "compatibilityResultsObject": [
      {
        "totalCompatibilityScore": 30,
        "age": {
          "ageMatchScore": 10,
          "ageDifference": 0
        },
        "interestCategory": {
          "interestCategoryMatchScore": 10,
          "countOfInterestCategoryMatches": 1
        },
        "interest": {
          "interestMatchScore": 10,
          "countOfInterestMatches": 1
        }
      }
    ],
    "_id": "5d2db290188fce56cd01f399",
    "compatibilityScore": 30,
    "updatedAt": "2019-07-16T11:18:40.970Z",
    "createdAt": "2019-07-16T11:18:40.970Z",
    "__v": 0
  }
);

let matchesArray = [];
matchesArray.push(newMatch1, newMatch2);

// console.log(matchesArray)

const usersArray = [
  {
      "interests": [
          "5d287bd246143b8627543e01"
      ],
      "matches": [
          "5d2c8e30abb8913bd8ecb26a",
          "5d2c8e30abb8913bd8ecb26b"
        ],
      "_id": "5d2c8e0fabb8913bd8ecb267",
      "name": "paul costigan",
      "age": 39,
      "updatedAt": "2019-07-16T12:03:41.536Z",
      "createdAt": "2019-07-15T14:30:39.104Z",
      "__v": 0
  },
  {
      "interests": [
          "5d287bd246143b8627543e01"
      ],
      "matches": [
          "5d2c8e30abb8913bd8ecb26a",
          "5d2c8e30abb8913bd8ecb26c"
      ],
      "_id": "5d2c8e13abb8913bd8ecb268",
      "name": "sara costigan",
      "age": 39,
      "updatedAt": "2019-07-16T12:03:41.538Z",
      "createdAt": "2019-07-15T14:30:43.473Z",
      "__v": 0
  },
  {
      "interests": [
          "5d287bd246143b8627543e01"
      ],
      "matches": [
        "5d2c8e30abb8913bd8ecb26b",
        "5d2c8e30abb8913bd8ecb26c"
      ],
      "_id": "5d2c8e1cabb8913bd8ecb269",
      "name": "peter costigan",
      "age": 65,
      "updatedAt": "2019-07-16T12:03:41.538Z",
      "createdAt": "2019-07-15T14:30:52.946Z",
      "__v": 0
  }
]


describe('testing find user in array of objects', () => {

  it('should find a user at index 0', () => {
    let uid = "5d2c8e0fabb8913bd8ecb267";
    
    let index = usersArray.findIndex(x => x._id == uid);
    expect(index).to.equal(0)
  })

  it('should find a user at index 2', () => {
    let uid = "5d2c8e1cabb8913bd8ecb269";
    
    let index = usersArray.findIndex(x => x._id == uid);
    expect(index).to.equal(2)
  })

  it('should not find a user: index -1', () => {
    let uid = "5d2c8e0fabb8913bd8ec9999";
    
    let index = usersArray.findIndex(x => x._id == uid);
    expect(index).to.equal(-1)

  })


})


describe.skip('testing with a single pairs array', () => {

  const pairsMatchArray = ["5d2c8e0fabb8913bd8ecb267-5d2c8e13abb8913bd8ecb268"]
  const pairsMatchArray_id1 = "5d2c8e0fabb8913bd8ecb267"
  const pairsMatchArray_id2 = "5d2c8e13abb8913bd8ecb268"
  // this is the array when the paisrMatchArray has been split
  const pairsArray = ["5d2c8e0fabb8913bd8ecb267", "5d2c8e0fabb8913bd8ecb268"]

  it('should split the pairs array and equal an array of 2 object id\'s', () => {
    let userIdArray = pairsMatchArray[0].split(/-/);
    expect(userIdArray).to.have.lengthOf(2);
    expect(userIdArray[0]).to.equal(pairsMatchArray_id1);
    expect(userIdArray[1]).to.equal(pairsMatchArray_id2);
  })

  it('should match return the object id\'s for the newMatch1 user id\'s', () => {
    expect(newMatch1.users[0]).to.equal(pairsMatchArray_id1);
    expect(newMatch1.users[1]).to.equal(pairsMatchArray_id2);
  })

  it('should test the array of matches and check for the pairsMatchArray user id\'s', () => {
    expect(matchesArray[0].users[0]).to.equal(pairsMatchArray_id1);
    expect(matchesArray[0].users[1]).to.equal(pairsMatchArray_id2);
  })

  it('should check that the pairs id are contained within the matches[].users array', () =>{
    // console.log(matchesArray[0].users.indexOf(pairsArray[0]));
    let matchFound = false;
    let index = -1;
    matchesArray.forEach(match => {
      if( match.users.indexOf(pairsArray[0]) == 0) {
        index = match.users.indexOf(pairsArray[0]);
        matchFound = true;
        return;
      }
    })
    expect(matchFound).to.equal(true)
    expect(index).to.not.equal(-1)
  })
})


describe('testing with a multiple pairs array', () => {

  

  const pairsMatchArray = [
    "5d2c8e0fabb8913bd8ecb267-5d2c8e13abb8913bd8ecb268",
    "5d2c8e0fabb8913bd8ecb267-5d2c8e1cabb8913bd8ecb269",
    "5d2c8e13abb8913bd8ecb268-5d2c8e1cabb8913bd8ecb269",
  ]


  let pairsArray = compatibilitiesService.generateMatches(usersArray);

  it('should validate the test objects and their lengths', () => {
    expect(usersArray).to.have.lengthOf(3);
    expect(pairsArray).to.have.lengthOf(3);
    expect(usersArray).to.be.an('array');
    expect(pairsArray).to.be.an('array');
  })

  it('should return true for user 1 & 2 as they already have a match', () => {
    // input a single pair element
    let pairArray = pairsMatchArray[0];
    expect(areUsersMatchedAlready([pairArray], matchesArray)).to.equal(true)
    
  })

  it('should return false for user 1 & 3 as they do not already have a match', () => {
    // input a single pair element
    let pairArray = pairsMatchArray[1];
    expect(areUsersMatchedAlready([pairArray], matchesArray)).to.equal(false)
  })

  it('should return false for user 2 & 3 as they do not already have a match', () => {
    // input a single pair element
    let pairArray = pairsMatchArray[2];
    expect(areUsersMatchedAlready([pairArray], matchesArray)).to.equal(false)
  })

});