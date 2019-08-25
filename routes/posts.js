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

router.get('/:id', function (req, res, next) {
    res.send('This shows 1 post');
});

router.put('/:id', function (req, res, next) {
    res.send('This update 1 post');
});

router.delete('/:id', function (req, res, next) {
    res.send('This delete 1 post');
});

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