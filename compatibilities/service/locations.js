const locationData = require('./../dummy-data/location-data.json');

module.exports = {

  findAllLocations: function findAllLocations() {
    return locationData;
  }

}