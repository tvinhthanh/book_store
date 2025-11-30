const jwt = require("jsonwebtoken");

// Kiểm tra xem user có đăng nhập không
function verifyToken(req, res, next) {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  });
}

// Chỉ admin mới được dùng
function isAdmin(req, res, next) {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

module.exports = { verifyToken, isAdmin };
