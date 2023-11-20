const client = require('../database/control.js').client;
 
module.exports = {
      index: function(req, res) {
        const parameter = req.url.split('/')[2];

        if(!parameter){
            client.query(`SELECT * FROM tb_post`, (err, pg_res) => {
                if (err)
                    res.status(203).send({message: err});
                else
                    res.status(200).send(pg_res.rows);
            });
        } else{

            if(isNaN(parameter))
                res.status(400).send({ message: `The post ID must be a number`});
            else {

                client.query(`SELECT * FROM tb_post WHERE id = ${parseInt(parameter)}`, (err, pg_res) => {
                    if (err) {
                        res.status(203).send({message: err});
                        return;
                    }

                    const post = pg_res.rows[0];
                    if(post == undefined) {
                        //res.status(203).send({message: `The post with ID ${parameter} doesn't exist.`});
                        res.redirect('/');
                        return;
                    }

                    console.log(post);
                    
                    client.query(`SELECT prof_img FROM tb_user WHERE login = '${post.user_id}'`, (err, pg_res) => {
                        if (err) {
                            res.status(203).send({message: err});
                            console.log(err);
                            return;
                        }

                        post.user_img = pg_res.rows[0].prof_img;
                        
                        post.date = new Date(post.date).toLocaleDateString('pt-br', {hour: '2-digit', minute:'2-digit'});
                        res.render('page_post', {post: post})
                    });

                });
            }
        }
        
      },
  
      create: function(req, res) {
        console.log(req.body);
        const { user, img_url, title, body } = req.body;

        if(req.body == undefined) {
            res.status(203).send({message: "Null body;"});
            return
        }

        const query = `INSERT INTO tb_post (user_id, img_url, title, body, date) VALUES ('${user}', '${img_url}', '${title}', '${body}', '${new Date().toISOString()}') RETURNING ID;`;
       
        client.query(query, (err, pg_res) => {

            if (err)
                res.status(203).send({message: err});
            else {
                const post_id = pg_res.rows[0].id;

                if(req.body.tags != undefined) {
                    const tags = req.body.tags.split(',');
                    tags.forEach(tag => {
                        tag = tag.trim();
                        client.query(`INSERT INTO tb_tags (post_id, tag) VALUES (${post_id}, '${tag}')`, (err, pg_res) => {
                            if (err) console.log(err);
                        });
                    });
                }
                
                res.status(200).send({
                    message: "Post created successfully.",
                    id: post_id
                });
            }
        });
        
      },
      
      delete: function(req, res) {
        const post_id = req.url.split('/')[2];

        if(!post_id) {
            res.status(400).send({ message: `To DELETE a post, it's necessary to pass the desired post ID as URL parameters` });
            return;
        } if(isNaN(post_id)) {
            res.status(400).send({ message: `The post ID must be a number` });
            return;
        }

        const queries = {
            tags: `DELETE FROM tb_tags WHERE post_id = ${post_id};`,
            post: `DELETE FROM tb_post WHERE id = ${post_id};`
        };
       
        client.query(queries.tags, (err, pg_res) => {
            if (err) {
                res.status(203).send({message: err});
                return;
            }

            client.query(queries.post, (err, pg_res) => {
                if (err)
                    res.status(203).send({message: err});
                else
                    res.status(200).send({ message: `Post with ID ${post_id} deleted successfully.` });
            });

        });

      },

      update: function(req, res) {
        const {id, field, value} = req.body;

        if(!id) {
            res.status(400).send({ message: `To UPDATE a post, it's necessary to pass the desired post ID as URL parameters` });
            return;
        } if(isNaN(id)) {
            res.status(400).send({ message: `The post ID must be a number` });
            return;
        }

        const query = `UPDATE tb_post SET ${field} = '${value}' WHERE id = ${id};`;
        
        console.log(query);
       
        client.query(query, (err, pg_res) => {
            if (err) {
                res.status(203).send({message: err});
                return;
            }

            res.status(200).send({ message: `Post with ID ${id} successfully updated.` });

        });

      },
    };