var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.get('/', userController.getUsers);

router.post('/', userController.insertUser);

router.post('/login', userController.authentication);

router.post('/forgot', userController.putForgotPw);

router.post('/reset/:token', userController.putReset);

router.get('/:userId', userController.getUser);

router.put('/:userId', userController.updateById);

router.delete('/:userId', userController.deleteById);

router.delete('/', userController.deleteAll);

module.exports = router;
