module.exports = (currentUserInterestArray, tempUserInterestArray) => {
  var result = {}
  var count = 0;

  currentUserInterestArray.forEach(function(item) {
      result[item] = 0
  });

  tempUserInterestArray.forEach(function(item) {
    if(result.hasOwnProperty(item)) {
        count++;
    }
  })

  return count;
}