const db = require("../config/db");

const Orders = {
  getAll: async () => {
    const [rows] = await db.execute("SELECT * FROM orders");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute("SELECT * FROM orders WHERE order_id = ?", [
      id,
    ]);
    return rows[0] || null;
  },

  getByCustomerId: async (customerId) => {
    const [rows] = await db.execute(
      "SELECT * FROM orders WHERE customer_id = ? ORDER BY order_date DESC",
      [customerId]
    );
    return rows;
  },

  create: async (data) => {
    // Kiểm tra xem bảng có cột created_at không, nếu có thì thêm vào
    const sql = `
      INSERT INTO orders (order_id, customer_id, status, total_amount, payment_method)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.order_id,
      data.customer_id,
      data.status || "pending",
      data.total_amount,
      data.payment_method || "cash",
    ]);
    return result;
  },

  update: async (id, data) => {
    const sql = `
      UPDATE orders
      SET customer_id = ?, status = ?, total_amount = ?, payment_method = ?
      WHERE order_id = ?
    `;
    const [result] = await db.execute(sql, [
      data.customer_id,
      data.status,
      data.total_amount,
      data.payment_method,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute("DELETE FROM orders WHERE order_id = ?", [
      id,
    ]);
    return result;
  },
};

module.exports = Orders;
