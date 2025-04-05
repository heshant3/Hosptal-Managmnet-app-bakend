const pool = require("../db/pool");
const { getDoctorBasicInfoById } = require("../doctor/doctorData");

const resolvers = {
  Query: {
    getAllDocSchedules: async () => {
      const query = `
        SELECT ds.*, dd.name, dd.specialization AS specialty, dd.qualifications, ds."YourTime"
        FROM "DocSchedules" ds
        JOIN "doctorData" dd ON ds.doctor_id = dd.id;
      `;
      try {
        const result = await pool.query(query);
        return result.rows;
      } catch (err) {
        throw new Error("Error fetching schedules: " + err.message);
      }
    },
    getDocScheduleByDoctorId: async (_, { doctor_id }) => {
      const query = `SELECT *, "YourTime" FROM "DocSchedules" WHERE doctor_id = $1;`;
      try {
        const result = await pool.query(query, [doctor_id]);
        return result.rows;
      } catch (err) {
        throw new Error("Error fetching schedules: " + err.message);
      }
    },
    getAllDoctors: async () => {
      const query = `
        SELECT id AS doctor_id, name, specialization, qualifications
        FROM "doctorData";
      `;
      try {
        const result = await pool.query(query);
        return result.rows;
      } catch (err) {
        throw new Error("Error fetching doctors: " + err.message);
      }
    },
    getDoctorDetailsById: async (_, { doctor_id }) => {
      const query = `
        SELECT ds.id, ds.doctor_id, dd.name, dd.specialization AS specialty, dd.qualifications,
               ds.hospital_name, ds.total_patients, ds.day, ds.time, ds."onePatientDuration", ds."YourTime"
        FROM "DocSchedules" ds
        JOIN "doctorData" dd ON ds.doctor_id = dd.id
        WHERE ds.doctor_id = $1;
      `;
      try {
        const result = await pool.query(query, [doctor_id]);
        return result.rows;
      } catch (err) {
        throw new Error("Error fetching doctor details: " + err.message);
      }
    },
    getDoctorBasicInfoById: async (_, { doctor_id }) => {
      try {
        return await getDoctorBasicInfoById(doctor_id);
      } catch (err) {
        throw new Error("Error fetching basic doctor info: " + err.message);
      }
    },
  },
  Mutation: {
    addDocSchedule: async (
      _,
      {
        doctor_id,
        hospital_name,
        total_patients,
        day,
        time,
        onePatientDuration,
        YourTime,
      }
    ) => {
      const query = `
        INSERT INTO "DocSchedules" (
          doctor_id, hospital_name, total_patients, day, time, "onePatientDuration", "YourTime"
        )
        VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, $5)) -- Default "YourTime" to "time" if not provided
        RETURNING *;
      `;
      try {
        const result = await pool.query(query, [
          doctor_id,
          hospital_name,
          total_patients,
          day,
          time,
          onePatientDuration,
          YourTime,
        ]);
        return {
          schedule: result.rows[0],
          message: "Schedule added successfully.",
        };
      } catch (err) {
        return { schedule: null, message: err.message };
      }
    },
    deleteDocSchedule: async (_, { schedule_id }) => {
      const query = `
        DELETE FROM "DocSchedules"
        WHERE id = $1
        RETURNING *;
      `;
      try {
        const result = await pool.query(query, [schedule_id]);
        if (result.rows.length === 0) {
          throw new Error("No schedule found with the given ID.");
        }
        return {
          schedule: result.rows[0],
          message: "Schedule deleted successfully.",
        };
      } catch (err) {
        return { schedule: null, message: err.message };
      }
    },
  },
};

module.exports = resolvers;
