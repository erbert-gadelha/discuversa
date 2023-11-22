
/*const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const client = require('./control.js').client;

passport.use(
    'localSignup',
    new LocalStrategy( {
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback .
        } ,
        (req, login, password, next) => {

            client.query(`SELECT * FROM tb_user WHERE login = ${login}`, (err, pg_res) => {
                if (err) throw err;

                const user = pg_res.rows[0];

                if (user) return next(null, false);
                else {
                    // Password must be hashed !
                    let newUser = createUser(email, password);
                    newUser.save(function() {
                    // Pass the user to the callback
                    return next(null, newUser);
                    });
                }

            });
   }))*/