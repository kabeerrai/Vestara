const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        error: "Access denied. No token provided." 
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.admin = decoded;
    
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid token." 
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        error: "Token expired." 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: "Server error during authentication." 
    });
  }
};

module.exports = authMiddleware;