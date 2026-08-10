import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    console.log("================================");
    console.log("AUTH REQUEST:", req.method, req.originalUrl);
    console.log("COOKIES RECEIVED:", req.cookies);
    console.log("TOKEN:", req.cookies?.token ? "YES" : "NO");
    console.log("================================");

    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
