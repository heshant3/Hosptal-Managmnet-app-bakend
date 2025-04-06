const { addAdmin, updateAdminCredentials, Login } = require("./adminAuth");
const {
  addAdminProfile,
  getAdminProfile,
  getReferencedPatients,
} = require("./adminData");

const resolvers = {
  Mutation: {
    addAdmin: async (_, { email, password }) => {
      return await addAdmin(email, password);
    },
    updateAdminCredentials: async (_, { admin_id, email, password }) => {
      try {
        const updatedAdmin = await updateAdminCredentials(
          admin_id,
          email,
          password
        );
        return {
          admin: updatedAdmin,
          message: "Admin credentials updated successfully.",
        };
      } catch (err) {
        return { admin: null, message: err.message };
      }
    },
    addAdminProfile: async (_, { admin_id, name, address, mobile }) => {
      try {
        const profile = await addAdminProfile(admin_id, name, address, mobile);
        return { profile, message: "Admin profile added successfully." };
      } catch (err) {
        return { profile: null, message: err.message };
      }
    },
    Login: async (_, { email, password }) => {
      try {
        const response = await Login(email, password);
        response.message = response.adminId
          ? "Login successful!"
          : "Invalid email or password.";
        return response;
      } catch (err) {
        return { message: err.message, adminId: null };
      }
    },
  },
  Query: {
    getAdminProfile: async (_, { admin_id }) => {
      try {
        return await getAdminProfile(admin_id);
      } catch (err) {
        throw new Error("Error fetching admin profile: " + err.message);
      }
    },
    getReferencedPatients: async (_, { admin_id }) => {
      try {
        return await getReferencedPatients(admin_id);
      } catch (err) {
        throw new Error("Error fetching referenced patients: " + err.message);
      }
    },
  },
};

module.exports = resolvers;
