const mongoose = require('mongoose');

module.exports = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId);
};
