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
    addAppointment: async (_, { input }) => {
      const {
        doc_id,
        doc_name,
        hospital_name,
        doc_specialist,
        available_day, // Ensure this is treated as a string
        session_time,
        appointment_number,
        reason,
        image_url,
        patient_id,
        patient_name,
        patient_dob,
        patient_phone,
        schedule_id,
        yourTime, // Added yourTime field
      } = input;

      const appointmentQuery = `
        INSERT INTO "Appointment" (
          doc_id, doc_name, hospital_name, doc_specialist, available_day, session_time,
          appointment_number, reason, image_url, patient_id, patient_name, patient_dob, patient_phone, schedule_id, "yourTime"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *;
      `;
      const updateScheduleQuery = `
        UPDATE "DocSchedules"
        SET total_patients = total_patients - 1,
            "YourTime" = (
              SELECT TO_CHAR(
                TO_TIMESTAMP("YourTime", 'HH24:MI') + INTERVAL '1 minute' * "onePatientDuration",
                'HH24:MI'
              )
              FROM "DocSchedules"
              WHERE id = $1
            )
        WHERE id = $1 AND total_patients > 0
        RETURNING total_patients, "YourTime";
      `;
      try {
        // Start a transaction
        await pool.query("BEGIN");

        // Insert the appointment
        const appointmentResult = await pool.query(appointmentQuery, [
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
          schedule_id,
          yourTime, // Pass yourTime to the query
        ]);

        // Update the total_patients and YourTime in DocSchedules
        const scheduleResult = await pool.query(updateScheduleQuery, [
          schedule_id,
        ]);
        if (scheduleResult.rows.length === 0) {
          throw new Error(
            "Failed to update schedule: No patients left or invalid schedule ID."
          );
        }

        // Commit the transaction
        await pool.query("COMMIT");

        return {
          appointment: appointmentResult.rows[0],
          message: `Appointment added successfully.`,
        };
      } catch (err) {
        // Rollback the transaction in case of an error
        await pool.query("ROLLBACK");
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
