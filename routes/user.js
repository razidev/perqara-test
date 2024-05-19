const express = require('express');
const userController = require('../controllers/user');
const errorHandlingMiddleware = require('../middlewares/error_handling');
const sessionMiddleware = require('../middlewares/session');
const router = express.Router();
 
/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Signup a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post('/signup', userController.signupUser);

/**
 * @swagger
 * /user/signin:
 *   post:
 *     summary: Signin a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
  *           schema:
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 default: Tester123!
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       400:
 *         description: Please input the correct email or password
 *       500:
 *         description: Internal server error
 */
router.post('/signin', userController.signinUser);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/', [sessionMiddleware], userController.getUsers);

/**
 * @swagger
 * /user/update-password:
 *   put:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/update-password', [sessionMiddleware], userController.updateUser);

/**
 * @swagger
 * /user/remove:
 *   delete:
 *     summary: Remove a user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User removed successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/remove', [sessionMiddleware], userController.removeUser);

router.use(errorHandlingMiddleware);

module.exports = router;
