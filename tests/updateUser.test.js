const bcrypt = require('bcryptjs');
const httpMocks = require('node-mocks-http');
const { updateUser } = require('../controllers/user');
const User = require('../models/user');

jest.mock('../models/user');
jest.mock('bcryptjs');

describe('updateUser', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('should validate input and return 400 if validation fails', async () => {
        req.body = { password: 'weakpassword' };
        req.session = { email: 'test@example.com' };

        await updateUser(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            message: 'password must have 8 characters that includes upper case, lower case, digits, and special characters'
        });
    });

    it('should return 404 if user is not found', async () => {
        req.body = { password: 'Password1!' };
        req.session = { email: 'test@example.com' };

        User.findOne.mockResolvedValue(null);

        await updateUser(req, res, next);

        expect(User.findOne).toHaveBeenCalledWith({ emailAddress: 'test@example.com' });
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({
            message: 'User not found'
        });
    });

    it('should update user password and return 200 if user is found', async () => {
        req.body = { password: 'Password1!' };
        req.session = { email: 'test@example.com' };

        const user = {
            emailAddress: 'test@example.com',
            save: jest.fn().mockResolvedValue({})
        };

        User.findOne.mockResolvedValue(user);
        bcrypt.hash.mockResolvedValue('hashedPassword');

        await updateUser(req, res, next);

        expect(User.findOne).toHaveBeenCalledWith({ emailAddress: 'test@example.com' });
        expect(bcrypt.hash).toHaveBeenCalledWith('Password1!', 12);
        expect(user.save).toHaveBeenCalled();
        expect(user.password).toBe('hashedPassword');

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            message: 'User updated successfully'
        });
    });

    it('should call next with an error if something goes wrong', async () => {
        req.body = { password: 'Password1!' };
        req.session = { email: 'test@example.com' };

        const error = new Error('Something went wrong');
        User.findOne.mockRejectedValue(error);

        await updateUser(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
