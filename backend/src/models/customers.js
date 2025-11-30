const db = require("../config/db");

const Customers = {
  getAll: async () => {
    const [rows] = await db.execute("SELECT * FROM customers");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM customers WHERE customer_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO customers (customer_id, name, email, phone, address)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.customer_id,
      data.name,
      data.email,
      data.phone || null,
      data.address || null,
    ]);
    return result;
  },

  update: async (id, data) => {
    const sql = `
      UPDATE customers
      SET name = ?, email = ?, phone = ?, address = ?
      WHERE customer_id = ?
    `;
    const [result] = await db.execute(sql, [
      data.name,
      data.email,
      data.phone || null,
      data.address || null,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute(
      "DELETE FROM customers WHERE customer_id = ?",
      [id]
    );
    return result;
  },
};

module.exports = Customers;
