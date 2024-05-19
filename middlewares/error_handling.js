module.exports = async function (err, req, res) {
    return res.status(500).json({ message: 'Internal Server Error' });
};