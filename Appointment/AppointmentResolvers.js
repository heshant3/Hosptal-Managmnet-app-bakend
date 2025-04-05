const pool = require("../db/pool");

const resolvers = {
  Query: {
    getAppointmentsByPatientId: async (_, { patient_id }) => {
      const query = `
        SELECT * FROM "Appointment"
        WHERE patient_id = $1;
      `;
      try {
        const result = await pool.query(query, [patient_id]);
        return result.rows;
      } catch (err) {
        throw new Error(
          "Error fetching appointments by patient ID: " + err.message
        );
      }
    },
    getAppointmentsByDoctorId: async (_, { doc_id }) => {
      const query = `
        SELECT * FROM "Appointment"
        WHERE doc_id = $1;
      `;
      try {
        const result = await pool.query(query, [doc_id]);
        return result.rows;
      } catch (err) {
        throw new Error(
          "Error fetching appointments by doctor ID: " + err.message
        );
      }
    },
  },
  Mutation: {
    addAppointment: async (
      _,
      {
        doc_id,
        doc_name,
        hospital_name,
        doc_specialist,
        available_day,
        session_time,
        appointment_number,
        reason,
        image_url,
        patient_id,
        patient_name,
        patient_dob,
        patient_phone,
        schedule_id, // Added new field
      }
    ) => {
      const query = `
        INSERT INTO "Appointment" (
          doc_id, doc_name, hospital_name, doc_specialist, available_day, session_time,
          appointment_number, reason, image_url, patient_id, patient_name, patient_dob, patient_phone, schedule_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) -- Updated to include $14
        RETURNING *;
      `;
      try {
        const result = await pool.query(query, [
          doc_id,
          doc_name,
          hospital_name,
          doc_specialist,
          available_day,
          session_time,
          appointment_number,
          reason,
          image_url,
          patient_id,
          patient_name,
          patient_dob,
          patient_phone,
          schedule_id, // Added new field
        ]);
        return {
          appointment: result.rows[0],
          message: "Appointment added successfully.",
        };
      } catch (err) {
        return { appointment: null, message: err.message };
      }
    },
    deleteAppointment: async (_, { appointment_id }) => {
      const query = `
        DELETE FROM "Appointment"
        WHERE id = $1
        RETURNING *;
      `;
      try {
        const result = await pool.query(query, [appointment_id]);
        if (result.rows.length === 0) {
          throw new Error("No appointment found with the given ID.");
        }
        return {
          appointment: result.rows[0],
          message: "Appointment deleted successfully.",
        };
      } catch (err) {
        return { appointment: null, message: err.message };
      }
    },
  },
};

module.exports = resolvers;
