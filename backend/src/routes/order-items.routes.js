const express = require("express");
const router = express.Router();
const OrderItems = require("../models/order_items");
const Books = require("../models/books");
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
router.post("/", verifyToken, async (req, res, next) => {
  try {
    // Validate required fields
    if (!req.body.order_id || !req.body.book_id || !req.body.quantity || !req.body.price) {
      return res.status(400).json({ 
        message: "order_id, book_id, quantity, and price are required" 
      });
    }

    // Kiểm tra tồn kho trước khi tạo order item
    const book = await Books.getById(req.body.book_id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const requestedQuantity = Number(req.body.quantity) || 0;
    const currentStock = Number(book.stock_quantity) || 0;

    if (currentStock < requestedQuantity) {
      return res.status(400).json({ 
        message: `Không đủ hàng. Chỉ còn ${currentStock} cuốn trong kho.` 
      });
    }

    // Tạo order item
    const id = uuidv4();
    await OrderItems.create({ order_item_id: id, ...req.body });

    // Trừ số lượng tồn kho
    await Books.decreaseStock(req.body.book_id, requestedQuantity);

    res.json(await OrderItems.getById(id));
  } catch (err) {
    console.error("Error creating order item:", err);
    next(err);
  }
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
