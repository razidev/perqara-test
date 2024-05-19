const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - username
 *         - identity_number
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           default: Tester123!
 *           format: password
 *         repeat_password:
 *           type: string
 *           default: Tester123!
 *           format: password
 *         username:
 *           type: string
 *           default: perqara
 *           minLength: 3
 *           maxLength: 15
 *         identity_number:
 *           type: string
 *           default: 123124343442
 *     UserResponse:
 *       type: object
 *       properties:
 *         user_name:
 *           type: string
 *         account_number:
 *           type: number
 *         email:
 *           type: string
 *           format: email
 *         identity_number:
 *           type: string
 */

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    identityNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);
