const db = require("../config/db");

const Categories = {
  getAll: async () => {
    const [rows] = await db.execute("SELECT * FROM categories");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM categories WHERE category_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO categories (category_id, name, description)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.category_id,
      data.name,
      data.description || null,
    ]);
    return result;
  },

  update: async (id, data) => {
    const sql = `
      UPDATE categories
      SET name = ?, description = ?
      WHERE category_id = ?
    `;
    const [result] = await db.execute(sql, [
      data.name,
      data.description || null,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute(
      "DELETE FROM categories WHERE category_id = ?",
      [id]
    );
    return result;
  },
};

module.exports = Categories;
