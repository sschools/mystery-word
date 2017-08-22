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

app.get("/", function(request, respond) {
  respond.redirect("/home");
});

app.get("/home", function(request, respond) {
  respond.render("home");
});

app.post("/home", function(request, respond) {
  let player = {name: request.body.name, numGuesses: 8, letters: []};
  request.session.player = player;
  let x = Math.floor(Math.random()*words.length);
  let word = words[x];
  let hiddenWord = "";
  let wordArray = [];
  let hiddenArray = [];
  request.session.player.word = word;
  for (let i = 0; i < word.length; i++) {
    wordArray[i] = word.slice(i, i+1);
    hiddenArray[i] = "_";
  }
  for (let i = 0; i < hiddenArray.length; i++) {
    hiddenWord += hiddenArray[i] + " ";
  }
  request.session.player.hiddenWord = hiddenWord;
  request.session.player.wordArray = wordArray;
  request.session.player.hiddenArray = hiddenArray;
  respond.redirect("/play");
});

app.get("/play", function(request, respond) {
  respond.render("play", {player: request.session.player});
});

app.post("/play", function(request, respond) {
  let test = request.body.letter.length;
  if (test > 1 || request.body.letter < "a" || request.body.letter > "z") {
    respond.render("play", {player: request.session.player, message: "Must enter 1 letter."})
  } else {
    let letter = request.body.letter;
    let match = false;
    request.session.player.letters.push(letter);
    for (let i = 0; i < request.session.player.wordArray.length; i++) {
      if (request.session.player.wordArray[i] === letter) {
        request.session.player.hiddenArray[i] = letter;
        match = true;
      }
    }
    if (!match) {
      request.session.player.numGuesses -= 1;
    }
    request.session.player.hiddenWord = "";
    for (let i = 0; i < request.session.player.hiddenArray.length; i++) {
      request.session.player.hiddenWord += request.session.player.hiddenArray[i] + " ";
    }
    if (request.session.player.wordArray === request.session.player.hiddenArray) {
      respond.render("play", {player: request.session.player, message:"You WIN!!"});
    } else if (request.session.player.numGuesses === 0) {
      respond.render("play", {player: request.session.player, message:"You Lose"});
    }
    respond.redirect("/play");
  }
});

app.listen(3000, function () {
  console.log("Mystery Word Running on 3000");
});
