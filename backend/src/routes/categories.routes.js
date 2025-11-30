const express = require("express");
const router = express.Router();
const Categories = require("../models/categories");
const { v4: uuidv4 } = require("uuid");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Public
router.get("/", async (req, res, next) => {
  try {
    const data = await Categories.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Public
router.get("/:id", async (req, res, next) => {
  try {
    const item = await Categories.getById(req.params.id);
    if (!item) return res.status(404).json({ message: "Category not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Admin
router.post("/", verifyToken, isAdmin, async (req, res, next) => {
  try {
    const category_id = uuidv4();
    await Categories.create({ category_id, ...req.body });
    const created = await Categories.getById(category_id);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// Admin
router.put("/:id", verifyToken, isAdmin, async (req, res, next) => {
  try {
    await Categories.update(req.params.id, req.body);
    const updated = await Categories.getById(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Admin
router.delete("/:id", verifyToken, isAdmin, async (req, res, next) => {
  try {
    await Categories.delete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
