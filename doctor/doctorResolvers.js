const {
  addDoctor,
  LoginDoctor,
  updateDoctorCredentials,
} = require("./doctorAuth");
const {
  addDoctorData,
  getAllDoctorsData,
  updateDoctorData,
  deleteDoctor,
  getDoctorDataById,
} = require("./doctorData");

const formatDoctorData = (doctorData) => {
  if (doctorData.date_of_birth) {
    doctorData.date_of_birth = new Date(doctorData.date_of_birth)
      .toISOString()
      .split("T")[0];
  }
  return doctorData;
};

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
    addDoctorData: async (
      _,
      {
        name,
        specialization,
        contact,
        doctor_id,
        address,
        date_of_birth,
        qualifications,
      }
    ) => {
      try {
        const doctorData = await addDoctorData(
          name,
          specialization,
          contact,
          doctor_id,
          address,
          date_of_birth,
          qualifications
        );
        return { doctorData, message: "Doctor data added successfully." };
      } catch (err) {
        return { doctorData: null, message: err.message };
      }
    },
    updateDoctorData: async (
      _,
      {
        doctor_id,
        name,
        specialization,
        contact,
        address,
        date_of_birth,
        qualifications,
      }
    ) => {
      try {
        const updatedDoctorData = await updateDoctorData(
          doctor_id,
          name,
          specialization,
          contact,
          address,
          date_of_birth,
          qualifications
        );
        return {
          doctorData: formatDoctorData(updatedDoctorData),
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
    updateDoctorCredentials: async (_, { doctor_id, email, password }) => {
      try {
        const updatedDoctor = await updateDoctorCredentials(
          doctor_id,
          email,
          password
        );
        return updatedDoctor;
      } catch (err) {
        throw new Error("Error updating doctor credentials: " + err.message);
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
        const doctorData = await getDoctorDataById(doctor_id);
        return formatDoctorData(doctorData); // email will now be included
      } catch (err) {
        throw new Error("Error fetching doctor data: " + err.message);
      }
    },
  },
};

module.exports = resolvers;
