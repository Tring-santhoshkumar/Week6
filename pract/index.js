import { ApolloServer } from "@apollo/server";
import { startStandaloneServer} from '@apollo/server/standalone'
import  db from './db.js';
// import express from 'express'
// const api = express()

// let usersData = [{
//     "id": 1,
//     "name": "Santhosh",
//     "age" : 21,
//     "college" : 'NEC'
//   },
//   {
//     "id": 2,
//     "name": "Gokul",
//     "age" : 22,
//     "college" : 'SJEC'
//   },
//   {
//     "id": 3,
//     "name": "Dipshy",
//     "age" : 21,
//     "college" : 'AVV'
//   },{
//    "id": 4,
//     "name": "Gowreesh",
//     "age" : 21,
//     "college" : 'SCE'
//   },{
//     'id' : 5,
//     'name' : 'Sana',
//     'age' : 21,
//     'college' :  'PSG'
//   }
//   ];

const typeDefs = `#graphql
    type user{
        id : ID!,
        name : String!,
        age : Int!,
        college : String!
    },
    type Query{
        users : [user],
        userById(id : ID!) : user!
    },
    type Mutation{
        createUser(name : String!, age : Int!, college : String!) : user,
        updateUser(id : ID!, name : String!, age : Int!, college : String!) : String,
        deleteUser(id : ID!) : String
    },
`
const resolvers = {
    Query : {
        // users : () =>  usersData,
        // userById : (_res,args) => {
        //     const userData = usersData.find( user => user.id == args.id);
        //         if(userData){
        //             return userData;
        //         }
        //         throw new Error("No user Found with matching ID.");
        // }
        users  : async () =>{
            const users = await db.query(`SELECT * FROM users`);
            return users.rows;
        },
        userById : async (_res,args) => {
            const temp = await db.query(`SELECT * FROM users WHERE id = '${args.id}'`);
            if(temp.rows.length != 0){
                return temp.rows[0];
            }
            throw new Error("No user Found with matching ID.");
        }
    },
    Mutation : {
        // createUser : (_res,args) => {
        //     const newUser = { id : args.id,name : args.name , age : args.age, college : args.college};
        //     usersData.push(newUser);
        //     return newUser;
        // },
        // updateUser : (_res,args) => {
        //     const editUser = usersData.find( user => user.id == args.id);
        //         if(editUser){
        //             editUser.name = args.name,
        //             editUser.age = args.age,
        //             editUser.college = args.college
        //             return `Updated user with ID : ${args.id}`;
        //         } 
        //         else{
        //             return "No user Found with matching ID.";
        //         }
        // },
        // deleteUser : (_res,args) => {
        //     const deleteUser = usersData.find( user => user.id == args.id);
        //         if(deleteUser){
        //             const index = usersData.indexOf(deleteUser);
        //             usersData.splice(index,1);
        //             return "Successfully Deleted.";
        //         }
        //         return "No user Found with matching ID.";
        // }
        createUser : async(_res,args) => {
            const newUser = await db.query(`INSERT INTO users (name,age,college) VALUES ('${args.name}', '${args.age}', '${args.college}') RETURNING *`);
            if(args.name && args.age && args.college){
                console.log(newUser.rows[0]);
                return newUser.rows[0];
            }
            throw new Error('All Fields are required.');
        },
        updateUser : async (_req,args) => {
            const editUser = await db.query(`UPDATE users SET name = '${args.name}', age = '${args.age}', college = '${args.college}' WHERE id = '${args.id}' RETURNING *`);
            if(editUser.rows.length != 0){
                return `Updated user with ID : ${args.id}`;
            }
            return "No user Found with matching ID.";
        },
        deleteUser : async (_req,args) => {
            const deleteUser = await db.query(`DELETE FROM users WHERE id = '${args.id}' `);
            if(deleteUser.rowCount > 0){
                return "Successfully Deleted.";
            }
            return "No user Found with matching ID."; 
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})
await startStandaloneServer(server,{
    listen : {port : 3000}
})