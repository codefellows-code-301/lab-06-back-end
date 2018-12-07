'use strict'

//application dependencies
const express = require('express');
const cors = require('cors');

//load env vars
require('dotenv').config();
const PORT = process.env.PORT || 3000; //takes from a dotenv file and then the terminal env

//app
const app = express();
app.use(cors());

//get location data

//give error message if on wrong site
app.get('/*' , function(req , res){
  res.status(404).send('Gremlins ate this page... please try again later');
});

app.listen(PORT,()=>
console.log(`app is up on PORT ${3000}`));
