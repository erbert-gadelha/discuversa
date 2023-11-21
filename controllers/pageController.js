const { post } = require("../routes/index.js"),
      client = require('../database/control.js').client,
      userController = require('./userController.js');

module.exports = {
      "index": function(req, res) {
        
        /*const posts = [
          {
            "id": 14,
            "user_id": "pedro12",
            "user_img": "",
            "img_url": "https://upload.wikimedia.org/wikipedia/pt/7/72/Pok%C3%A9mon_Emerald_cover.png",
            "title": "PokemonEmerald é bom demaizi",
            "body": "pense num jogo topzeira",
            "date": "2023-11-16T08:37:34.228Z"
          },
          {
            "id": 15,
            "user_id": "pedro12",
            "user_img": "",
            "img_url": "",
            "title": "hantaro",
            "body": "body generico",
            "date": "2023-11-16T08:50:37.019Z"
          }
        ]*/

        client.query(`SELECT P.*, U.prof_img FROM  tb_post P, tb_user U WHERE P.user_id = U.login ORDER BY id DESC`, (err, pg_res) => {
          if (err) {
              res.status(203).send({message: err});
              return
          }

          const posts = pg_res.rows;
          
          posts.map(post => {
            post.date = new Date(post.date).toLocaleDateString('pt-br', {hour: '2-digit', minute:'2-digit'});
            if(post.prof_img == null)
              post.prof_img = '';
          });
          console.log(posts);

          res.render('page_home', {posts: posts});

          return;
        });
        
      },

      "login": function(req, res) {
        res.render('page_login');
      },

      "register": function(req, res) {
        res.render('page_register');
      },
      
      "post": function(req, res) {
        const parameter = req.params.id;

        if(!parameter){
            client.query(`SELECT * FROM tb_post`, (err, pg_res) => {
                if (err)
                    res.status(203).send({message: err});
                else
                    res.status(200).send(pg_res.rows);
            });

        } else {

            if(isNaN(parameter))
                res.status(400).send({ message: `The post ID must be a number`});
            else {

              const query = `SELECT PT.*, US.prof_img FROM tb_post PT INNER JOIN tb_user US ON US.login = PT.user_id WHERE PT.id = ${parseInt(parameter)};`;

                client.query(query, (err, pg_res) => {

                    if (err) {
                        res.status(203).send({message: err});
                        return;
                    }

                    const post = pg_res.rows[0];

                    if(post == undefined)
                        res.redirect('/');
                    else {
                      post.date = new Date(post.date).toLocaleDateString('pt-br', {hour: '2-digit', minute:'2-digit'});
                      res.render('page_post', {post: post});
                    }

                });
            }
        }
      },

      "user": function(req, res) {
          const user = req.params.login.toLowerCase();

          const queries = {
            "posts": `SELECT * FROM tb_post WHERE user_id = '${user}' ORDER BY id DESC`,
            "user": `SELECT login, nick, birthday, prof_img FROM tb_user WHERE login = '${user}';`
          }

          client.query(queries.user, (err, pg_res) => {
              if (err) {
                res.redirect('/');
                return
              }

              const user = pg_res.rows[0];

              if(user == undefined || user == null) {
                  res.redirect('/');
                  return;
              }
              client.query(queries.posts, (err, pg_res) => {
                if (err) {
                  console.log(err);
                  res.redirect('/');
                  return;
                }

                const posts = pg_res.rows;
                posts.map(post => {
                  post.date = new Date(post.date).toLocaleDateString('pt-br', {hour: '2-digit', minute:'2-digit'});
                  
                  if(user.prof_img == null)
                    post.prof_img = '';
                  else
                    post.prof_img = user.prof_img;
                });


                user.birthday = new Date(user.birthday).toLocaleDateString('pt-br', {year: 'numeric', month: 'long', day: 'numeric'});
                res.render('page_user', {user: user, posts: posts});
                return;

              });

            });
      },

      "animes": function(req, res) {

      },
      "*": function(req, res) {
        res.status(404).send({ message: `(${req.url}) is not a actual PATH.` });
      }
    };