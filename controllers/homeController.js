const { post } = require("../routes"),
      client = require('../database/control.js').client;

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
          });

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
  
      "*": function(req, res) {
        res.status(404).send({ message: `(${req.url}) is not a actual PATH.` });
      }
    };