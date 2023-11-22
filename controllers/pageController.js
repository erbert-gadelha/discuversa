const { post } = require("../routes/index.js"),
      client = require('../database/control.js').client,
      userController = require('./userController.js');

module.exports = {
      "index": function(req, res) {

        client.query(`SELECT P.*, U.prof_img FROM  tb_post P, tb_user U WHERE P.user_id = U.login ORDER BY id DESC`, (err, pg_res) => {
          if (err) {
            res.redirect('/');
            return
          }

          const posts = pg_res.rows;
          
          posts.map(post => {
            post.date = new Date(post.date).toLocaleDateString('pt-br', {hour: '2-digit', minute:'2-digit'});
            if(post.prof_img == null)
              post.prof_img = '';
          });
          
          
          //res.render('page_home', {posts: posts, user: req.user});
          res.render('page_home', {posts: posts, user: null});
          //res.render('page_home', {posts: posts, user: {login: 'erbert_'}});
          return;
        });
        
      },

      "login": function(req, res) {
        res.render('page_login', { user: null});
      },

      "register": function(req, res) {
        res.render('page_register', { user: null});
      },
      
      "post": function(req, res) {
        const parameter = req.params.id;

        if(!parameter){
          res.redirect('/');
          return;
        } else {

            if(isNaN(parameter))
              res.redirect('/');
            else {

              const query = `SELECT PT.*, US.prof_img FROM tb_post PT INNER JOIN tb_user US ON US.login = PT.user_id WHERE PT.id = ${parseInt(parameter)};`;

                client.query(query, (err, pg_res) => {

                    if (err) {
                      res.redirect('/');
                      return;
                    }

                    const post = pg_res.rows[0];

                    if(post == undefined)
                        res.redirect('/');
                    else {
                      post.date = new Date(post.date).toLocaleDateString('pt-br', {hour: '2-digit', minute:'2-digit'});
                      res.render('page_post', {post: post, user: req.user});
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

      "search": function(req, res) {
        let tags = req.query.tags;

        if(!tags) {
          res.redirect('/');
          return;
        }

        tags = tags.split(',')        
        tags = tags.map(tag => {
          return tag.toLowerCase().trim();
        });

        const query = `SELECT PT.*, US.prof_img FROM tb_tags TG, tb_post PT, tb_user US WHERE tag IN ('${tags.join("','")}') AND TG.post_id = PT.id AND US.login = PT.user_id GROUP BY PT.id, US.prof_img ORDER BY PT.id DESC;`;
        client.query(query, (err, pg_res) => {
          if(err) {
            console.log(err);
            res.render('page_search', {posts: []});
            return
          } else {
            
            const posts = pg_res.rows;

            posts.map(post => {
              post.date = new Date(post.date).toLocaleDateString('pt-br', {hour: '2-digit', minute:'2-digit'});
              if(post.prof_img == null)
                post.prof_img = '';
            });

            res.render('page_search', {posts: posts});
            return
          }
        });


        /*client.query(`SELECT P.*, U.prof_img FROM  tb_post P, tb_user U WHERE P.user_id = U.login ORDER BY id DESC`, (err, pg_res) => {
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

          res.render('page_search', {posts: posts});
          return;
        });*/
      },

      "animes": function(req, res) {
      },

      "logout": function(req, res) {
        //req.logout();
        res.redirect('/');
      },
      "*": function(req, res) {
        res.redirect('/');
        //res.status(404).send({ message: `(${req.url}) is not a actual PATH.` });
      }
    };