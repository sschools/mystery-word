function checkWin(wordArray, hiddenArray) {
  let win = true;
  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i] !== hiddenArray[i]) {
      win = false;
    }
  }
  return win;
}

function createWordArray(word) {
  let arr = [];
  for (let i = 0; i < word.length; i++) {
    arr[i] = word.slice(i, i+1);
  }
  return arr;
}

function createHiddenArray(word) {
  let arr = [];
  for (let i = 0; i < word.length; i++) {
    arr[i] = "_";
  }
  return arr;
}

function createHiddenWord(arr) {
  let hiddenWord = "";
  for (let i = 0; i < arr.length; i++) {
    hiddenWord += arr[i] + " ";
  }
  return hiddenWord;
}

function testLetterInput(letter) {
  return (letter.length > 1 || letter < "a" || letter > "z");
}

module.exports ={
  checkWin: checkWin,
  createWordArray: createWordArray,
  createHiddenArray: createHiddenArray,
  createHiddenWord: createHiddenWord,
  testLetterInput: testLetterInput
}
