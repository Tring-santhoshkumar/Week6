const express = require('express');
const temp = express();

let foods = [{
    "id": 1,
    "Name": "Santhosh",
    "Age" : '21',
    "College" : 'NEC'
  },
  {
    "id": 2,
    "Name": "Gokul",
    "Age" : '22',
    "College" : 'SJEC'
  },
  {
    "id": 3,
    "Name": "Dipshy",
    "Age" : '21',
    "College" : 'AVV'
  },{
   "id": 4,
    "Name": "Gowreesh",
    "Age" : '21',
    "College" : 'SCE'
  },{
    'id' : 5,
    'Name' : 'Sana',
    'Age' : 21,
    'College' :  'PSG'
  }
  ];
temp.get('/',(req,res) => {
    res.json(foods);
    res.end();
})

temp.get('/:id', (req,res) => {
    // res.write('Hello World From Express!');
    let foodId = parseInt(req.params.id);
    let food = foods.find(food => food.id === foodId);
    res.json(food);
    res.end();
})

temp.listen(3000, () => {
    console.log('Listening in port 3000');
})