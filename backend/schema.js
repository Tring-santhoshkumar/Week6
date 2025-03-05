// import { gql } from ('apollo-server-express');

export const typeDefs = `#graphql
    type user {
        name : String!,
        email : String!,
        password : String!
    },
    type persona {
        email : String!,
        name : String!,
        quote : String!
        description : String!
        challenges : String!
        attitude : String!
        jobs : String!
        activities : String!
    },
    type Query{
        getUsers : [user],
        login(email : String!) : user
        getPersonasForUser(email : String!) : [persona]
    },
    type Mutation{
        register(name : String!, email : String!, password : String!) : user
        addPersona(email : String!, name : String!, quote : String!, description : String!, challenges : String!, attitude : String!, jobs : String!, activities : String!) : persona
    }
`


// export const typeDefs = `#graphql
//     type User {
//         id: ID!
//         name: String!
//         email: String!
//         password: String!
//     }

//     type Persona {
//         id: ID!
//         userid: ID!
//         name: String!
//         quote: String!
//         description: String!
//         challenges: String!
//         attitude: String!
//         jobs: String!
//         activities: String!
//     }

//     type Query {
//         getUsers: [User]
//         login(email: String!, password: String!): User
//         getPersonasByUser(userid: ID!): [Persona]
//     }

//     type Mutation {
//         register(name: String!, email: String!, password: String!): User
//         addPersona(userid: ID!, name: String!, quote: String!, description: String!, challenges: String!, attitude: String!, jobs: String!, activities: String!): Persona
//         updatePersona(id: ID!, name: String, quote: String, description: String, challenges: String, attitude: String, jobs: String, activities: String): Persona
//         deletePersona(id: ID!): Boolean
//     }
// `;
