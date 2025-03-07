const jwt = require('jsonwebtoken');
const User = require('../models/User');


// const authMiddleware = (req, res, next) => {
//     console.log("Headers received:", req.headers);
  
//     const token = req.headers.authorization?.split(" ")[1]; // Extract token
//     if (!token) {
//       return res.status(401).json({ message: "No token, authorization denied" });
//     }
  
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;
//       next();
//     } catch (error) {
//       console.error("Auth error:", error.message);
//       res.status(401).json({ message: "Invalid token" });
//     }
//   };
  

const authMiddleware = (req, res, next) => {
  console.log("Headers received:", req.headers);

  const token = req.headers.authorization?.split(" ")[1];
  console.log("Extracted token:", token);

  if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      req.user = { id: decoded.id }; // Ensure correct user ID assignment
      next();
  } catch (error) {
      console.error("Auth error:", error.message);
      res.status(401).json({ message: "Invalid token" });
  }
};


module.exports = authMiddleware;