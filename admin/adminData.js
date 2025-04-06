const pool = require("../db/pool");

async function addAdminProfile(admin_id, name, address, mobile) {
  const insertQuery = `
    INSERT INTO "AdminProfile" (admin_id, name, address, mobile)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  try {
    const result = await pool.query(insertQuery, [
      admin_id,
      name,
      address,
      mobile,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("Error adding admin profile:", err);
    throw err;
  }
}

async function getAdminProfile(admin_id) {
  const query = `
    SELECT * FROM "AdminProfile"
    WHERE admin_id = $1;
  `;
  try {
    const result = await pool.query(query, [admin_id]);
    if (result.rows.length === 0) {
      throw new Error("No profile found for the given admin_id.");
    }
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    throw err;
  }
}

async function getReferencedPatients(admin_id) {
  const query = `
    SELECT pd.*
    FROM "patientsData" pd
    JOIN "AdminPatients" ap ON pd.patient_id = ap.patient_id
    WHERE ap.admin_id = $1;
  `;
  try {
    const result = await pool.query(query, [admin_id]);
    return result.rows;
  } catch (err) {
    console.error("Error fetching referenced patients:", err);
    throw err;
  }
}

module.exports = {
  addAdminProfile,
  getAdminProfile,
  getReferencedPatients,
};
