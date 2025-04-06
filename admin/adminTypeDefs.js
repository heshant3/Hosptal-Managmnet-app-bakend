const { gql } = require("apollo-server");

const typeDefs = gql`
  type Admin {
    id: ID
    email: String
    password: String
    created_at: String
  }

  type AdminProfile {
    id: ID
    admin_id: Int
    name: String
    address: String
    mobile: String
  }

  type AddAdminProfileResponse {
    profile: AdminProfile
    message: String
  }

  type UpdateAdminCredentialsResponse {
    admin: Admin
    message: String
  }

  type LoginResponse {
    message: String
    adminId: ID
  }

  type Query {
    getAdminProfile(admin_id: Int!): AdminProfile
    getReferencedPatients(admin_id: Int!): [PatientData]
  }

  type Mutation {
    addAdmin(email: String!, password: String!): Admin
    updateAdminCredentials(
      admin_id: Int!
      email: String
      password: String
    ): UpdateAdminCredentialsResponse
    addAdminProfile(
      admin_id: Int!
      name: String!
      address: String!
      mobile: String!
    ): AddAdminProfileResponse
    Login(email: String!, password: String!): LoginResponse
  }
`;

module.exports = typeDefs;
