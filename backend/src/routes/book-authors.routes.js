const express = require("express");
const router = express.Router();
const BookAuthors = require("../models/book_authors");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Public
router.get("/:bookId", async (req, res) => {
  res.json(await BookAuthors.getByBook(req.params.bookId));
});

// Admin
router.post("/", verifyToken, isAdmin, async (req, res) => {
  await BookAuthors.link(req.body.book_id, req.body.author_id);
  res.json({ message: "Linked" });
});

router.delete("/", verifyToken, isAdmin, async (req, res) => {
  await BookAuthors.unlink(req.body.book_id, req.body.author_id);
  res.json({ message: "Unlinked" });
});

module.exports = router;
