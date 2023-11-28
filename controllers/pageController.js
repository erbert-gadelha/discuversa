const { post } = require("../routes/index.js"),
      client = require('../database/control.js').client,
      userController = require('./userController.js');

require('passport');
require('passport-local');
require('passport-local').Strategy;
require('passport').session

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
          
          const user = req.user||null;
          res.render('page_home', {posts: posts, user: user});
          
          return;
        });
        
      },

      "login": function(req, res) {
        if(req.user) {
          res.redirect('/');
          return;
        }
        
        res.render('page_login', { user: null});
      },

      "register": function(req, res) {
        if(req.user) {
          res.redirect('/');
          return;
        }
        
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

                      const user = req.user||null;
                      res.render('page_post', {post: post, user: user});
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

              const profile = pg_res.rows[0];

              if(profile == undefined || profile == null) {
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
                  
                  if(profile.prof_img == null)
                    post.prof_img = '';
                  else
                    post.prof_img = profile.prof_img;
                });

                profile.birthday = new Date(profile.birthday).toLocaleDateString('pt-br', {year: 'numeric', month: 'long', day: 'numeric'});
                
                const user = req.user||null;
                res.render('page_user', {profile: profile, user: user, posts: posts});
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

            const user = req.user||null;
            res.render('page_search', {posts: posts, user: user});
            return
          }
        });
      },

      "animes": function(req, res) {
      },

      "logout": function(req, res) {
        req.logout(function(err) {
            if (err) {
                res.redirect('/');
                return next(err);
            }
            req.session.destroy();

            res.redirect('/');
            return;
        });
      },
      
      "*": function(req, res) {
        res.redirect('/');
        //res.status(404).send({ message: `(${req.url}) is not a actual PATH.` });
      }
    };