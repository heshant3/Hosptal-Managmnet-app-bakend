const pool = require("../db/pool");

async function addAdmin(email, password) {
  const checkQuery = `
    SELECT * FROM "Admin"
    WHERE email = $1;
  `;
  const insertQuery = `
    INSERT INTO "Admin" (email, password)
    VALUES ($1, $2)
    RETURNING *;
  `;
  try {
    const checkResult = await pool.query(checkQuery, [email]);
    if (checkResult.rows.length > 0) {
      throw new Error("This email is already in use.");
    }
    const result = await pool.query(insertQuery, [email, password]);
    return result.rows[0];
  } catch (err) {
    console.error("Error adding admin:", err);
    throw err;
  }
}

async function updateAdminCredentials(admin_id, email, password) {
  const updateQuery = `
    UPDATE "Admin"
    SET email = COALESCE($1, email), password = COALESCE($2, password)
    WHERE id = $3
    RETURNING *;
  `;
  try {
    const result = await pool.query(updateQuery, [email, password, admin_id]);
    if (result.rows.length === 0) {
      throw new Error("No admin found for the given admin_id.");
    }
    return result.rows[0];
  } catch (err) {
    console.error("Error updating admin credentials:", err);
    throw err;
  }
}

async function Login(email, password) {
  const query = `
    SELECT id, email FROM "Admin"
    WHERE email = $1 AND password = $2;
  `;
  try {
    const result = await pool.query(query, [email, password]);
    return {
      message:
        result.rows.length > 0
          ? "Login successful!"
          : "Invalid email or password.",
      adminId: result.rows.length > 0 ? result.rows[0].id : null,
    };
  } catch (err) {
    console.error("Error during admin login:", err);
    throw err;
  }
}

module.exports = {
  addAdmin,
  updateAdminCredentials,
  Login,
};
