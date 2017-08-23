const express = require("express");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const parseurl = require("parseurl");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const fs = require("fs");

const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(express.static("public"));

app.use(session({
  secret: "elvis",
  resave: false,
  saveUninitialized: true
}));

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const gameDal = require("./dal");

app.get("/", function(request, respond) {
  respond.redirect("/home");
});

app.get("/home", function(request, respond) {
  respond.render("home");
});

app.post("/home", function(request, respond) {
  let player = {name: request.body.name, numGuesses: 8, letters: [], end: false};
  let x = Math.floor(Math.random()*words.length);
  let word = words[x];
  let wordArray = gameDal.createWordArray(word);
  let hiddenArray = gameDal.createHiddenArray(word);
  let hiddenWord = gameDal.createHiddenWord(hiddenArray);
  player.word = word;
  player.hiddenWord = hiddenWord;
  player.wordArray = wordArray;
  player.hiddenArray = hiddenArray;
  request.session.player = player;
  respond.redirect("/play");
});

app.get("/play", function(request, respond) {
  respond.render("play", {player: request.session.player});
});

app.post("/play", function(request, respond) {
  let letter = request.body.letter;
  let player = request.session.player;
  if (gameDal.testLetterInput(letter)) {
    respond.render("play", {player: player, message: "Must enter 1 letter."});
  } else if (gameDal.testForRepeat(letter, player)) {
        respond.render("play", {player: player, message: "You have already guessed " + letter + " try again."});
  } else {
    player = gameDal.testForMatch(letter, player);
    if (gameDal.checkWin(player.wordArray, player.hiddenArray)) {
      player.end = true;
      respond.redirect("/win");
    } else if (player.numGuesses === 0) {
      player.end = true;
      respond.redirect("/lose");
    }
    respond.redirect("/play");
  }
});

app.get("/win", function(request, respond) {
  respond.render("win", {player: request.session.player});
});

app.get("/lose", function(request, respond) {
  respond.render("lose", {player: request.session.player});
});

app.post("/win", function(request, respond) {
  request.session.destroy();
  respond.redirect("/home");
});

app.post("/lose", function(request, respond) {
  request.session.destroy();
  respond.redirect("home");
});

app.listen(3000, function () {
  console.log("Mystery Word Running on 3000");
});
