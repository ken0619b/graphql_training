const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({ //what users have
    id: { type: GraphQLString }, //we need to define types for the data
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: GraphQLList(UserType),
      resolve(parentValue, args){
      return axios.get(`http://localhost:4100/companies/${parentValue.id}/users`)
        .then(res => res.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({ //what users have
    id: { type: GraphQLString }, //we need to define types for the data
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt},
    company: {  //assosiationはresolveする
      type: CompanyType,
      resolve(parentValue, args) {
        // console.log(parentValue, args);
        return axios.get(`http://localhost:4100/companies/${parentValue.companyId}`)
        .then(res => res.data);
      }
    }
  })
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
    },
    company: {
      type: CompanyType, //response
      args: { id: { type: GraphQLString } }, //input
      resolve(parentValue, args) {
        // return _.find(users, { id: args.id });
        return axios.get(`http://localhost:4100/companies/${args.id}`)
          .then(response => response.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, {firstName, age, }) {
        return axios.post(`http://localhost:4100/users/`, {
          firstName,
          age
        }).then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, {id}) {
        return axios.delete(`http://localhost:4100/users/${id}`, {
          id
        }).then(res => res.data);
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parentValue, { id, firstName, age, }) {
        return axios.patch(`http://localhost:4100/users/${id}`, {
          firstName,
          age
        }).then(res => res.data);
        //return axios.patch(`http://localhost:4100/users/${id}`, args ).then(res => res.data);
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});

