

require('dotenv').config()

/*const passport = require('passport');
const localStrategy = require('passport-local').Strategy;*/

const express = require('express'),
      router = require('./routes'),
      ejs = require('ejs');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(router);
app.set('views','src/views');
app.set('view engine', 'ejs');

app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});


module.exports = app;