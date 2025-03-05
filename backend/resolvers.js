import  db from './db.js';
import jwt from 'jsonwebtoken';
export const resolvers = {
    Query : {
        getUsers : async () => {
            const result = await db.query(`SELECT * FROM users`);
            return result.rows;
        },
        login : async (_req,args) => {
            const result = await db.query(`SELECT * FROM users WHERE email = '${args.email}'`);
            // console.log(result);
            const user = result.rows[0];
            if(result.rows.length == 0){
                throw new Error('User Not Found');
            }
            // const token = jwt.sign({ id: user.id, email: user.email },'santhosh22',{expiresIn : '1h'});
            // return {token, user};
            console.log(user);
            return user;
        },
        getPersonasForUser : async(_req,args) => {
            const result = await db.query(`SELECT * FROM persona WHERE email = '${args.email}'`);
            return result.rows[0];
        }
    },
    Mutation : {
        register : async (_req,args) => {
            const result = await db.query(`INSERT INTO users (name,email,password) VALUES ('${args.name}', '${args.email}', '${args.password}') RETURNING *;`);
            if(args.name && args.email && args.password){
                // console.log('------', result.rows[0], result.rowCount);
                return result.rows[0];
            }
            throw new Error('All Fields are required.');
        },
        addPersona : async (_req,args) => {
            // const user = await ab.query(`SELECT * FROM users WHERE email = '${args.email}'`);
            const newPersona = await db.query(`INSERT INTO persona (email,name,quote,description,challenges,attitude,jobs,activities) VALUES
            ('${args.email}', '${args.name}', '${args.quote}', '${args.description}', '${args.challenges}', '${args.attitude}', '${args.jobs}', '${args.activities}' ) RETURNING *;`)
            return newPersona.rows[0];
        }
    }
}



// export const resolvers = {
//     Query: {
//         // Fetch all users
//         getUsers: async () => {
//             const { rows } = await pool.query("SELECT * FROM users");
//             return rows;
//         },

//         // User login
//         login: async (_parent, { email, password }) => {
//             const { rows } = await pool.query("SELECT * FROM users WHERE email=$1 AND password=$2", [email, password]);
//             if (rows.length === 0) {
//                 throw new Error("Invalid email or password");
//             }
//             return rows[0];
//         },

//         // Fetch all personas of a specific user
//         getPersonasByUser: async (_parent, { userid }) => {
//             const { rows } = await pool.query("SELECT * FROM persona WHERE userid=$1", [userid]);
//             return rows;
//         }
//     },

//     Mutation: {
//         // Register a user
//         register: async (_parent, { name, email, password }) => {
//             const { rows } = await pool.query(
//                 "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
//                 [name, email, password]
//             );
//             return rows[0];
//         },

//         // Add a new persona
//         addPersona: async (_parent, args) => {
//             const { userid, name, quote, description, challenges, attitude, jobs, activities } = args;
//             const { rows } = await pool.query(
//                 "INSERT INTO persona (userid, name, quote, description, challenges, attitude, jobs, activities) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
//                 [userid, name, quote, description, challenges, attitude, jobs, activities]
//             );
//             return rows[0];
//         },

//         // Update a persona
//         updatePersona: async (_parent, { id, ...updates }) => {
//             const keys = Object.keys(updates);
//             const values = Object.values(updates);

//             const setClause = keys.map((key, index) => `${key}=$${index + 1}`).join(", ");
//             const query = `UPDATE persona SET ${setClause} WHERE id=$${keys.length + 1} RETURNING *`;

//             const { rows } = await pool.query(query, [...values, id]);
//             return rows[0];
//         },

//         // Delete a persona
//         deletePersona: async (_parent, { id }) => {
//             const { rowCount } = await pool.query("DELETE FROM persona WHERE id=$1", [id]);
//             return rowCount > 0;
//         }
//     }
// };