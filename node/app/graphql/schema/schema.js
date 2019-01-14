const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: { //what users have
    id: { type: GraphQLString }, //we need to define types for the data
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: { //what users have
    id: { type: GraphQLString }, //we need to define types for the data
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt},
    company: { 
      type: CompanyType
    }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType, //response
      args: { id: { type: GraphQLString } }, //input
      resolve(parentValue, args) {
        // return _.find(users, { id: args.id });
        return axios.get(`http://localhost:4100/users/${args.id}`)
        .then(response => response.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});

