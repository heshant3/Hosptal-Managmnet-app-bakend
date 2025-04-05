require("dotenv").config(); // Load environment variables from .env

const pool = require("../db/pool");

// Function to create the patientsData table
async function createPatientsDataTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "patientsData" (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      dob DATE NOT NULL,
      age INT NOT NULL,
      mobile_number VARCHAR(15) NOT NULL,
      patient_id INT NOT NULL,
      CONSTRAINT fk_patient
        FOREIGN KEY (patient_id)
        REFERENCES "Patient"(id)
        ON DELETE CASCADE
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Table 'patientsData' with foreign key created successfully.");
  } catch (err) {
    console.error("Error creating 'patientsData' table:", err);
    throw err;
  }
}

// Function to add a patient's data
async function addPatientData(name, address, dob, age, mobile_number) {
  const insertQuery = `
    INSERT INTO "patientsData" (name, address, dob, age, mobile_number)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  try {
    const result = await pool.query(insertQuery, [
      name,
      address,
      dob,
      age,
      mobile_number,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("Error adding patient data:", err);
    throw err;
  }
}

// Function to fetch all patients' data
async function getAllPatientsData() {
  const selectQuery = `
    SELECT id, name, address, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, mobile_number, patient_id
    FROM "patientsData";
  `;
  try {
    const result = await pool.query(selectQuery);
    return result.rows;
  } catch (err) {
    console.error("Error fetching patients' data:", err);
    throw err;
  }
}

// Function to update a patient's data
async function updatePatientData(
  patient_id,
  name,
  address,
  dob,
  mobile_number
) {
  const updateQuery = `
    UPDATE "patientsData"
    SET name = $1, address = $2, dob = CAST($3 AS DATE), age = DATE_PART('year', AGE(CAST($3 AS DATE))), mobile_number = $4
    WHERE patient_id = $5
    RETURNING id, name, address, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, mobile_number;
  `;
  try {
    const result = await pool.query(updateQuery, [
      name,
      address,
      dob,
      mobile_number,
      patient_id,
    ]);
    if (result.rows.length === 0) {
      throw new Error("No patient data found for the given patient_id.");
    }
    return result.rows[0];
  } catch (err) {
    console.error("Error updating patient data:", err);
    throw err;
  }
}

// Function to delete a patient and their related data
async function deletePatient(patient_id) {
  const deleteQuery = `
    DELETE FROM "Patient"
    WHERE id = $1
    RETURNING *;
  `;
  try {
    const result = await pool.query(deleteQuery, [patient_id]);
    if (result.rows.length === 0) {
      throw new Error("No patient found for the given patient_id.");
    }
    return result.rows[0];
  } catch (err) {
    console.error("Error deleting patient:", err);
    throw err;
  }
}

// Function to fetch patient data by ID
async function getPatientDataById(patient_id) {
  const query = `
    SELECT pd.id, pd.name, pd.address, TO_CHAR(pd.dob, 'YYYY-MM-DD') AS dob, pd.age, pd.mobile_number, p.email
    FROM "patientsData" pd
    JOIN "Patient" p ON pd.patient_id = p.id
    WHERE pd.patient_id = $1;
  `;
  try {
    const result = await pool.query(query, [patient_id]);
    if (result.rows.length === 0) {
      throw new Error("No patient data found for the given patient_id.");
    }
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching patient data by ID:", err);
    throw err;
  }
}

module.exports = {
  createPatientsDataTable,
  addPatientData,
  getAllPatientsData,
  updatePatientData,
  deletePatient,
  getPatientDataById,
};
