const db = require("../config/db");


const BookAuthors = {
  getByBook: async (bookId) => {
    const [rows] = await db.execute(
      "SELECT * FROM book_authors WHERE book_id = ?",
      [bookId]
    );
    return rows;
  },

  link: async (bookId, authorId) => {
    const sql = `
      INSERT IGNORE INTO book_authors (book_id, author_id)
      VALUES (?, ?)
    `;
    const [result] = await db.execute(sql, [bookId, authorId]);
    return result;
  },

  unlink: async (bookId, authorId) => {
    const [result] = await db.execute(
      "DELETE FROM book_authors WHERE book_id = ? AND author_id = ?",
      [bookId, authorId]
    );
    return result;
  },
};

module.exports = BookAuthors;
