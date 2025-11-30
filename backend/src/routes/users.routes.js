const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken, isAdmin } = require("../middleware/auth");

// GET all users (admin)
// api/users/
// get
// post
// put/patch
// delete
router.get("/", verifyToken, isAdmin, async (req, res, next) => {
  try {
    const data = await Users.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
});
// GET current logged in user
router.get("/me", verifyToken, async (req, res, next) => {
  try {
    const user = await Users.getById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id_user: user.id_user,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    });
  } catch (err) {
    next(err);
  }
});
// GET user by id (chỉ admin hoặc chính user)
router.get("/:id", verifyToken, async (req, res, next) => {
  try {
    if (req.userId !== req.params.id && req.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await Users.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

// REGISTER
router.post("/", async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const exist = await Users.getByEmail(email);
    if (exist) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const id_user = uuidv4();

    await Users.create({
      id_user,
      name,
      email,
      password: hashed,
      phone,
      role: role || "user",
    });

    const created = await Users.getById(id_user);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// LOGIN (tạo token + cookie)
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Users.getByEmail(email);
    if (!user)
      return res.status(400).json({ message: "Wrong email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Wrong email or password" });

    const token = jwt.sign(
      { userId: user.id_user, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login success",
      user: {
        id_user: user.id_user,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// LOGOUT
router.post("/logout", verifyToken, (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logged out" });
});

// UPDATE (chỉ admin hoặc chính user)
router.put("/:id", verifyToken, async (req, res, next) => {
  console.log("adâđâ");
  console.log(req);
  try {
    if (req.userId !== req.params.id && req.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const exist = await Users.getById(req.params.id);
    if (!exist) return res.status(404).json({ message: "User not found" });

    await Users.update(req.params.id, req.body);
    const updated = await Users.getById(req.params.id);
    console.log(res.json);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// CHANGE PASSWORD
router.patch("/:id/password", verifyToken, async (req, res, next) => {
  try {
    const { new_password } = req.body;

    if (!new_password)
      return res.status(400).json({ message: "New password required" });

    if (req.userId !== req.params.id && req.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const hashed = await bcrypt.hash(new_password, 10);
    await Users.updatePassword(req.params.id, hashed);

    res.json({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
});

// DELETE USER (admin)
router.delete("/:id", verifyToken, isAdmin, async (req, res, next) => {
  try {
    const exist = await Users.getById(req.params.id);
    if (!exist) return res.status(404).json({ message: "User not found" });

    await Users.delete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
