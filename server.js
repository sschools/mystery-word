const express = require("express");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const parseurl = require("parseurl");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");

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
