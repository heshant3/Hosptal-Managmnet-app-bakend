require("dotenv").config();
const pool = require("../db/pool");

// Function to create the doctorData table
async function createDoctorDataTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "doctorData" (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      specialization VARCHAR(255) NOT NULL,
      contact VARCHAR(15) NOT NULL,
      doctor_id INT NOT NULL,
      CONSTRAINT fk_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES "Doctor"(id)
        ON DELETE CASCADE
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Table 'doctorData' with foreign key created successfully.");
  } catch (err) {
    console.error("Error creating 'doctorData' table:", err);
    throw err;
  }
}

// Function to add a doctor's data
async function addDoctorData(name, specialization, contact, doctor_id) {
  const insertQuery = `
    INSERT INTO "doctorData" (name, specialization, contact, doctor_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  try {
    const result = await pool.query(insertQuery, [
      name,
      specialization,
      contact,
      doctor_id,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("Error adding doctor data:", err);
    throw err;
  }
}

// Function to fetch all doctors' data
async function getAllDoctorsData() {
  const selectQuery = `
    SELECT * FROM "doctorData";
  `;
  try {
    const result = await pool.query(selectQuery);
    return result.rows;
  } catch (err) {
    console.error("Error fetching doctors' data:", err);
    throw err;
  }
}

// Function to update a doctor's data
async function updateDoctorData(doctor_id, name, specialization, contact) {
  const updateQuery = `
    UPDATE "doctorData"
    SET name = $1, specialization = $2, contact = $3
    WHERE doctor_id = $4
    RETURNING *;
  `;
  try {
    const result = await pool.query(updateQuery, [
      name,
      specialization,
      contact,
      doctor_id,
    ]);
    if (result.rows.length === 0) {
      throw new Error("No doctor data found for the given doctor_id.");
    }
    return result.rows[0];
  } catch (err) {
    console.error("Error updating doctor data:", err);
    throw err;
  }
}

// Function to delete a doctor and their related data
async function deleteDoctor(doctor_id) {
  const deleteQuery = `
    DELETE FROM "Doctor"
    WHERE id = $1
    RETURNING *;
  `;
  try {
    const result = await pool.query(deleteQuery, [doctor_id]);
    if (result.rows.length === 0) {
      throw new Error("No doctor found for the given doctor_id.");
    }
    return result.rows[0];
  } catch (err) {
    console.error("Error deleting doctor:", err);
    throw err;
  }
}

module.exports = {
  createDoctorDataTable,
  addDoctorData,
  getAllDoctorsData,
  updateDoctorData,
  deleteDoctor,
};
