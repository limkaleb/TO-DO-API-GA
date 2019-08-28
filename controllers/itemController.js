const Item = require('../models/Item');
const { successResponse, errorResponse } = require('../helpers/response');

exports.postItem = async function (req, res, next) {
    try {
        let item = await Item.create({ content: req.body.content });
        res.status(201).json(successResponse("Post item to database success", item));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when creating an item", err));
    }
}

exports.getAll = async function (req, res, next) {
    try {
        let items = await Item.find();
        res.status(200).json(successResponse("Get all items is success", items));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when getting data", err));
    }
}

exports.getOne = async function (req, res, next) {
    try {
        let items = await Item.findOne({ _id: req.params.contentId });
        res.status(200).json(successResponse("Show 1 item is success", items));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when getting data"));
    }
}

exports.updateById = async function (req, res, next) {
    try {
        let item = await Item.findByIdAndUpdate({ _id: req.params.contentId },
            req.body,
            { new: true }
        )
        res.status(200).json(successResponse("Update an item is success", item));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when updating an item", err));
    }
}

exports.deleteById = async function (req, res, next) {
    try {
        let item = await Item.deleteOne({ _id: req.params.contentId })
        res.status(200).json(successResponse("Delete an item is success", item));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when deleting an item", err));

    }
}

exports.deleteAll = async function (req, res, next) {
    try {
        let item = await Item.deleteMany({});
        res.status(200).json(successResponse("Delete all items is success", item));
    } catch (err) {
        res.status(500).json(errorResponse("SOmething is error when deleting all items", err));
    }
}