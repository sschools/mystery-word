function checkWin(wordArray, hiddenArray) {
  let win = true;
  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i] !== hiddenArray[i]) {
      win = false;
    }
  }
  return win;
}

module.exports ={
  checkWin: checkWin
}
