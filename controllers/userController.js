const client = require('../database/control.js').client,
      bcrypt = require('bcrypt'),
      passport_config = require('../database/passport_config');


const validate_length = (field, min, max, res, value) => {
    if(value.length < min || value.length > max) {
        res.status(400).send({
            message: `The ${field} length must be between ${min} and ${max} characters`,
            field: field,
            min: min,
            max: max
        });
        return false;
    }
    return true;
}

const validate_date = (res, value) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if(!value.match(regex)) {
        res.status(400).send({
            message: `The date format must be YYYY-MM-DD`,
            field: 'birthdate',
            regex: String(regex)
        });
        return false;
    }

    const [year, month, day] = value.split('-');

    if(month < 1 || month > 12 || day < 1 || day > 31) {
        res.status(400).send({
            message: `The date format must be YYYY-MM-DD`,
            field: 'birthdate',
            regex: String(regex)
        });
        return false;
    }
    
    const today = new Date();
    let idade = today.getFullYear() - year;

    if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day))
        idade--;

    if(idade < 13) {
        res.status(400).send({
            message: `The minimum age to register is 13 years old`,
            field: 'birthdate',
            min: 13
        });
        return false;
    }
    
    return true;
}

const validate_characters = (field, regex, res, value) => {
    if(!value.match(regex)) {
        
        res.status(400).send({
            message: `The field ${field} has no allowed characters`,
            field: field,
            regex: String(regex)
        });
        
        return false;
    }
    return true;
}
 
module.exports = {
    index: function(req, res) {
                const user = req.params.login.toLowerCase();

        const query = `SELECT login, nick, birthday, prof_img FROM tb_user WHERE login = '${user}';`;
        client.query(query, (err, pg_res) => {
            if (err) {
                res.status(203).send({message: err});
                return
            }

            const user = pg_res.rows[0];

            if(user == undefined || user == null) {
                res.status(400).send({ message: `User not found` });
                return;
            }
            
            res.status(200).send({message: user});
          });
    },
    create: function(req, res) {
    let {login, nickname, password, birthdate, user_image } = req.body;

    console.log(req.body);

    if(!login || !nickname || !password || !birthdate) {
        res.status(400).send({ message: `To CREATE a user, it's necessary to pass the following parameters: id, name, password and birthdate` });
        return;
    }

    login = login.toLowerCase();
    nickname = nickname.trim();

    if(!validate_length(   'login', 4, 15, res,    login)) return;
    if(!validate_length('nickname', 1, 20, res, nickname)) return;
    if(!validate_length('password', 4, 20, res, password)) return;
    if(!validate_date  (res, birthdate))                   return;
    if(!validate_characters(   'login',        /^[a-zA-Z0-9_-]+$/, res,    login)) return;
    if(!validate_characters('nickname', /^[a-zA-Z0-9À-ÿ\s.\-_]+$/, res, nickname)) return;
    

    password = bcrypt.hashSync(password, Number.parseInt(process.env.SALT_ROUNDS));
    const query = `INSERT INTO tb_user (login, nick, birthday, password, prof_img) VALUES ('${login}', '${nickname}', '${birthdate}', '${password}', '${user_image}');`;
    
    client.query(query, (err) => {
        if (err) {
            res.status(203).send({message: err});
            return;
        }
                
        res.status(200).send({message: "User created successfully."});
    });
    
    },

    delete: function(req, res) {
    const {login, password} = req.body;

    if(!login || !password) {
        res.status(400).send({ message: `To DELETE, it's necessary to pass the following parameters: login and password` });
        return;
    }

    const queries = {
        delete: `DELETE FROM tb_user WHERE login = '${login}';`,
        select: `SELECT * FROM tb_user WHERE login = '${login}';`
    }

    client.query(queries.select, (err, pg_res) => {
            if (err) {
                res.status(203).send({message: err});
                return
            }

            const user = pg_res.rows[0];

            if(user == undefined || user == null) {
                res.status(400).send({ message: `User not found` });
                return;
            }

            if(!bcrypt.compareSync(password, user.password)) {
                res.status(400).send({ message: `Invalid password` });
                return;
            }

            client.query(queries.delete, (err, pg_res) => {
                if (err) {
                    res.status(203).send({message: err});
                    return
                }
                res.status(200).send({message: "User deleted successfully."});
            });

    });
    
    },

    update: function(req, res) {
    let {login, password, field, value} = req.body;

    if(!login || !password || !field || !value) {
        res.status(400).send({ message: 'There are missing fields on BODY' });
        return;
    }


    switch(field) {
        case 'login':
            res.status(400).send({ message: 'Login\'s are permanent.' });
            return;
        case 'password':
            if(!validate_length('password', 4, 20, res, value)) return;
            break;
        case 'nickname':
            if(!validate_length('nickname', 1, 20, res, value)) return;
            if(!validate_characters('nickname', /^[a-zA-Z0-9À-ÿ\s.\-_]+$/, res, value)) return;
            field = 'nick';
            break;
        case 'prof_img':
            break;
        case 'birthday':
            if(!validate_date(res, value)) return;
            break;
        default:
            res.status(400).send({ message: `Field '${field}' doesn't exist.` });
            return;
    }

    const queries = {
        update: `UPDATE tb_user SET ${field} = '${value}' WHERE login = '${login}';`,
        select: `SELECT * FROM tb_user WHERE login = '${login}';`
    }

    console.log(queries.update);

    client.query(queries.select, (err, pg_res) => {
            if (err) {
                res.status(203).send({message: err});
                return
            }

            const user = pg_res.rows[0];

            if(user == undefined || user == null) {
                res.status(400).send({ message: `User not found` });
                return;
            }

            if(!bcrypt.compareSync(password, user.password)) {
                res.status(400).send({ message: `Invalid password` });
                return;
            }

            client.query(queries.update, (err, pg_res) => {
                if (err) {
                    res.status(203).send({message: err});
                    return
                }
                res.status(200).send({message: `Field '${field}' was successfully updated.`});
            });

    });
    
    },

    logout: function(req, res) {
        req.logout(function(err) {
            if (err) {
                req.status(203).send({message: err});
                return next(err);
            }
            req.session.destroy();
            res.status(200).send({message: "User logged out successfully."});
            return;
        });
    }
};