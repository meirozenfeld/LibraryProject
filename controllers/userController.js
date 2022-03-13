const User = require('./../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            numberOfResults: users.length,
            data: {
                users
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            massage: err
        });
    }

};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        // User.findOne({_id: req.params.id}); // same result defrent way

        res.status(201).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            massage: err
        });
    };

}
exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({
            status: 'success',
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
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            massage: err
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(201).json({
            status: 'success, user deleted',
            data: {
                user: user
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            massage: err
        });
    }
};
