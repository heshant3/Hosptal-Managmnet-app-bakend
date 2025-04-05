const { ApolloServer } = require("apollo-server");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const patientTypeDefs = require("./patients/patientsTypeDefs");
const patientResolvers = require("./patients/patientsResolvers");
const doctorTypeDefs = require("./doctor/doctorTypeDefs");
const doctorResolvers = require("./doctor/doctorResolvers");
const docSchedulesTypeDefs = require("./DocSchedules/DocSchedulesTypeDefs");
const docSchedulesResolvers = require("./DocSchedules/DocSchedulesresolvers");

// Merge typeDefs
const typeDefs = mergeTypeDefs([
  patientTypeDefs,
  doctorTypeDefs,
  docSchedulesTypeDefs,
]);

// Merge resolvers
const resolvers = {
  Query: {
    ...patientResolvers.Query,
    ...doctorResolvers.Query,
    ...docSchedulesResolvers.Query,
  },
  Mutation: {
    ...patientResolvers.Mutation,
    ...doctorResolvers.Mutation,
    ...docSchedulesResolvers.Mutation,
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
