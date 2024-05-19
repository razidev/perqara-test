const httpMocks = require('node-mocks-http');
const { removeUser } = require('../controllers/user');
const User = require('../models/user');

jest.mock('../models/user');

describe('removeUser', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('should return 404 if user is not found', async () => {
        req.session = { email: 'test@example.com' };

        User.findOne.mockResolvedValue(null);

        await removeUser(req, res, next);

        expect(User.findOne).toHaveBeenCalledWith({ emailAddress: 'test@example.com' });
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({
            message: 'User not found'
        });
    });

    it('should remove user and return 200 if user is found', async () => {
        req.session = { email: 'test@example.com' };

        const user = {
            emailAddress: 'test@example.com',
            deleteOne: jest.fn().mockResolvedValue({})
        };

        User.findOne.mockResolvedValue(user);

        await removeUser(req, res, next);

        expect(User.findOne).toHaveBeenCalledWith({ emailAddress: 'test@example.com' });
        expect(user.deleteOne).toHaveBeenCalledWith({ emailAddress: 'test@example.com' });

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            message: 'User removed successfully'
        });
    });

    it('should call next with an error if something goes wrong', async () => {
        req.session = { email: 'test@example.com' };

        const error = new Error('Something went wrong');
        User.findOne.mockRejectedValue(error);

        await removeUser(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
