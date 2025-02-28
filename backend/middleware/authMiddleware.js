// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const authMiddleware = async (req, res, next) => {
//     const token = req.header('Authorization');

//     if (!token) {
//         return res.status(401).json({ message: "Access Denied, No Token Provided" });
//     }

//     try {
//         const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id).select("-password");
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Invalid Token" });
//     }
// };

// module.exports = authMiddleware;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Access Denied, No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;