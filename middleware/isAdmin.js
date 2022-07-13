const jwt_decode = require("jwt-decode");

const isAdmin = (req, res, next) => {
    const decoded = jwt_decode(req.cookies.accessToken);

    if (decoded.roleId != 1) return res.status(401).json({msg: "Unauthorized"});

    next();
};

module.exports = {isAdmin};
