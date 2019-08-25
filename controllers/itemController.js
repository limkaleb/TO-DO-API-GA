const Item = require('../models/Item');

exports.postItem = async function (req, res, next) {
    try {
        let item = await Item.create(req.body.content);
        res.status(200).json({ message: "Post item to database success", item });
    } catch {
        res.status(422).json({ error: "Something is error when creating an item" });
    }
}

exports.getAll = async function (req, res, next) {
    try {
        let items = await Item.find();
        res.status(200).json({ message: "Get all items is success", items });
    } catch {
        res.status(422).json({ error: "Something is error when getting data" });
    }
}

exports.getOne = async function (req, res, next) {
    try {
        let items = await Item.findOne({ _id: req.params.contentId });
        res.status(200).json({ message: "Show 1 item is success", items });
    } catch {
        res.status(422).json({ error: "Something is error when getting data" });
    }
}

exports.updateById = async function (req, res, next) {
    try {
        let item = await Item.findOneAndUpdate({ _id: req.params.contentId },
            {
                $set: { content: req.body.content }
            },
            { new: true }
        )
        res.status(200).json({ message: "Update an item is success", item });
    } catch {
        res.status(422).json({ error: "Something is error when updating an item" })

    }
}

exports.deleteById = async function (req, res, next) {
    try {
        let item = await Item.findOneAndDelete({ _id: req.params.contentId })
        res.status(200).json({ message: "Delete an item is success", item });
    } catch {
        res.status(422).json({ error: "Something is error when updating an item" })

    }
}