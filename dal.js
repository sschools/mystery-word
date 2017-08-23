const fs = require("fs");
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

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

function setUpPlayer(player) {
  let x = Math.floor(Math.random()*words.length);
  let word = words[x];
  let wordArray = createWordArray(word);
  let hiddenArray = createHiddenArray(word);
  let hiddenWord = createHiddenWord(hiddenArray);
  player.word = word;
  player.hiddenWord = hiddenWord;
  player.wordArray = wordArray;
  player.hiddenArray = hiddenArray;
  return player;
}

function testLetterInput(letter) {
  return (letter.length > 1 || letter < "a" || letter > "z");
}

function testForRepeat(letter, player) {
  let repeat = false;
  for (let i = 0; i < player.letters.length; i++) {
    if (letter === player.letters[i]) {
      repeat = true;
    }
  }
  return repeat;
}

function testForMatch(letter, player) {
  let match = false;
  player.letters.push(letter);
  for (let i = 0; i < player.wordArray.length; i++) {
    if (player.wordArray[i] === letter) {
      player.hiddenArray[i] = letter;
      match = true;
    }
  }
  if (!match) {
    player.numGuesses -= 1;
  }
  player.hiddenWord = createHiddenWord(player.hiddenArray);
  return player;
}

module.exports ={
  checkWin: checkWin,
  createWordArray: createWordArray,
  createHiddenArray: createHiddenArray,
  createHiddenWord: createHiddenWord,
  testLetterInput: testLetterInput,
  testForRepeat: testForRepeat,
  testForMatch: testForMatch,
  setUpPlayer: setUpPlayer
}
