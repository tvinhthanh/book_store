const express = require("express");
const router = express.Router();
const Reviews = require("../models/reviews");
const { v4: uuidv4 } = require("uuid");
const { verifyToken } = require("../middleware/auth");

// Public
router.get("/", async (req, res) => {
  res.json(await Reviews.getAll());
});

router.get("/book/:id", async (req, res) => {
  res.json(await Reviews.getByBook(req.params.id));
});

// User
router.post("/", verifyToken, async (req, res) => {
  const id = uuidv4();
  await Reviews.create({ review_id: id, ...req.body });
  res.status(201).json(await Reviews.getById(id));
});

// User sửa review
router.put("/:id", verifyToken, async (req, res) => {
  await Reviews.update(req.params.id, req.body);
  res.json(await Reviews.getById(req.params.id));
});

// User xoá review
router.delete("/:id", verifyToken, async (req, res) => {
  await Reviews.delete(req.params.id);
  res.json({ message: "Review deleted" });
});

module.exports = router;
