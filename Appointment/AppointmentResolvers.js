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
        available_day,
        session_time,
        reason,
        image_url,
        patient_id,
        patient_name,
        patient_dob,
        patient_phone,
        patient_email, // Added patient_email field
        schedule_id,
        yourTime, // This will now be dynamically calculated
        price, // Added price field
      } = input;

      const appointmentQuery = `
        INSERT INTO "Appointment" (
          doc_id, doc_name, hospital_name, doc_specialist, available_day, session_time,
          appointment_number, reason, image_url, patient_id, patient_name, patient_dob, patient_phone, patient_email, schedule_id, "yourTime", status, price
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *;
      `;

      const getAppointmentNumberQuery = `
        SELECT COUNT(*) + 1 AS appointment_number
        FROM "Appointment"
        WHERE available_day = $1;
      `;

      const getLastYourTimeQuery = `
        SELECT "yourTime"
        FROM "Appointment"
        WHERE available_day = $1
        ORDER BY "yourTime" DESC
        LIMIT 1;
      `;

      const getOnePatientDurationQuery = `
        SELECT "onePatientDuration", "time"
        FROM "DocSchedules"
        WHERE id = $1;
      `;

      try {
        // Start a transaction
        await pool.query("BEGIN");

        // Calculate the appointment number for the given day
        const appointmentNumberResult = await pool.query(
          getAppointmentNumberQuery,
          [available_day]
        );
        const appointment_number =
          appointmentNumberResult.rows[0].appointment_number;

        // Get the onePatientDuration and default start time from the schedule
        const scheduleResult = await pool.query(getOnePatientDurationQuery, [
          schedule_id,
        ]);
        if (scheduleResult.rows.length === 0) {
          throw new Error("Invalid schedule ID.");
        }
        const { onePatientDuration, time: defaultStartTime } =
          scheduleResult.rows[0];

        // Calculate the next available "YourTime"
        const lastYourTimeResult = await pool.query(getLastYourTimeQuery, [
          available_day,
        ]);
        let nextYourTime;
        if (lastYourTimeResult.rows.length === 0) {
          // If no appointments exist for the day, start with the default start time
          nextYourTime = defaultStartTime;
        } else {
          // Increment the last "YourTime" by onePatientDuration
          const lastYourTime = lastYourTimeResult.rows[0].yourTime;
          nextYourTime = await pool.query(
            `SELECT TO_CHAR(
              TO_TIMESTAMP($1, 'HH24:MI') + INTERVAL '1 minute' * $2,
              'HH24:MI'
            ) AS next_time;`,
            [lastYourTime, onePatientDuration]
          );
          nextYourTime = nextYourTime.rows[0].next_time;
        }

        // Insert the appointment
        const appointmentResult = await pool.query(appointmentQuery, [
          doc_id,
          doc_name,
          hospital_name,
          doc_specialist,
          available_day,
          session_time,
          appointment_number, // Use the calculated appointment number
          reason,
          image_url,
          patient_id,
          patient_name,
          patient_dob,
          patient_phone,
          patient_email, // Added patient_email value
          schedule_id,
          nextYourTime, // Use the calculated "YourTime"
          "Confirmed", // Set status to "confirmed"
          price, // Added price value
        ]);

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
    cancelAppointmentById: async (_, { appointment_id }) => {
      const query = `
        UPDATE "Appointment"
        SET status = 'Cancelled'
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
          message: "Appointment canceled successfully.",
        };
      } catch (err) {
        return { appointment: null, message: err.message };
      }
    },
  },
};

module.exports = resolvers;
