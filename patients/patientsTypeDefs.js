const { gql } = require("apollo-server");

const typeDefs = gql`
  type Patient {
    id: ID
    email: String
    password: String
    created_at: String
  }

  type PatientData {
    id: ID
    name: String
    address: String
    dob: String
    mobile_number: String
  }

  type AddPatientDataResponse {
    patientData: PatientData
    message: String
  }

  type DeletePatientResponse {
    patient: Patient
    message: String
  }

  type LoginResponse {
    message: String
    patientId: ID
  }

  type Query {
    hello: String
    getAllPatientsData: [PatientData]
    getPatientDataById(patient_id: Int!): PatientData
  }

  type Mutation {
    addPatient(email: String!, password: String!): Patient
    Login(email: String!, password: String!): LoginResponse
    addPatientData(
      name: String!
      address: String!
      dob: String!
      age: Int!
      mobile_number: String!
      patient_id: Int!
    ): AddPatientDataResponse
    updatePatientData(
      patient_id: Int!
      name: String!
      address: String!
      dob: String!
      mobile_number: String!
    ): AddPatientDataResponse
    deletePatient(patient_id: Int!): DeletePatientResponse
    updatePatientCredentials(
      patient_id: Int!
      email: String!
      password: String!
    ): DeletePatientResponse
  }
`;

module.exports = typeDefs;
