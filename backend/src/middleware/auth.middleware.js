
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  try {
    
    const cookie = req.headers?.cookie;
    if (!cookie) {
      console.error("No cookies found in the request.");
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token safely
    const match = cookie.match(/token=([^;]+)/);
    if (!match) {
      console.error("Token not found in cookies.");
      return res.status(401).json({ message: "Token not found in cookies" });
    }
    const token = match[1];

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables.");
      return res.status(500).json({ message: "Internal server error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("🚨 JWT Verification Error:", error);
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = { verifyToken };
