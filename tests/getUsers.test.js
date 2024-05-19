const httpMocks = require('node-mocks-http');
const { getUsers  } = require('../controllers/user');
const User = require('../models/user');

jest.mock('../models/user');

describe('getUsers', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('should return 200 and a list of users', async () => {
        const users = [
            {
                userName: 'user1',
                accountNumber: 123456,
                emailAddress: 'user1@example.com',
                identityNumber: '12345'
            },
            {
                userName: 'user2',
                accountNumber: 654321,
                emailAddress: 'user2@example.com',
                identityNumber: '67890'
            }
        ];

        User.find.mockResolvedValue(users);

        await getUsers(req, res, next);

        expect(User.find).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            data: users.map(e => ({
                user_name: e.userName,
                account_number: e.accountNumber,
                email: e.emailAddress,
                identity_number: e.identityNumber
            }))
        });
    });

    it('should call next with an error if something goes wrong', async () => {
        const error = new Error('Something went wrong');
        User.find.mockRejectedValue(error);

        await getUsers(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
