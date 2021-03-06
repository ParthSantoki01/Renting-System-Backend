const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send({
        msg: "Accsess denied"
    });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.buyer = verified;
        next();
    } catch (err) {
        return res.status(400).json({
            msg: "Please Login again"
        });
    }
}