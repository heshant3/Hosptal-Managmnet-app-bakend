require("dotenv").config(); // Load environment variables from .env

const pool = require("../db/pool");

// Function to add a patient
async function addPatient(email, password) {
  const checkQuery = `
    SELECT * FROM "Patient"
    WHERE email = $1;
  `;
  const insertPatientQuery = `
    INSERT INTO "Patient" (email, password)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const insertPatientDataQuery = `
    INSERT INTO "patientsData" (name, address, dob, age, mobile_number, patient_id)
    VALUES ('', '', NULL, 0, '', $1);
  `;
  try {
    // Check if the email already exists
    const checkResult = await pool.query(checkQuery, [email]);
    if (checkResult.rows.length > 0) {
      throw new Error("This email is already in use.");
    }

    // Insert the new patient
    const patientResult = await pool.query(insertPatientQuery, [
      email,
      password,
    ]);
    const patient = patientResult.rows[0];

    // Insert an empty record into patientsData
    await pool.query(insertPatientDataQuery, [patient.id]);

    return patient;
  } catch (err) {
    console.error("Error adding patient:", err);
    throw err;
  }
}

// Function to sign in a patient
async function Login(email, password) {
  const query = `
    SELECT id, email FROM "Patient"
    WHERE email = $1 AND password = $2;
  `;
  try {
    const result = await pool.query(query, [email, password]);
    return {
      message:
        result.rows.length > 0
          ? "Login successful!"
          : "Invalid email or password.",
      patientId: result.rows.length > 0 ? result.rows[0].id : null,
    };
  } catch (err) {
    throw err;
  }
}

// Function to update patient credentials
async function updatePatientCredentials(patient_id, email, password) {
  const updateQuery = `
    UPDATE "Patient"
    SET email = $1, password = $2
    WHERE id = $3
    RETURNING id, email, password;
  `;
  try {
    const result = await pool.query(updateQuery, [email, password, patient_id]);
    if (result.rows.length === 0) {
      throw new Error("Patient not found or update failed.");
    }
    return result.rows[0];
  } catch (err) {
    console.error("Error updating patient credentials:", err);
    throw err;
  }
}

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
      patient_id INT REFERENCES "Patient"(id)
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Table 'patientsData' created successfully.");
  } catch (err) {
    console.error("Error creating 'patientsData' table:", err);
    throw err;
  }
}

// Call the function to create the table (uncomment to execute)
// createPatientsDataTable();

// GraphQL Resolvers
const resolvers = {
  Mutation: {
    addPatient: async (_, { email, password }) => {
      try {
        const patient = await addPatient(email, password);
        return { patient, message: "Patient added successfully." };
      } catch (err) {
        return { patient: null, message: err.message };
      }
    },
    Login: async (_, { email, password }) => {
      return await Login(email, password);
    },
  },
};

module.exports = {
  addPatient,
  Login,
  createPatientsDataTable,
  updatePatientCredentials,
  resolvers,
};
