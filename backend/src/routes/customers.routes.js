const express = require("express");
const router = express.Router();
const Customers = require("../models/customers");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Admin
router.get("/", verifyToken, isAdmin, async (req, res, next) => {
  try {
    const data = await Customers.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Owner + Admin
router.get("/:id", verifyToken, async (req, res, next) => {
  try {
    if (req.userId !== req.params.id && req.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const item = await Customers.getById(req.params.id);
    if (!item) return res.status(404).json({ message: "Customer not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Owner + Admin
router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    if (req.userId !== req.params.id && req.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    await Customers.update(req.params.id, req.body);
    const updated = await Customers.getById(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Admin
router.delete("/:id", verifyToken, isAdmin, async (req, res, next) => {
  try {
    await Customers.delete(req.params.id);
    res.json({ message: "Customer deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
