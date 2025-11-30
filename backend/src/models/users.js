const db = require("../config/db");

const Users = {
  // Lấy tất cả
  getAll: async () => {
    const [rows] = await db.execute(
      "SELECT id_user, name, email, phone, role, created_at FROM users"
    );
    return rows;
  },

  // Lấy theo ID
  getById: async (id) => {
    const [rows] = await db.execute(
      "SELECT id_user, name, email, phone, role, created_at FROM users WHERE id_user = ?",
      [id]
    );
    return rows[0] || null;
  },

  // Lấy theo email (cho login / register)
  getByEmail: async (email) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  },

  // Tạo user mới
  create: async (data) => {
    const sql = `
      INSERT INTO users (id_user, name, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.id_user,
      data.name,
      data.email,
      data.password,
      data.phone || null,
      data.role || "user",
    ]);
    return result;
  },

  // Cập nhật thông tin user
  update: async (id, data) => {
    const sql = `
      UPDATE users
      SET name = COALESCE(?, name),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          role = COALESCE(?, role)
      WHERE id_user = ?
    `;
    const [result] = await db.execute(sql, [
      data.name ?? null,
      data.email ?? null,
      data.phone ?? null,
      data.role ?? null,
      id,
    ]);
    return result;
  },

  // Cập nhật password
  updatePassword: async (id, newPassword) => {
    const [result] = await db.execute(
      "UPDATE users SET password = ? WHERE id_user = ?",
      [newPassword, id]
    );
    return result;
  },

  // Xóa user
  delete: async (id) => {
    const [result] = await db.execute("DELETE FROM users WHERE id_user = ?", [
      id,
    ]);
    return result;
  },
};

module.exports = Users;
