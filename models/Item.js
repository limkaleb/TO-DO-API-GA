const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    }
}, { collection: 'contentCollection' });

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;