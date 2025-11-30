const db = require("../config/db");

const Publishers = {
  getAll: async () => {
    const [rows] = await db.execute("SELECT * FROM publishers");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM publishers WHERE publisher_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO publishers (publisher_id, name, address, email, phone)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.publisher_id,
      data.name,
      data.address || null,
      data.email || null,
      data.phone || null,
    ]);
    return result;
  },

  update: async (id, data) => {
    const sql = `
      UPDATE publishers
      SET name = ?, address = ?, email = ?, phone = ?
      WHERE publisher_id = ?
    `;
    const [result] = await db.execute(sql, [
      data.name,
      data.address || null,
      data.email || null,
      data.phone || null,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute(
      "DELETE FROM publishers WHERE publisher_id = ?",
      [id]
    );
    return result;
  },
};

module.exports = Publishers;
