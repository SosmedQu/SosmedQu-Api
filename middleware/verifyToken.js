require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (token == null) return res.status(401).json({msg: "Unauthorized"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({msg: "Invalid token"});

        req.email = decoded.email;
        next();
    });
};

module.exports = {verifyToken};
