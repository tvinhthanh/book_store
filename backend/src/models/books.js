const db = require("../config/db");

const Books = {
  getAll: async () => {
    const [rows] = await db.execute("SELECT * FROM books");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute("SELECT * FROM books WHERE book_id = ?", [
      id,
    ]);
    return rows[0] || null;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO books
      (book_id, title, isbn, description, price, stock_quantity,
       publisher_id, published_date, language, cover_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.book_id,
      data.title,
      data.isbn || null,
      data.description || null,
      data.price,
      data.stock_quantity ?? 0,
      data.publisher_id || null,
      data.published_date || null,
      data.language || null,
      data.cover_image || null,
    ];
    const [result] = await db.execute(sql, params);
    return result;
  },

  update: async (id, data) => {
    const sql = `
      UPDATE books
      SET title = ?, isbn = ?, description = ?, price = ?, stock_quantity = ?,
          publisher_id = ?, published_date = ?, language = ?, cover_image = ?
      WHERE book_id = ?
    `;
    const params = [
      data.title,
      data.isbn || null,
      data.description || null,
      data.price,
      data.stock_quantity ?? 0,
      data.publisher_id || null,
      data.published_date || null,
      data.language || null,
      data.cover_image || null,
      id,
    ];
    const [result] = await db.execute(sql, params);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute("DELETE FROM books WHERE book_id = ?", [
      id,
    ]);
    return result;
  },
};

module.exports = Books;
