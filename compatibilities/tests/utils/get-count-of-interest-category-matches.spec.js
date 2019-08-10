/*
**  This test covers the get-count-of-interest-matches.js function also
*/
const { expect } = require('chai');
const Interest = require('./../../models/all-models').interestModel;

const getCountOfInterestCategoryMatches = require('./../../utils/get-count-of-interest-category-matches');

const sportInterest1 = new Interest({
  category :"sport",
  name: "playing football"
});

const sportInterest2 = new Interest({
  category :"sport",
  name: "watching football"
});

const leisureInterest1 = new Interest({
  category :"leisure",
  name: "painting"
});

describe('getCountOfInterestCategoryMatches():', () => {

  describe('testing destructive parameters', () => {

    describe('parameter 1: currentUserInterestArray', () => {

      it('should throw an Error when the currentUserInterestArray is an Object', () => {
        expect(() => getCountOfInterestCategoryMatches({}, [])).to.throw(TypeError,'Invalid Parameter Type')
      });

      it('should throw an Error when the currentUserInterestArray is null', () => {
        expect(() => getCountOfInterestCategoryMatches(null, [])).to.throw(TypeError,'Invalid Parameter Type')
      });

      it('should throw an Error when the currentUserInterestArray is undefined', () => {
        expect(() => getCountOfInterestCategoryMatches()).to.throw(TypeError,'Invalid Parameter Type')
      });

    });

    describe('parameter 2: tempInterestArray', () => {

      it('should throw an Error when the tempInterestArray is an Object', () => {
        expect(() => getCountOfInterestCategoryMatches([], {})).to.throw(TypeError,'Invalid Parameter Type')
      });

      it('should throw an Error when the tempInterestArray is null', () => {
        expect(() => getCountOfInterestCategoryMatches([], null, [])).to.throw(TypeError,'Invalid Parameter Type')
      });

      it('should throw an Error when the tempInterestArray is undefined', () => {
        expect(() => getCountOfInterestCategoryMatches([])).to.throw(TypeError,'Invalid Parameter Type')
      });

    });

  });

  describe('it should return an interest score', () => {

    it('should return a interestMatchCategoryScore of 0', () => {
      expect(getCountOfInterestCategoryMatches([], [])).to.equals(0)
    });
  
    it('should return a interestMatchCategoryScore of 0', () => {
      expect(getCountOfInterestCategoryMatches([sportInterest1], [])).to.equals(0)
    });

    it('should return a interestMatchCategoryScore of 0', () => {
      expect(getCountOfInterestCategoryMatches([], [sportInterest1])).to.equals(0)
    });


    it('should return a interestMatchCategoryScore of 0', () => {
      expect(getCountOfInterestCategoryMatches([sportInterest1], [leisureInterest1])).to.equals(0)
    });

    it('should return a interestMatchCategoryScore of 1', () => {
      expect(getCountOfInterestCategoryMatches([sportInterest1], [sportInterest2])).to.be.greaterThan(0).and.equals(1)
    });

    it('should return a interestMatchCategoryScore of 1', () => {
      expect(getCountOfInterestCategoryMatches([sportInterest1, sportInterest2], [leisureInterest1, sportInterest1])).to.equals(1)
    });

    it('should return a interestMatchCategoryScore of 2', () => {
      expect(getCountOfInterestCategoryMatches([sportInterest1, sportInterest2], [leisureInterest1, sportInterest1, sportInterest2])).to.equals(2)
    });
  });
});