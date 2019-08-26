const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// get all items
router.get('/', itemController.getAll);

// get one item
router.get('/:contentId', itemController.getOne);

// post 1 item
router.post('/', itemController.postItem);

// update 1 item
router.put('/:contentId', itemController.updateById);

// delete 1 item
router.delete('/:contentId', itemController.deleteById);

module.exports = router;

/*
GET all posts   /posts
GET 1 post      /posts/:id
GET completed   /posts/completed
POST create     /posts
PUT update      /posts/:id
PUT completed        /posts/:id
DELETE destroy  /posts/:id
*/