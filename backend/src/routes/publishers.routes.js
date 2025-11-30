const express = require("express");
const router = express.Router();
const Publishers = require("../models/publishers");
const { v4: uuidv4 } = require("uuid");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Public
router.get("/", async (req, res) => {
  res.json(await Publishers.getAll());
});

router.get("/:id", async (req, res) => {
  res.json(await Publishers.getById(req.params.id));
});

// Admin
router.post("/", verifyToken, isAdmin, async (req, res) => {
  const id = uuidv4();
  await Publishers.create({ publisher_id: id, ...req.body });
  res.status(201).json(await Publishers.getById(id));
});

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  await Publishers.update(req.params.id, req.body);
  res.json(await Publishers.getById(req.params.id));
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  await Publishers.delete(req.params.id);
  res.json({ message: "Publisher deleted" });
});

module.exports = router;
