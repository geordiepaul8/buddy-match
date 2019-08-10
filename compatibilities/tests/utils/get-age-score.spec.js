const { expect } = require('chai');
const getAgeScore = require('./../../utils/get-age-score');

describe('getAgeScore():', () => {

  describe('testing destrutive parameters', () => {
    it('should throw an error as the parameter is null', () => {
      expect(() => getAgeScore(null).to.throw(TypeError, 'ageDifference must be of type number'))
    });

    it('should throw an error as the parameter is undefined', () => {
      expect(() => getAgeScore().to.throw(TypeError, 'ageDifference must be of type number'))
    });

    it('should throw an error as the parameter is boolean', () => {
      expect(() => getAgeScore(true).to.throw(TypeError, 'ageDifference must be of type number'))
    });

    it('should throw an error as the parameter is string', () => {
      expect(() => getAgeScore('my name').to.throw(TypeError, 'ageDifference must be of type number'))
    });

    it('should throw an error as the parameter is number string', () => {
      expect(() => getAgeScore('10').to.throw(new TypeError, 'ageDifference must be of type number'))
    });
  });

  describe('testing the age score boundaries', () => {
    it('should return (0) for an age difference less than 0: (-1)', () => {
      expect(getAgeScore(-1)).to.equal(0);
    });

    it('should return (0) for an age difference greater than 15: (16)', () => {
      expect(getAgeScore(16)).to.equal(0);
    });

    it('should return (2) for an age difference equal to 15: (15)', () => {
      expect(getAgeScore(15)).to.equal(2);
    });

    it('should return (2) for an age difference between 10 & 15: (12)', () => {
      expect(getAgeScore(12)).to.equal(2);
    });

    it('should return (5) for an age difference equal to 10: (10)', () => {
      expect(getAgeScore(10)).to.equal(5);
    });

    it('should return (5) for an age difference greater than 5 and less than 10: (7)', () => {
      expect(getAgeScore(7)).to.equal(5);
    });

    it('should return (10) for an age difference equal to 5: (5)', () => {
      expect(getAgeScore(5)).to.equal(10);
    });

    it('should return (10) for an age difference less than 5: (4)', () => {
      expect(getAgeScore(4)).to.equal(10);
    });

    it('should return (10) for an age difference equal to 0: (0)', () => {
      expect(getAgeScore(0)).to.equal(10);
    });
  });
});
