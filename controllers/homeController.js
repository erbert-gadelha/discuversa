module.exports = {
      "index": function(req, res) {
        const header = '<h1 style="font-size: 3rem; text-align: center;">AniFórum</h1><h2 style="font-size: 2rem; text-align: center;">Endpoints:</h2>'
        const post = '<a href="/post" style="font-size: 2rem;">post</a>';
        const anime = '<a href="/anime" style="font-size: 2rem;">anime</a><br>';
        const div = `<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;"> ${post} ${anime} </div>`;
        res.send(`${header} ${div}`);
      },
  
      "*": function(req, res) {
        res.status(404).send({ message: `(${req.url}) is not a actual PATH.` });
      }
    };