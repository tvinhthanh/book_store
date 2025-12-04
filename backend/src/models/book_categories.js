const db = require("../config/db");

const BookCategories = {
  getByBook: async (bookId) => {
    const [rows] = await db.execute(
      "SELECT * FROM book_categories WHERE book_id = ?",
      [bookId]
    );
    return rows;
  },

  getBooksByCategory: async (categoryId) => {
    const [rows] = await db.execute(
      `
        SELECT b.*
        FROM books b
        INNER JOIN book_categories bc ON bc.book_id = b.book_id
        WHERE bc.category_id = ?
      `,
      [categoryId]
    );
    return rows;
  },

  link: async (bookId, categoryId) => {
    const sql = `
      INSERT IGNORE INTO book_categories (book_id, category_id)
      VALUES (?, ?)
    `;
    const [result] = await db.execute(sql, [bookId, categoryId]);
    return result;
  },

  unlink: async (bookId, categoryId) => {
    const [result] = await db.execute(
      "DELETE FROM book_categories WHERE book_id = ? AND category_id = ?",
      [bookId, categoryId]
    );
    return result;
  },
};

module.exports = BookCategories;
