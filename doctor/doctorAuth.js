require("dotenv").config();
const pool = require("../db/pool");

// Function to add a doctor
async function addDoctor(email, password) {
  const checkQuery = `
    SELECT * FROM "Doctor"
    WHERE email = $1;
  `;
  const insertDoctorQuery = `
    INSERT INTO "Doctor" (email, password)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const insertDoctorDataQuery = `
    INSERT INTO "doctorData" (name, specialization, contact, doctor_id)
    VALUES ('', '', '', $1);
  `;
  try {
    // Check if the email already exists
    const checkResult = await pool.query(checkQuery, [email]);
    if (checkResult.rows.length > 0) {
      throw new Error("This email is already in use.");
    }

    // Insert the new doctor
    const doctorResult = await pool.query(insertDoctorQuery, [email, password]);
    const doctor = doctorResult.rows[0];

    // Insert an empty record into doctorData
    await pool.query(insertDoctorDataQuery, [doctor.id]);

    return doctor;
  } catch (err) {
    console.error("Error adding doctor:", err);
    throw err;
  }
}

// Function to sign in a doctor
async function LoginDoctor(email, password) {
  const query = `
    SELECT id, email FROM "Doctor"
    WHERE email = $1 AND password = $2;
  `;
  try {
    const result = await pool.query(query, [email, password]);
    return {
      message:
        result.rows.length > 0
          ? "Login successful!"
          : "Invalid email or password.",
      doctorId: result.rows.length > 0 ? result.rows[0].id : null,
    };
  } catch (err) {
    throw err;
  }
}

// Function to create the doctor table
async function createDoctorTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "Doctor" (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Table 'Doctor' created successfully.");
  } catch (err) {
    console.error("Error creating 'Doctor' table:", err);
    throw err;
  }
}

module.exports = { addDoctor, LoginDoctor, createDoctorTable };
