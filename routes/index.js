const router = require('express').Router();
const passport = require('passport');
const pageController = require('../controllers/pageController.js');
const animeInfoController = require('../controllers/animeInfoController.js');
const postController = require('../controllers/postController.js');
const userController = require('../controllers/userController.js');


router.get   ('/',           pageController.index);
router.get   ('/user/:login',pageController.user);
router.get   ('/post/:id',   pageController.post);
router.get   ('/anime',      pageController.animes);
router.get   ('/anime/:id',  animeInfoController.fetchAnime);
router.get   ('/login',      pageController.login);
router.get   ('/register',   pageController.register);
router.get   ('/search',     pageController.search);
router.get   ('/logout',     pageController.logout);

router.get    ('/api/post',       postController.index);
router.get    ('/api/post/:id',   postController.index);
router.post   ('/api/post',       postController.create);
router.delete ('/api/post/:id',   postController.delete);
router.put    ('/api/post',       postController.update);
router.get    ('/api/anime/order/:orderBy',  animeInfoController.order);
router.get    ('/api/anime/order/:orderBy/:negative',  animeInfoController.order);
router.get    ('/api/user/:login',       userController.index);
router.post   ('/api/user',      userController.create);
router.delete ('/api/user',      userController.delete);
router.put    ('/api/user',      userController.update);
router.get    ('/api/logout',    userController.logout);

module.exports = router;

