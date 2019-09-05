const User = require('../models/User');
const { successResponse, errorResponse } = require('../helpers/response');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const transport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);

exports.getUsers = async function (req, res, next) {
    let users = await User.find();
    res.status(200).json(successResponse('Show all users is success', users));
}

exports.insertUser = async function (req, res, next) {
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    try {
        let user = await User.create({
            username: req.body.username,
            password: hash,
            email: req.body.email,
        });
        res.status(201).json(successResponse('Add user success', user));
    } catch (err) {
        res.status(422).json(errorResponse('Something is error when adding a user', err));
    }
}

exports.getUser = async function (req, res, next) {
    try {
        let users = await User.findById({ _id: req.params.userId });
        res.status(200).json(successResponse('Show 1 user is success', users));
    } catch (err) {
        res.status(422).json(errorResponse('Something is error when getting user data', err));
    }
}

exports.updateById = async function (req, res, next) {
    try {
        const id = req.params.userId;
        let user = await User.findByIdAndUpdate({ _id: id },
            {
                $set: req.body
            },
            { new: true }
        )
        if (!req.body.username || !req.body.password || !req.body.email) {
            res.status(422).json(errorResponse('Field does not exist'));
        } else {
            res.status(200).json(successResponse("Update user is success", user));
        }
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when updating user", err));
    }
}

exports.deleteById = async function (req, res, next) {
    try {
        let user = await User.findByIdAndRemove({ _id: req.params.userId })
        res.status(200).json(successResponse("Delete user is success", user));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when deleting user", err));
    }
}

exports.deleteAll = async function (req, res, next) {
    let users = await User.deleteMany({});
    res.status(200).json(successResponse("Delete all users is success", users));
}

exports.authentication = async function (req, res, next) {
    try {
        let user = await User.findOne({
            username: req.body.username
        });
        var result = bcrypt.compareSync(req.body.password, user.password)
        if (result === true) {
            var token = jwt.sign(user.toJSON(), process.env.SECRET_KEY, {
                algorithm: 'HS256'
            });
            res.setHeader('Authorization', `Bearer ${token}`);
            res.status(200).json(successResponse("Authentication is success!", token));
        } else {
            res.status(401).json(errorResponse("Incorrect password!"));
        }
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when authenticating user", err));
    }
}

exports.putForgotPw = async function (req, res, next) {
    const token = await crypto.randomBytes(20).toString('hex');
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(422).json(errorResponse("No user with that email"));
    }
    console.log(user);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    try {
        const msg = {
            from: 'no-reply@todoadmin.com',
            to: email,
            subject: 'To Do App - Forgot Password / Reset',
            text: `You are receiving this because you (or someone else) 
        have requested the reset of the password for your account. 
        Please click on the following link, or copy and paste it 
        into your browser to complete the process:
        http://${req.headers.host}/users/reset/${token}
        If you did not request this, please ignore this email and 
        your password will remain unchanged.`.replace(/        /g, ''),
            // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        await transport.sendMail(msg);
        res.status(200).json(successResponse(`An email has been sent to ${email} with further instructions.`));
        console.log(`An email has been sent to ${email} with further instructions.`);
    } catch (err) {
        res.status(422).json(errorResponse("Something error when try to send email.", err));
    }
}

exports.putReset = async function (req, res, next) {
    const { token } = req.params;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        req.session.error = 'Password reset token is invalid or has expired.';
        return res.redirect('/forgot-password');
    }

    if (req.body.password === req.body.confirm) {
        var hash = bcrypt.hashSync(req.body.password, saltRounds);
        user.password = hash;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        // const login = util.promisify(req.login.bind(req));
        // await login(user);
    } else {
        res.status(422).json(errorResponse("Password do not match."));
        // return res.redirect(`/reset/${token}`);
    }

    try {
        const msg = {
            from: 'no-reply@todoadmin.com',
            to: user.email,
            subject: 'To Do App - Password Changed',
            text: `Hello,
      This email is to confirm that the password for your account has just been changed.
      If you did not make this change, please hit reply and notify us at once.`.replace(/      /g, '')
        };

        await transport.sendMail(msg);
        res.status(200).json(successResponse('Password successfully updated.', user));
    } catch (err) {
        res.status(422).json(errorResponse("Something error when try to send email.", err));
    }
}