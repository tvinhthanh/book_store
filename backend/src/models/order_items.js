const db = require("../config/db");

const OrderItems = {
  getAll: async () => {
    const [rows] = await db.execute("SELECT * FROM order_items");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM order_items WHERE order_item_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  getByOrder: async (orderId) => {
    const [rows] = await db.execute(
      "SELECT * FROM order_items WHERE order_id = ?",
      [orderId]
    );
    return rows;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO order_items (order_item_id, order_id, book_id, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.order_item_id,
      data.order_id,
      data.book_id,
      data.quantity,
      data.price,
    ]);
    return result;
  },

  update: async (id, data) => {
    const sql = `
      UPDATE order_items
      SET order_id = ?, book_id = ?, quantity = ?, price = ?
      WHERE order_item_id = ?
    `;
    const [result] = await db.execute(sql, [
      data.order_id,
      data.book_id,
      data.quantity,
      data.price,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute(
      "DELETE FROM order_items WHERE order_item_id = ?",
      [id]
    );
    return result;
  },
};

module.exports = OrderItems;
