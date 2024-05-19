const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signupUser = async (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email({  minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().error(new Error("email not valid")),
            password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
                .required().error(new Error("password must have 8 characters that includes upper case, lower case, digits, and special characters")),
            repeat_password: Joi.string().valid(Joi.ref('password')).required().error(new Error("repeat_password not same as password")),
            username: Joi.string().min(3).max(15).required().error(new Error("username not valid")),
            identity_number: Joi.string().required().error(new Error("identity_number not valid"))
        });

        let input = req.body;

        try {
            input = await schema.validateAsync(input);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        const findUser = await User.findOne({ emailAddress: input.email });

        if (findUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(input.password, 12);
        const user = new User({
            emailAddress: input.email,
            password: hashedPassword,
            userName: input.username,
            accountNumber: Math.floor(Math.random() * 900000) + 100000,
            identityNumber: input.identity_number
        });
        await user.save();

        return res.status(201).json({ message: 'User created successfully'});
    } catch (error) {
        return next(error);
    }
};

exports.signinUser = async (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email({  minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().error(new Error("email not valid")),
            password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
                .required().error(new Error("password must have 8 characters that includes upper case, lower case, digits, and special characters"))
        });

        let input = req.body;

        try {
            input = await schema.validateAsync(input);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        const findUser = await User.findOne({ emailAddress: input.email });
        if (!findUser) {
            return res.status(400).json({ message: 'Please input the correct email or password' });
        }
        const comparePassword = await bcrypt.compare(input.password, findUser.password);
        if(!comparePassword) {
            return res.status(400).json({ message: 'Please input the correct email or password' });
        }

        const payloadJwt = {
            id: findUser._id.toString(),
            email: findUser.emailAddress,
            username: findUser.userName,
            identity_number: findUser.identityNumber
        };

        const accessToken = jwt.sign(payloadJwt, process.env.JWT_SECRET_KEY, { expiresIn: '1h'});

        return res.status(200).json({ data: { token: accessToken }});
    } catch (error) {
        return next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        let findAllUsers = await User.find();
        findAllUsers = findAllUsers.map(e => {
            return {
                user_name: e.userName,
                account_number: e.accountNumber,
                email: e.emailAddress,
                identity_number: e.identityNumber
            };
        });
        return res.status(200).json({ data: findAllUsers });
    } catch (error) {
        return next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const schema = Joi.object({
            password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
                .required().error(new Error("password must have 8 characters that includes upper case, lower case, digits, and special characters"))
        });
        let input = req.body;

        try {
            input = await schema.validateAsync(input);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        let findUser = await User.findOne({ emailAddress: req.session.email });
        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(input.password, 12);
        findUser.password = hashedPassword;
        await findUser.save();

        return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        return next(error);
    }
};

exports.removeUser = async (req, res, next) => {
    try {
        let findUser = await User.findOne({ emailAddress: req.session.email });
        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        await findUser.deleteOne({ emailAddress: req.session.email });

        return res.status(200).json({ message: 'User removed successfully' });
    } catch (error) {
        return next(error);
    }
};
