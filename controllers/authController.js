const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');


const signToken = id => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    createAndSendToken(newUser, 201, res);
});

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000),
        secure: true,
        httpOnly: true
    });

    // Remove passwort from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // check if the user and password are correct
    const user = await User.findOne({ email }).select('+password');
    // console.log(user);

    if (!user || !await (user.checkPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // if its ok sent the token to the client
    createAndSendToken(user, 200, res);
});

// protect from user which are not connected to get data
exports.protect = catchAsync(async (req, res, next) => {
    // Get the token
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in, Please log in again to get access', 401));
    }

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const checkUser = await User.findById(decoded.id);
    if (!checkUser) {
        return next(new AppError('The user does not exist anymore, Please sign up to get access', 401));
    }

    // Check if user changed the password after the token was taken
    if (checkUser.changePassAfterToken(decoded.iat)) {
        return next(new AppError('User password changed recently, Please log in again to get access ', 401));
    }

    req.user = checkUser;
    next();
});


// Handle who have the premission
exports.premissionTo = (...roles) => {
    return (req, res, next) => {
        // roles its array, for exmple ['admin', 'librarian']
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You dont have this premission to this action', 403));
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //  Get the curr user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('No User found with this email address', 404));
    }

    // Generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send it to the users email
    const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? submit a PATCH request with your new password and password confirm to - ${resetURL}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token, valid for 10 minutes',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to your mail'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the mail, please try again later', 500));
    }

});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // Get the user by token

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    //  Set the new password if conditions
    if (!user) {
        return next(new AppError('Token is invalid or expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Update passwordChangedAt with midlleware in userModel
    // Log in the user, and send JWT
    createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // Get the user
    const user = await User.findById(req.user.id).select('+password');

    // Check if the password is correct
    if (!(await user.checkPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('The user password is not correct', 401));
    }

    // Update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Log in the user, send JWT
    createAndSendToken(user, 200, res);
});
