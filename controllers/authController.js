const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = id => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            massage: err
        });
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // check if email and password exist
        if (!email || !password) {
            return next();
            //TODO error lesson
        }

        // check if the user and password are correct
        const user = await User.findOne({ email }).select('+password');
        console.log(user);

        if (!user || !await (user.checkPassword(password, user.password))) {
            return next();            //TODO error lesson
        }
        // if its ok sent the token to the client
        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            massage: err
        });
    }
}