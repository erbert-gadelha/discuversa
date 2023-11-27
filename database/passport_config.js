require('dotenv').config();

const session       = require('express-session'),
      client        = require('../database/control.js').client,
      LocalStrategy = require('passport-local').Strategy,
      bcrypt = require('bcrypt');

module.exports = {
    'session_config': session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false
    }),
    'localStrategy': new LocalStrategy({
            usernameField: 'login',
            passwordField: 'password'
        }, async (login, password, done) => {

            try {
                const user = (await client.query(`SELECT * FROM tb_user WHERE login = '${login}';`)).rows[0];

                if (user === undefined || user === null)
                    return done(null, false, { message: 'Credenciais inválidas' });
                
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    return done(null, { id: 1, login: login });
                }
                else {
                    return done(null, false, { message: 'Credenciais inválidas' });
                }
            } catch (error) {
                console.log(error);
                return done(error, false);
            }
        
            
        }
    ),
    serializeUser: (user, done) => {
        done(null, user.login); // Aqui você escolhe qual dado do usuário será salvo na sessão (neste caso, o ID)
    },
    deserializeUser: async (login, done) => {
        // Aqui você busca os dados do usuário com base no ID obtido da sessão
        try {
            //const user = (await client.query(`SELECT * FROM tb_user WHERE login = '${login}';`)).rows[0];
            const user = {login: login};

            done(null, user); // Retorna o usuário encontrado
          } catch (error) {
            done(error, null);
          }
    }

}