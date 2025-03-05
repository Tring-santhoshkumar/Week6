const express = require('express');
const temp = express();
const bodyParser = require('body-parser');
const db = require('./db');
const port = process.env.PORT || 3000;
temp.use(bodyParser.json());

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

  temp.get('/users', (_req,res) => {
    res.status(200).json(users);
  })

  temp.get('/users/:id', (req,res) => {
    // res.write('Hello World From Express!');
    const userId = parseInt(req.params.id);
    const userData = users.find(user => user.id == userId);
    if(userData){
      res.status(200).json(userData);
    }
    else{
      res.status(404).send('No Id matches with the users.');
    }
  })

  temp.post('/insertUsers', (req,res) => {
    const {id,name,age,college} = req.body;
    const newData = {'id': id,'name' : name,'age' : age,'college' : college};
    users.push(newData);
    if(id && name && age && college){
      res.status(201).json(newData);
    }
    else{
      res.status(404).send('All Fields are required.');
    }
  })

  temp.put('/updateUsers/:id',(req,res) => {
    const userId = parseInt(req.params.id);
    const {id,name,age,college} = req.body;
    const userData = users.find(user => user.id == userId);
    if(userData){
      userData.id = id; userData.name = name; userData.age = age; userData.college = college;
      res.status(200).json(userData);
    }
    else{
      res.status(404).send('No Id matches with the users.');
    }
  })

  temp.delete('/deleteUsers/:id',(req,res) => {
    const userId = parseInt(req.params.id);
    const userData = users.find(user => user.id == userId);
    if(userData){
      const index = users.indexOf(userData);
      users.splice(index,1);
      res.status(200).send('Successfully deleted!');
    }
    else{
      res.status(404).send('No Id matches with users.');
    }
  })










temp.get('/',(req,res) => {
  res.json('Welcome To Hotel Booking System!!!');
})

//Displaying Rooms
temp.get('/rooms',async (req,res) => {
  try{
    const result = await db.query('SELECT * FROM rooms');
    res.json(result.rows);
  }catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error From rooms');
  }
})

//Displaying Bookings
temp.get('/books', async (req,res) => {
  try{
    const result = await db.query('SELECT * FROM books');
    res.json(result.rows);
  }catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error From books');
  }
})

//Displaying the rooms based on room Id
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

//Displaying Bookings Based on room Id with using joins
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

//Inserting new room
temp.post('/insert/rooms',async (req,res) => {
  try{
  const {room_no,room_type,room_price} = req.body;
  const result = await db.query(`INSERT INTO rooms (room_no, room_type, room_price) VALUES ('${room_no}', '${room_type}', '${room_price}') RETURNING *;`);
  if(room_no && room_price && room_type){
    res.status(201).json(result.rows[0]);
  }
  else{
    res.status(400).send('Room Number,Room type,and Room Price are required.');
  }

}catch (err) {
  console.log(err);
  res.status(500).send('Internal Server Error From Insert Rooms');
}
})

//Inserting new bookings by using custom functions
temp.post('/insert/books',async (req,res) => {
  try{
  const {customer_name,room_type,room_price,check_in,check_out} = req.body;
  const result = await db.query(`SELECT book_room('${customer_name}', '${room_type}', '${room_price}', '${check_in}', '${check_out}');`);
  // console.log(result.rowCount);
  if(customer_name && room_type && room_price && check_in && check_out){
    res.status(201).json(result.rows[0]);
  }
  else{
    res.status(400).send('customer_name,room_type,check_in,check_out are required.');
  }

}catch (err) {
  console.log(err);
  res.status(500).send('Internal Server Error From Insert Bookings');
}
})

//Cancelling bookings by using custom functions
temp.post('/cancel', async (req,res) => {
  try{
    const {book_id , name } = req.body;
    const result = await db.query(`SELECT cancel_room('${book_id}', '${name}');`);
    if(book_id && name){
      res.status(202).json(result.rows[0]);
    }
    else{
      res.status(400).send('Id and name are required.');
    }
  }
  catch(err){
    console.log(err);
    res.status(500).send('Internal Server Error From Cancel');
  }
})


//Updating rooms details by room_id
temp.put('/update/rooms/:id', async (req,res) => {
  try{
    const id = parseInt(req.params.id);
    const {room_no,room_type,room_price} = req.body;
    const result = await db.query(`UPDATE rooms SET room_no = '${room_no}', room_type = '${room_type}', room_price = '${room_price}' WHERE room_id = '${id}' RETURNING *;`);
      if(result.rows.length != 0){
        res.status(202).json(result.rows);
      }
      else{
        res.status(404).send('Given id room is not available.');
      }
  }
  catch{
    console.log(err);
    res.status(500).send('Internal Server Error From Update Rooms.');
  }
})

//Updating bookings details by book_id
temp.put('/update/books/:id', async (req,res) => {
  try{
    const id = parseInt(req.params.id);
    const {customer_name,check_in,check_out} = req.body;
    const result = await db.query(`UPDATE books SET customer_name = '${customer_name}', check_in = '${check_in}', check_out = '${check_out}' WHERE book_id = '${id}' RETURNING *;`);
    if(result.rows.length != 0){
      res.status(202).json(result.rows);
    }
    else{
      res.status(404).send('Given id booking is not available.');
    }
  }
  catch{
    res.status(500).send('Internal Server Error From Update Bookings.');
  }
})

//Deleting rooms by room Id
temp.delete('/delete/:id', async (req,res) => {
  try{
    const id = parseInt(req.params.id);
    const result = await db.query(`DELETE FROM rooms WHERE room_id = '${id}'`);
    if(result.rowCount > 0){
      res.status(202).send('Succesfully Deleted!');
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