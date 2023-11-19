

require('dotenv').config()

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const express = require('express'),
      router = require('./routes'),
      client = require("./database/control.js").client;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});