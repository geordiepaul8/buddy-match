module.exports = (userId1, userId2) => {
// TODO: validate the input as array types

  let pairsArray = [];

  userId1.forEach(id1 => {
    userId2.forEach(id2 => {
      if(id1 != id2) {
        let index1 = pairsArray.indexOf(`${id1}-${id2}`);
        let index2 = pairsArray.indexOf(`${id2}-${id1}`);

        if(index1 == -1 && index2 == -1) {
          pairsArray.push(`${id1}-${id2}`);
        }
        
      }
    })
  })
  return pairsArray;
}