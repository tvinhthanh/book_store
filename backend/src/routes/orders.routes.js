const express = require("express");
const router = express.Router();
const Orders = require("../models/orders");
const OrderItems = require("../models/order_items");
const Customers = require("../models/customers");
const Users = require("../models/users");
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

// User: xem tất cả đơn hàng của mình
router.get("/user/:userId", verifyToken, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    
    // Kiểm tra user chỉ xem đơn của chính mình (trừ admin)
    if (userId !== req.userId && req.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Orders.getByCustomerId(userId);
    
    // Lấy thông tin order items cho mỗi đơn hàng
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItems.getByOrder(order.order_id);
        return { ...order, items };
      })
    );

    res.json(ordersWithItems);
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
    const customer_id = req.body.customer_id || req.userId;
    
    // Kiểm tra customer có tồn tại không, nếu chưa có thì tạo mới
    let customer = await Customers.getById(customer_id);
    if (!customer) {
      // Lấy thông tin user để tạo customer
      const user = await Users.getById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Tạo customer mới với cùng ID với user
      await Customers.create({
        customer_id: req.userId,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        address: req.body.shipping_address || null,
      });
    } else if (req.body.shipping_address) {
      // Cập nhật địa chỉ nếu có
      await Customers.update(customer_id, {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: req.body.shipping_address,
      });
    }

    // Validate required fields
    if (!req.body.total_amount) {
      return res.status(400).json({ message: "total_amount is required" });
    }

    const order_id = uuidv4();
    await Orders.create({ 
      order_id, 
      customer_id,
      status: req.body.status || "pending",
      total_amount: req.body.total_amount,
      payment_method: req.body.payment_method || "cash",
    });

    const created = await Orders.getById(order_id);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating order:", err);
    next(err);
  }
});

// User/Admin update đơn (user có thể hủy đơn của mình)
router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const order = await Orders.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // User chỉ có thể hủy đơn của mình, admin có thể update bất kỳ đơn nào
    if (order.customer_id !== req.userId && req.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // User chỉ có thể hủy đơn (status = cancelled), admin có thể update bất kỳ status nào
    if (req.role !== "admin" && req.body.status && req.body.status !== "cancelled") {
      return res.status(403).json({ message: "You can only cancel your order" });
    }

    // Nếu hủy đơn, hoàn trả lại số lượng tồn kho
    if (req.body.status === "cancelled" && order.status !== "cancelled") {
      const Books = require("../models/books");
      const items = await OrderItems.getByOrder(req.params.id);
      
      for (const item of items) {
        await Books.increaseStock(item.book_id, item.quantity);
      }
    }

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
