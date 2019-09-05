const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String, lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'], index: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }],
    Timestamp: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires: Date

}, { collection: 'userCollection' });



userSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
module.exports = mongoose.model('User', userSchema);