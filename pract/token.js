const jwt = require('jsonwebtoken');
const secretKey = 'santhosh22';
const token = jwt.sign({
    name : 'Santhosh',
    age : 21,
    college : 'National Engineering College',
    Place : 'Salem',
    names : 'kishore'
}, secretKey, {expiresIn : '1hr'});
console.log(token);


jwt.verify(token, 'santhosh21' , (err, decoded) => {
    if (err) {
      console.log('Token is invalid');
    } else {
      console.log('Decoded Token:', decoded);
    }
  });