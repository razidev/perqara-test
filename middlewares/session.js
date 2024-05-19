const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ message: 'Header authorization required' });
    }

    req.session = jwt.decode(authorization);
    if (!req.session) {
        return res.status(401).json({ message: 'Header authorization not valid' });
    }

    return next();
};
