const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        unique: true,
        maxLength: [20, "A user name must have less or equal then 20 characters"],
        minLength: [3, "A user name must have more or equal then 3 characters"]
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowerCase: true,
        validate: [validator.isEmail, 'Wrong email address']
    },
    role: {
        type: String,
        enum: ['user', 'librarian', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        maxLength: [8, "A user password must have less or equal then 8 characters"],
        minLength: [4, "A user password must have more or equal then 4 characters"],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'A user must confirm the password'],
        validate: {
            validator: function (el) {
                return this.password === el;
            },
            message: "The passwords are not the same"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});



userSchema.pre('save', async function (next) {
    // next if the password didnt modified
    if (!this.isModified('password')) return next();

    // Hash password
    this.password = await bcrypt.hash(this.password, 12);

    //Delete password confirm
    this.passwordConfirm = undefined;
    next();
});

// midllware for all methods that use save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// midllware for all methods that starts with find
userSchema.pre(/^find/, function (next) {
    // Find only exsist users, and not deleted users
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.checkPassword = async function (tryPassword, userPassword) {
    return await bcrypt.compare(tryPassword, userPassword);
};

userSchema.methods.changePassAfterToken = function (JWTTimeTaken) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // console.log("1", changedTimestamp, "2", JWTTimeTaken);
        return JWTTimeTaken < changedTimestamp;
    }
    // false when password not changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex'); // 32 bytes - HexaDecimal

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log({ resetToken }, this.passwordResetToken);

    return resetToken;
};


const User = mongoose.model('User', userSchema);

module.exports = User;














//// Test Example
// const testUser = new User({
//     name: 'Moshe',
//     email: 'Mo@gmail.com',
//     password: '654321'
// });
// testUser.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log('Error! :', err);
// });

