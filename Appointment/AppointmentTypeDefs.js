const { gql } = require("apollo-server");

const typeDefs = gql`
  type Appointment {
    id: ID
    doc_id: Int
    doc_name: String
    hospital_name: String
    doc_specialist: String
    available_day: String
    session_time: String
    appointment_number: Int
    reason: String
    image_url: String
    patient_id: Int
    patient_name: String
    patient_dob: String
    patient_phone: String
    schedule_id: Int
    yourTime: String
    status: String
    price: Int
  }

  type AddAppointmentResponse {
    appointment: Appointment
    message: String
  }

  type DeleteAppointmentResponse {
    appointment: Appointment
    message: String
  }

  type CancelAppointmentsResponse {
    appointments: [Appointment]
    message: String
  }

  type CancelAppointmentResponse {
    appointment: Appointment
    message: String
  }

  type Query {
    getAppointmentsByPatientId(patient_id: Int!): [Appointment]
    getAppointmentsByDoctorId(doc_id: Int!): [Appointment]
  }

  type Mutation {
    addAppointment(input: AddAppointmentInput!): AddAppointmentResponse
    deleteAppointment(appointment_id: Int!): DeleteAppointmentResponse
    cancelAppointmentById(appointment_id: Int!): CancelAppointmentResponse
  }

  input AddAppointmentInput {
    doc_id: Int!
    doc_name: String
    hospital_name: String
    doc_specialist: String
    available_day: String
    session_time: String
    appointment_number: Int
    reason: String
    image_url: String
    patient_id: Int
    patient_name: String
    patient_dob: String
    patient_phone: String
    schedule_id: Int
    yourTime: String
    status: String
    price: Int
  }
`;

module.exports = typeDefs;
