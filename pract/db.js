const { query } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    user : 'postgres',
    password : 'postgres',
    host :  'localhost',
    database : 'mainTask',
    port : 5432
});

module.exports = {
    query : (text , params) => pool.query(text,params),
};