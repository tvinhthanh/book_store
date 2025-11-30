const db = require("../config/db");

const Reviews = {
  getAll: async () => {
    const [rows] = await db.execute("SELECT * FROM reviews");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute(
      "SELECT * FROM reviews WHERE review_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  getByBook: async (bookId) => {
    const [rows] = await db.execute(
      "SELECT * FROM reviews WHERE book_id = ? ORDER BY created_at DESC",
      [bookId]
    );
    return rows;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO reviews (review_id, book_id, customer_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.review_id,
      data.book_id,
      data.customer_id,
      data.rating,
      data.comment || null,
    ]);
    return result;
  },

  update: async (id, data) => {
    const sql = `
      UPDATE reviews
      SET rating = ?, comment = ?
      WHERE review_id = ?
    `;
    const [result] = await db.execute(sql, [
      data.rating,
      data.comment || null,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute(
      "DELETE FROM reviews WHERE review_id = ?",
      [id]
    );
    return result;
  },
};

module.exports = Reviews;
