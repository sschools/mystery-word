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
  respond.redirect("/play");
});

app.get("/play", function(request, respond) {
  let x = Math.floor(Math.random()*words.length);
  let word = words[x];
  let hiddenWord = "";
  request.session.player.word = word;
  for (let i = 0; i < word.length; i++) {
    hiddenWord += "_";
  }
  request.session.player.hiddenWord = hiddenWord;
  console.log("Word length", word.length);
  console.log("Hidden word length", hiddenWord.length);
  respond.render("play", {player: request.session.player});
});

app.listen(3000, function () {
  console.log("Mystery Word Running on 3000");
});
