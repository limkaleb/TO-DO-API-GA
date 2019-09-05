const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const auth = require('../middlewares/auth');

// get all items
router.get('/', auth.isAuthenticated, itemController.getAll);

// get all item by user id
router.get('/:userId', auth.isAuthenticated, itemController.getPosts);

// post 1 item
router.post('/:userId', auth.isAuthenticated, itemController.postItem);

// update 1 item by id
router.put('/:contentId', auth.isAuthenticated, itemController.updateById);

// delete 1 item by id
router.delete('/:contentId', auth.isAuthenticated, itemController.deleteById);

// delete all item
router.delete('/', itemController.deleteAll);


module.exports = router;

/*
GET all posts   /posts
GET 1 post      /posts/:id
GET completed   /posts/completed
POST create     /posts
PUT update      /posts/:id
PUT completed   /posts/:id
DELETE destroy  /posts/:id
*/