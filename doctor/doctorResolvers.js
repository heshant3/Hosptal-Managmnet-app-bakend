const { addDoctor, LoginDoctor } = require("./doctorAuth");
const {
  addDoctorData,
  getAllDoctorsData,
  updateDoctorData,
  deleteDoctor,
  getDoctorDataById,
} = require("./doctorData");

const resolvers = {
  Mutation: {
    addDoctor: async (_, { email, password }) => {
      return await addDoctor(email, password);
    },
    LoginDoctor: async (_, { email, password }) => {
      const response = await LoginDoctor(email, password);
      response.message = response.doctorId
        ? "Login successful!"
        : "Invalid email or password.";
      return response;
    },
    addDoctorData: async (_, { name, specialization, contact, doctor_id }) => {
      try {
        const doctorData = await addDoctorData(
          name,
          specialization,
          contact,
          doctor_id
        );
        return { doctorData, message: "Doctor data added successfully." };
      } catch (err) {
        return { doctorData: null, message: err.message };
      }
    },
    updateDoctorData: async (
      _,
      { doctor_id, name, specialization, contact }
    ) => {
      try {
        const updatedDoctorData = await updateDoctorData(
          doctor_id,
          name,
          specialization,
          contact
        );
        return {
          doctorData: updatedDoctorData,
          message: "Doctor data updated successfully.",
        };
      } catch (err) {
        return { doctorData: null, message: err.message };
      }
    },
    deleteDoctor: async (_, { doctor_id }) => {
      try {
        const deletedDoctor = await deleteDoctor(doctor_id);
        return {
          doctor: deletedDoctor,
          message: "Doctor deleted successfully.",
        };
      } catch (err) {
        return { doctor: null, message: err.message };
      }
    },
  },
  Query: {
    getAllDoctorsData: async () => {
      try {
        return await getAllDoctorsData();
      } catch (err) {
        throw new Error("Error fetching doctors' data: " + err.message);
      }
    },
    getDoctorDataById: async (_, { doctor_id }) => {
      try {
        return await getDoctorDataById(doctor_id);
      } catch (err) {
        throw new Error("Error fetching doctor data: " + err.message);
      }
    },
  },
};

module.exports = resolvers;
