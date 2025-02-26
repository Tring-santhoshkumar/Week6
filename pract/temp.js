const express = require('express');
const temp = express();
const bodyParser = require('body-parser');
const db = require('./db');
const port = process.env.PORT || 3000;
temp.use(bodyParser.json());

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


temp.post('/insert/rooms',async (req,res) => {
  try{
  const {room_no,room_type,room_price} = req.body;
  const result = await db.query(`INSERT INTO rooms (room_no, room_type, room_price) VALUES ($1, $2, $3) RETURNING *;`, [room_no, room_type, room_price]);
  if(room_no && room_price && room_type){
    res.status(200).json(result.rows[0]);
  }
  else{
    res.status(400).send('Room Number,Room type,and Room Price are required.');
  }

}catch (err) {
  console.log(err);
  res.status(500).send('Internal Server Error From Insert Rooms');
}
})


temp.post('/insert/books',async (req,res) => {
  try{
  const {customer_name,room_type,room_price,check_in,check_out} = req.body;
  const result = await db.query(`SELECT book_room($1, $2, $3, $4, $5)`,[customer_name, room_type, room_price, check_in, check_out]);
  // console.log(result.rowCount);
  if(customer_name && room_type && room_price && check_in && check_out){
    res.status(200).json(result.rows[0]);
  }
  else{
    res.status(400).send('customer_name,room_type,check_in,check_out are required.');
  }

}catch (err) {
  console.log(err);
  res.status(500).send('Internal Server Error From Insert Bookings');
}
})


temp.post('/cancel', async (req,res) => {
  try{
    const {book_id , name } = req.body;
    const result = await db.query(`SELECT cancel_room($1, $2)`,[book_id,name]);
    if(book_id && name){
      res.status(200).json(result.rows[0]);
    }
    else{
      res.status(400).send('Id and name are required.');
    }
  }
  catch(err){
    console.log(err);
    res.status(500).send('Internal Server Error From delete');
  }
})



temp.put('/update/:id', async (req,res) => {
  try{
    const id = parseInt(req.params.id);
    const {room_no,room_type,room_price} = req.body;
    const result = await db.query(`UPDATE rooms SET room_no = $1, room_type = $2, room_price = $3 WHERE room_id = $4 RETURNING *;`,
      [room_no, room_type, room_price, id]);
      if(result.rows.length != 0){
        res.status(201).json(result.rows);
      }
      else{
        res.status(404).send('Given id room is not available.');
      }
  }
  catch{
    console.log(err);
    res.status(500).send('Internal Server Error From Update');
  }
})


temp.delete('/delete/:id', async (req,res) => {
  try{
    const id = parseInt(req.params.id);
    const result = await db.query(`DELETE FROM rooms WHERE room_id = '${id}'`);
    if(result.rowCount > 0){
      res.status(200).send('Succesfully Deleted!');
    }
    else{
      res.status(404).send('Given id room is not available.');
    }
  }
  catch(err){
    console.log(err);
    res.status(500).send('Internal Server Error From delete');
  }
})

temp.listen(port, () => {
    console.log('Listening in port 3000');
})