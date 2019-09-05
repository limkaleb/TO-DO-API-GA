const Item = require('../models/Item');
const User = require('../models/User');
const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../helpers/response');

exports.postItem = async function (req, res, next) {
    try {
        let item = await Item.create({ content: req.body.content });
        let user = await User.findById(req.params.userId);

        user.posts.push(item);
        let result = await user.save();
        res.status(201).json(successResponse("Post item to database success", result));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when creating an item", err));
    }
}

exports.getAll = async function (req, res, next) {
    let items = await Item.find();
    res.status(200).json(successResponse("Get all items is success", items));
}

exports.getPosts = async function (req, res, next) {
    try {
        let user = await User
            .findById(req.params.userId)
            .select(['_id', 'username', 'posts'])
            .populate({
                path: 'posts',
                select: ['_id', 'content', 'completed']
            });
        res.status(200).json(successResponse("Show posts is success", user));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when getting data", err));
    }
}

exports.updateById = async function (req, res, next) {
    try {
        const id = req.params.contentId;
        let item = await Item.findByIdAndUpdate({ _id: id },
            {
                $set: req.body
            },
            { new: true }
        )
        if (!req.body.content && !req.body.completed) {
            res.status(422).json(errorResponse('Field does not exist'));
        } else {
            res.status(200).json(successResponse("Update an item is success", item));
        }
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when updating an item", err));
    }
}

exports.deleteById = async function (req, res, next) {
    try {
        let user = await User.findOne({ posts: mongoose.Types.ObjectId(req.params.contentId) });
        let index = await user.posts.indexOf(req.params.contentId);
        user.posts.splice(index, 1);
        let result = await user.save();
        res.status(200).json(successResponse("Delete an item is success", result));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when deleting an item", err));
    }
}

exports.deleteAll = async function (req, res, next) {
    let item = await Item.deleteMany({});
    res.status(200).json(successResponse("Delete all items is success", item));
}