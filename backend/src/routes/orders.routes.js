const express = require("express");
const router = express.Router();
const Orders = require("../models/orders");
const OrderItems = require("../models/order_items");
const { v4: uuidv4 } = require("uuid");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Admin: xem tất cả đơn
router.get("/", verifyToken, isAdmin, async (req, res, next) => {
  try {
    const data = await Orders.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// User xem đơn của mình
router.get("/:id", verifyToken, async (req, res, next) => {
  try {
    const order = await Orders.getById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.customer_id !== req.userId && req.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const items = await OrderItems.getByOrder(req.params.id);
    res.json({ ...order, items });
  } catch (err) {
    next(err);
  }
});

// User tạo đơn
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const order_id = uuidv4();
    await Orders.create({ order_id, ...req.body });

    const created = await Orders.getById(order_id);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// Admin update đơn
router.put("/:id", verifyToken, isAdmin, async (req, res, next) => {
  try {
    await Orders.update(req.params.id, req.body);
    const updated = await Orders.getById(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Admin xoá đơn
router.delete("/:id", verifyToken, isAdmin, async (req, res, next) => {
  try {
    await Orders.delete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
