const animeInfo = require('../database/animes');

module.exports = {
      index: function(req, res) {
        res.status(400).send({ message: `To FETCH a anime, it's necessary to pass the desired anime ID as URL parameters` });
      },
      fetchAnime: function(req, res) {
        const id = req.params.id;

        if(!req.params.id){
            res.status(400).send({ message: `To FETCH a anime, it's necessary to pass the desired anime ID as URL parameters` });
            return
        }
        
        if(isNaN(req.params.id)) {
            res.status(400).send({ message: `The anime ID must be a number` });
            return
        }
        
        req.params.id = parseInt(req.params.id);
        const response = animeInfo.filter(anime => anime.id == req.params.id);

        if(response == undefined)
            res.status(203).send({message: "No matching anime found"});
        else if (response.length == 0)
            res.status(203).send({message: "No matching anime found"});
        else
            res.status(200).send(response);
        
      },
      order: function(req, res) {

        let orderedAnimes = [];

        switch(req.params.orderBy){
            case 'most-viewed':
                if(req.params.negative === 'true')
                    orderedAnimes = animeInfo.sort((a, b) => a.views - b.views);
                else
                    orderedAnimes = animeInfo.sort((a, b) => b.views - a.views);
                break;
            case 'rating':
                if(req.params.negative === 'true')
                    orderedAnimes = animeInfo.sort((a, b) => a.rating - b.rating);
                else
                    orderedAnimes = animeInfo.sort((a, b) => b.rating - a.rating);
                break;
            default:
                res.status(400).send({ message: `The orderBy parameter must be one of the following: most-viewed or rating. Followed to a optional order direction` });
                return;
        }

        
        res.status(200).send(orderedAnimes.map(anime => anime.id));        
      }

  
    };