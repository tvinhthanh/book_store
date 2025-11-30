const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Authors = require("../models/Authors");

// GET /api/authors
router.get("/", async (req, res, next) => {
  try {
    const data = await Authors.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/authors/:id
router.get("/:id", async (req, res, next) => {
  try {
    const item = await Authors.getById(req.params.id);
    if (!item) return res.status(404).json({ message: "Author not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/authors
router.post("/", async (req, res, next) => {
  try {
    const author_id = uuidv4();
    await Authors.create({ author_id, ...req.body });
    const created = await Authors.getById(author_id);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PUT /api/authors/:id
router.put("/:id", async (req, res, next) => {
  try {
    const exist = await Authors.getById(req.params.id);

    if (!exist) return res.status(404).json({ message: "Author not found" });

    await Authors.update(req.params.id, req.body);
    const updated = await Authors.getById(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/authors/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const exist = await Authors.getById(req.params.id);
    if (!exist) return res.status(404).json({ message: "Author not found" });

    await Authors.delete(req.params.id);
    res.json({ message: "Author deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
