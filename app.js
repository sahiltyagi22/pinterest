const express = require("express");
const path = require('path')
const app = express();
const expressSession = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const userModel = require("./models/userModel");
const routes = require('./routes/routes')


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));


app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "this is a secret",
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

passport.use(new localStrategy(userModel.authenticate()));



app.use("/", routes);


module.exports = app;
