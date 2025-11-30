const express = require("express");
const router = express.Router();
const OrderItems = require("../models/order_items");
const { v4: uuidv4 } = require("uuid");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Admin
router.get("/", verifyToken, isAdmin, async (req, res) => {
  res.json(await OrderItems.getAll());
});

// User xem item của đơn mình
router.get("/:id", verifyToken, async (req, res) => {
  const data = await OrderItems.getById(req.params.id);
  res.json(data);
});

// User thêm item
router.post("/", verifyToken, async (req, res) => {
  const id = uuidv4();
  await OrderItems.create({ order_item_id: id, ...req.body });
  res.json(await OrderItems.getById(id));
});

// User update item
router.put("/:id", verifyToken, async (req, res) => {
  await OrderItems.update(req.params.id, req.body);
  res.json(await OrderItems.getById(req.params.id));
});

// User xoá item
router.delete("/:id", verifyToken, async (req, res) => {
  await OrderItems.delete(req.params.id);
  res.json({ message: "Item deleted" });
});

module.exports = router;
