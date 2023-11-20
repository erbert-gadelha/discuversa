const express = require('express');
const router = express.Router();
const homeController        = require('../controllers/homeController.js'),
      animeInfoController   = require('../controllers/animeInfoController.js'),
      postController        = require('../controllers/postController.js'),
      userController        = require('../controllers/userController.js');
      
router.get   ('/',           homeController.index);
router.get   ('/post',       postController.index);
router.post  ('/post',       postController.create);
router.get   ('/post/:id',   postController.index);
router.delete('/post/:id',   postController.delete);
router.put   ('/post',       postController.update);
router.get   ('/anime',      animeInfoController.index);
router.get   ('/anime/id/:id',  animeInfoController.fetchAnime);
router.get   ('/anime/order/:orderBy',  animeInfoController.order);
router.get   ('/anime/order/:orderBy/:negative',  animeInfoController.order);
router.post   ('/user',      userController.create);
router.get    ('/user',      userController.login);
router.delete ('/user',      userController.delete);
router.put    ('/user',      userController.update);
router.get    ('/user/:login',userController.index);
router.get    ('/login',     homeController.login);
router.post   ('/login',     userController.login);
router.get    ('/register',  homeController.register);

module.exports = router;

