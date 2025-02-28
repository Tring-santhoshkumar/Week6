const express = require('express');
const api = express();
const {graphqlHTTP} = require('express-graphql');
const graphql = require('graphql');

let users = [{
    "id": 1,
    "name": "Santhosh",
    "age" : 21,
    "college" : 'NEC'
  },
  {
    "id": 2,
    "name": "Gokul",
    "age" : 22,
    "college" : 'SJEC'
  },
  {
    "id": 3,
    "name": "Dipshy",
    "age" : 21,
    "college" : 'AVV'
  },{
   "id": 4,
    "name": "Gowreesh",
    "age" : 21,
    "college" : 'SCE'
  },{
    'id' : 5,
    'name' : 'Sana',
    'age' : 21,
    'college' :  'PSG'
  }
  ];

const userType = new graphql.GraphQLObjectType({
    name : 'userType',
    fields : () => ({
        id : { type : graphql.GraphQLInt },
        name  : { type : graphql.GraphQLString },
        age : { type : graphql.GraphQLInt },
        college : { type : graphql.GraphQLString }
    })
})

const queryRoot = new graphql.GraphQLObjectType({
    name : 'Query',
    fields : () => ({
        hello : {
            type : graphql.GraphQLString,
            resolve : () => "This is santhosh!"
        },
        getAllUsers : {
            type :  new graphql.GraphQLList(userType),
            resolve : () => users
        },
        getAllUsersById : {
            type : userType,
            args : { id : { type : graphql.GraphQLInt }},
            resolve : (_res,args) => {
                const userData = users.find( user => user.id == args.id);
                if(userData){
                    return userData;
                }
                return "No user Found with matching ID."
            }
        }
    })
})

const mutationRoot = new graphql.GraphQLObjectType({
    name : 'Mutation',
    fields : () => ({
        createUser : {
            type : userType,
            args : { id : { type : graphql.GraphQLInt}, name : { type : graphql.GraphQLString}, age : { type : graphql.GraphQLInt}, college : { type : graphql.GraphQLString}},
            resolve : (_res,args) => {
                const newUser = { id : args.id,name : args.name , age : args.age, college : args.college};
                users.push(newUser);
                return newUser;
            }
        },
        updateUser : {
            type : graphql.GraphQLString,
            args : { id : { type : graphql.GraphQLInt }, name : { type : graphql.GraphQLString}, age : { type : graphql.GraphQLInt}, college : { type : graphql.GraphQLString}},
            resolve : (_res,args) => {
                const editUser = users.find( user => user.id == args.id);
                if(editUser){
                    editUser.name = args.name,
                    editUser.age = args.age,
                    editUser.college = args.college
                    return `Updated user with ID : ${args.id}`;
                } 
                else{
                    return "No user Found with matching ID.";
                }
            }
        },
        deleteUser : {
            type : graphql.GraphQLString,
            args : { id : { type : graphql.GraphQLInt }},
            resolve : (_res,args) => {
                const deleteUser = users.find( user => user.id == args.id);
                if(deleteUser){
                    const index = users.indexOf(deleteUser);
                    users.splice(index,1);
                    return "Successfully Deleted.";
                }
                return "No user Found with matching ID.";
            }
        }
    })
})

const schema = new graphql.GraphQLSchema({
    query : queryRoot,
    mutation : mutationRoot
})
api.use('/api',graphqlHTTP({
    schema : schema,
    graphiql : true
}))

api.listen(3000);