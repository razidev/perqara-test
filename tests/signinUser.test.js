const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');
const { signinUser } = require('../controllers/user');
const User = require('../models/user');

jest.mock('../models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('signinUser', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('should validate input and return 400 if validation fails', async () => {
        req.body = {
            email: 'invalidemail',
            password: 'Password1!'
        };

        await signinUser(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            message: 'email not valid'
        });
    });

    it('should return 400 if user is not found', async () => {
        req.body = {
            email: 'test@example.com',
            password: 'Password1!'
        };

        User.findOne.mockResolvedValue(null);

        await signinUser(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            message: 'Please input the correct email or password'
        });
    });

    it('should return 400 if password does not match', async () => {
        req.body = {
            email: 'test@example.com',
            password: 'Password1!'
        };

        User.findOne.mockResolvedValue({ emailAddress: 'test@example.com', password: 'hashedPassword' });
        bcrypt.compare.mockResolvedValue(false);

        await signinUser(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            message: 'Please input the correct email or password'
        });
    });

    it('should return 200 and token if credentials are correct', async () => {
        req.body = {
            email: 'test@example.com',
            password: 'Password1!'
        };

        const user = {
            _id: 'userId',
            emailAddress: 'test@example.com',
            password: 'hashedPassword',
            userName: 'user123',
            identityNumber: '12345'
        };

        const token = 'mockToken';

        User.findOne.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue(token);

        await signinUser(req, res, next);

        expect(User.findOne).toHaveBeenCalledWith({ emailAddress: 'test@example.com' });
        expect(bcrypt.compare).toHaveBeenCalledWith('Password1!', 'hashedPassword');
        expect(jwt.sign).toHaveBeenCalledWith({
            id: 'userId',
            email: 'test@example.com',
            username: 'user123',
            identity_number: '12345'
        }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            data: { token }
        });
    });

    it('should call next with an error if something goes wrong', async () => {
        req.body = {
            email: 'test@example.com',
            password: 'Password1!'
        };

        const error = new Error('Something went wrong');
        User.findOne.mockRejectedValue(error);

        await signinUser(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
