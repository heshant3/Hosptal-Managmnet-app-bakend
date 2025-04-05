const { gql } = require("apollo-server");

const typeDefs = gql`
  type Doctor {
    id: ID
    email: String
    password: String
    created_at: String
  }

  type DoctorData {
    id: ID
    name: String
    specialization: String
    contact: String
    address: String
    date_of_birth: String
    qualifications: String
    email: String
  }

  type AddDoctorDataResponse {
    doctorData: DoctorData
    message: String
  }

  type DeleteDoctorResponse {
    doctor: Doctor
    message: String
  }

  type LoginDoctorResponse {
    message: String
    doctorId: ID
  }

  type Query {
    getAllDoctorsData: [DoctorData]
    getDoctorDataById(doctor_id: Int!): DoctorData
  }

  type Mutation {
    addDoctor(email: String!, password: String!): Doctor
    LoginDoctor(email: String!, password: String!): LoginDoctorResponse
    addDoctorData(
      name: String!
      specialization: String
      contact: String
      doctor_id: Int
      address: String
      date_of_birth: String
      qualifications: String
    ): AddDoctorDataResponse
    updateDoctorData(
      doctor_id: Int!
      name: String
      specialization: String
      contact: String
      address: String
      date_of_birth: String
      qualifications: String
    ): AddDoctorDataResponse
    deleteDoctor(doctor_id: Int!): DeleteDoctorResponse
    updateDoctorCredentials(
      doctor_id: Int!
      email: String
      password: String
    ): Doctor
  }
`;

module.exports = typeDefs;
