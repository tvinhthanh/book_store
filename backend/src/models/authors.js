const db = require("../config/db");


const Authors = {
  getAll: async () => {
    const [rows] = await db.execute("SELECT * FROM authors");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute("SELECT * FROM authors WHERE author_id=?", [
      id,
    ]);
    return rows[0] ?? null;
  },

  create: async (data) => {
    const sql = `INSERT INTO authors (author_id, name, bio, birth_date, country)
                 VALUES (?, ?, ?, ?, ?)`;
    return db.execute(sql, [
      data.author_id,
      data.name,
      data.bio,
      data.birth_date,
      data.country,
    ]);
  },

  update: async (id, d) => {
    const sql = `UPDATE authors SET name=?, bio=?, birth_date=?, country=? WHERE author_id=?`;
    return db.execute(sql, [d.name, d.bio, d.birth_date, d.country, id]);
  },

  delete: async (id) => {
    return db.execute(`DELETE FROM authors WHERE author_id=?`, [id]);
  },
};

module.exports = Authors;
