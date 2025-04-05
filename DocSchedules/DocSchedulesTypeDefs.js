const { gql } = require("apollo-server");

const typeDefs = gql`
  type DocSchedule {
    id: ID
    doctor_id: Int
    hospital_name: String
    total_patients: Int
    day: String
    time: String
    onePatientDuration: Int
    name: String
    specialty: String
    qualifications: String
  }

  type Doctor {
    doctor_id: Int
    name: String
    specialization: String
    qualifications: String
  }

  type DoctorDetails {
    id: ID
    doctor_id: Int
    name: String
    specialty: String
    qualifications: String
    hospital_name: String
    total_patients: Int
    day: String
    time: String
    onePatientDuration: Int
  }

  type AddDocScheduleResponse {
    schedule: DocSchedule
    message: String
  }

  type DeleteDocScheduleResponse {
    schedule: DocSchedule
    message: String
  }

  type Query {
    getAllDocSchedules: [DocSchedule]
    getDocScheduleByDoctorId(doctor_id: Int!): [DocSchedule]
    getAllDoctors: [Doctor]
    getDoctorDetailsById(doctor_id: Int!): [DoctorDetails]
  }

  type Mutation {
    addDocSchedule(
      doctor_id: Int!
      hospital_name: String!
      total_patients: Int!
      day: String!
      time: String!
      onePatientDuration: Int!
    ): AddDocScheduleResponse
    deleteDocSchedule(schedule_id: Int!): DeleteDocScheduleResponse
  }
`;

module.exports = typeDefs;
