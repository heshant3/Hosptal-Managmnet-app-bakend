const { ApolloServer } = require("apollo-server");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const patientTypeDefs = require("./patients/patientsTypeDefs");
const patientResolvers = require("./patients/patientsResolvers");
const doctorTypeDefs = require("./doctor/doctorTypeDefs");
const doctorResolvers = require("./doctor/doctorResolvers");
const docSchedulesTypeDefs = require("./DocSchedules/DocSchedulesTypeDefs");
const docSchedulesResolvers = require("./DocSchedules/DocSchedulesresolvers");
const appointmentTypeDefs = require("./Appointment/AppointmentTypeDefs");
const appointmentResolvers = require("./Appointment/AppointmentResolvers");
const adminTypeDefs = require("./admin/adminTypeDefs");
const adminResolvers = require("./admin/adminResolvers");

// Merge typeDefs
const typeDefs = mergeTypeDefs([
  patientTypeDefs,
  doctorTypeDefs,
  docSchedulesTypeDefs,
  appointmentTypeDefs, // Added Appointment typeDefs
  adminTypeDefs, // Added Admin typeDefs
]);

// Merge resolvers
const resolvers = {
  Query: {
    ...patientResolvers.Query,
    ...doctorResolvers.Query,
    ...docSchedulesResolvers.Query,
    ...appointmentResolvers.Query, // Added Appointment resolvers for Query
    ...adminResolvers.Query, // Added Admin resolvers for Query
  },
  Mutation: {
    ...patientResolvers.Mutation,
    ...doctorResolvers.Mutation,
    ...docSchedulesResolvers.Mutation,
    ...appointmentResolvers.Mutation, // Added Appointment resolvers for Mutation
    ...adminResolvers.Mutation, // Added Admin resolvers for Mutation
  },
};

// Apollo Server setup
const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({
  schema,
  introspection: true, // Enable introspection for Apollo Studio
  playground: true, // Enable GraphQL Playground
});

// Create HTTP server
server.listen(4000).then(({ url }) => {
  console.log(`Apollo Server is running on ${url}`);
});
