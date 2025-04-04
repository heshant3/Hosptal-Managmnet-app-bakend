const { addPatient, Login, updatePatientCredentials } = require("./auth");
const {
  addPatientData,
  getAllPatientsData,
  updatePatientData,
  deletePatient,
  getPatientDataById, // Import the new function
} = require("./patientsData");

const resolvers = {
  Mutation: {
    addPatient: async (_, { email, password }) => {
      return await addPatient(email, password);
    },
    Login: async (_, { email, password }) => {
      const response = await Login(email, password);
      response.message = response.patientId
        ? "Login successful!"
        : "Invalid email or password.";
      return response;
    },
    addPatientData: async (
      _,
      { name, address, dob, age, mobile_number, patient_id }
    ) => {
      try {
        const patientData = await addPatientData(
          name,
          address,
          dob,
          age,
          mobile_number,
          patient_id
        );
        return { patientData, message: "Patient data added successfully." };
      } catch (err) {
        return { patientData: null, message: err.message };
      }
    },
    updatePatientData: async (
      _,
      { patient_id, name, address, dob, mobile_number }
    ) => {
      try {
        const updatedPatientData = await updatePatientData(
          patient_id,
          name,
          address,
          dob,
          mobile_number
        );
        return {
          patientData: updatedPatientData,
          message: "Patient data updated successfully.",
        };
      } catch (err) {
        return { patientData: null, message: err.message };
      }
    },
    deletePatient: async (_, { patient_id }) => {
      try {
        const deletedPatient = await deletePatient(patient_id);
        return {
          patient: deletedPatient,
          message: "Patient deleted successfully.",
        };
      } catch (err) {
        return { patient: null, message: err.message };
      }
    },
    updatePatientCredentials: async (_, { patient_id, email, password }) => {
      try {
        const updatedCredentials = await updatePatientCredentials(
          patient_id,
          email,
          password
        );
        return {
          patient: updatedCredentials,
          message: "Patient credentials updated successfully.",
        };
      } catch (err) {
        return { patient: null, message: err.message };
      }
    },
  },
  Query: {
    getAllPatientsData: async () => {
      try {
        return await getAllPatientsData();
      } catch (err) {
        throw new Error("Error fetching patients' data: " + err.message);
      }
    },
    getPatientDataById: async (_, { patient_id }) => {
      try {
        return await getPatientDataById(patient_id);
      } catch (err) {
        throw new Error("Error fetching patient data: " + err.message);
      }
    },
  },
};

module.exports = resolvers;
