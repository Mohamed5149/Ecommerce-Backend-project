const createError = require('http-errors');
const User = require('../models/users');

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) return next(createError(401));
        const payload = await User.decodeToken(authorization);
        if (!payload) return next(createError(401));
        req.user = await User.findById(payload._id);
        next();
    }
    catch (err) {
        next(createError(404));
    }
}