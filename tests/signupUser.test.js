const bcrypt = require('bcryptjs');
const httpMocks = require('node-mocks-http');
const { signupUser } = require('../controllers/user');
const User = require('../models/user');

jest.mock('../models/user');
jest.mock('bcryptjs');

describe('signupUser', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('should validate input and return 400 if validation fails', async () => {
        req.body = {
            email: 'invalidemail',
            password: 'password',
            repeat_password: 'password',
            username: 'user',
            identity_number: '12345'
        };

        await signupUser(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            message: 'email not valid'
        });
    });

    it('should return 400 if user already exists', async () => {
        req.body = {
            email: 'test@example.com',
            password: 'Password1!',
            repeat_password: 'Password1!',
            username: 'user123',
            identity_number: '12345'
        };

        User.findOne.mockResolvedValue({ emailAddress: 'test@example.com' });

        await signupUser(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            message: 'User already exists'
        });
    });

    it('should create a new user and return 201', async () => {
        req.body = {
            email: 'test@example.com',
            password: 'Password1!',
            repeat_password: 'Password1!',
            username: 'user123',
            identity_number: '12345'
        };

        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedPassword');
        User.prototype.save = jest.fn().mockResolvedValue({});

        await signupUser(req, res, next);

        expect(User.findOne).toHaveBeenCalledWith({ emailAddress: 'test@example.com' });
        expect(bcrypt.hash).toHaveBeenCalledWith('Password1!', 12);
        expect(User.prototype.save).toHaveBeenCalled();

        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({
            message: 'User created successfully'
        });
    });

    it('should call next with an error if something goes wrong', async () => {
        req.body = {
            email: 'test@example.com',
            password: 'Password1!',
            repeat_password: 'Password1!',
            username: 'user123',
            identity_number: '12345'
        };

        const error = new Error('Something went wrong');
        User.findOne.mockRejectedValue(error);

        await signupUser(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
