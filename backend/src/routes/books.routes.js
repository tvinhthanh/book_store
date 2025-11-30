const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { upload, uploadToCloudinary } = require("../middleware/upload");
const Books = require("../models/books");

// GET ALL
router.get("/", async (req, res, next) => {
  try {
    const data = await Books.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET BY ID
router.get("/:id", async (req, res, next) => {
  try {
    const book = await Books.getById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    next(err);
  }
});

// CREATE BOOK (WITH IMAGE)
router.post("/", upload.single("cover_image"), async (req, res, next) => {
  try {
    const id = uuidv4();

    let imageUrl = null;
    if (req.file) {
      const img = await uploadToCloudinary(req.file);
      imageUrl = img.secure_url;
    }

    await Books.create({
      book_id: id,
      ...req.body,
      cover_image: imageUrl,
    });

    const created = await Books.getById(id);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// UPDATE BOOK
router.put("/:id", upload.single("cover_image"), async (req, res, next) => {
  try {
    const exist = await Books.getById(req.params.id);
    if (!exist) return res.status(404).json({ message: "Book not found" });

    let imageUrl = exist.cover_image;

    if (req.file) {
      const img = await uploadToCloudinary(req.file);
      imageUrl = img.secure_url;
    }

    await Books.update(req.params.id, {
      ...req.body,
      cover_image: imageUrl,
    });

    const updated = await Books.getById(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const exist = await Books.getById(req.params.id);
    if (!exist) return res.status(404).json({ message: "Book not found" });

    await Books.delete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
