const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

const authMiddleware = (req, res, next) => {
    console.log("Headers received:", req.headers);
  
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      res.status(401).json({ message: "Invalid token" });
    }
  };
  

module.exports = authMiddleware;