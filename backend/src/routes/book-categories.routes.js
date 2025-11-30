const express = require("express");
const router = express.Router();
const BookCategories = require("../models/book_categories");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Public
router.get("/:bookId", async (req, res) => {
  res.json(await BookCategories.getByBook(req.params.bookId));
});

// Admin
router.post("/", verifyToken, isAdmin, async (req, res) => {
  await BookCategories.link(req.body.book_id, req.body.category_id);
  res.json({ message: "Linked" });
});

router.delete("/", verifyToken, isAdmin, async (req, res) => {
  await BookCategories.unlink(req.body.book_id, req.body.category_id);
  res.json({ message: "Unlinked" });
});

module.exports = router;
