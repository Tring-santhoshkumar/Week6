const express = require('express');
const temp = express();
const db = require('./db');
const port = process.env.PORT || 3000;

// let foods = [{
//     "id": 1,
//     "Name": "Santhosh",
//     "Age" : '21',
//     "College" : 'NEC'
//   },
//   {
//     "id": 2,
//     "Name": "Gokul",
//     "Age" : '22',
//     "College" : 'SJEC'
//   },
//   {
//     "id": 3,
//     "Name": "Dipshy",
//     "Age" : '21',
//     "College" : 'AVV'
//   },{
//    "id": 4,
//     "Name": "Gowreesh",
//     "Age" : '21',
//     "College" : 'SCE'
//   },{
//     'id' : 5,
//     'Name' : 'Sana',
//     'Age' : 21,
//     'College' :  'PSG'
//   }
//   ];

// temp.get('/:id', (req,res) => {
//     // res.write('Hello World From Express!');
//     let foodId = parseInt(req.params.id);
//     let food = foods.find(food => food.id === foodId);
//     res.json(food);
//     res.end();
// })

temp.get('/',(req,res) => {
  res.json('Welcome To Hotel Booking System!!!');
})

temp.get('/rooms',async (req,res) => {
  try{
    const result = await db.query('SELECT * FROM rooms');
    res.json(result.rows);
  }catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error From rooms');
  }
})

temp.get('/books', async (req,res) => {
  try{
    const result = await db.query('SELECT * FROM books');
    res.json(result.rows);
  }catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error From books');
  }
})

temp.get('/rooms/:id', async (req,res) => {
  try{
    const id = parseInt(req.params.id);
    const result = await db.query(`SELECT * FROM rooms WHERE room_id = '${id}'`);
    if(result.rows.length != 0){
      res.json(result.rows);
    }
    else{
      res.status(404).send('No such rooms is available');
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error From roomsId');
  }
})

temp.get('/books/:id', async (req,res) => {
  try{
    const id = parseInt(req.params.id);
    const result = await db.query(`SELECT room_no,books.customer_name,room_type,room_price,books.check_in,books.check_out FROM rooms JOIN books ON rooms.room_id = books.room_id WHERE rooms.room_id = '${id}'`);
    if(result.rows.length != 0){
      res.json(result.rows);
    }
    else{
      res.status(404).send('No bookings for given id.');
    }
  }catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error From booksId');
  }
})

temp.listen(port, () => {
    console.log('Listening in port 3000');
})