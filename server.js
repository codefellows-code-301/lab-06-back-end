'use strict'
let latLong = [];

//application dependencies
const express = require('express');
const cors = require('cors');

//load env vars
require('dotenv').config();
const PORT = process.env.PORT || 3000; //takes from a dotenv file and then the terminal env

//app
const app = express();
app.use(cors());

//Global Vars
let weeklyForecast = [];

//get location data
app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data || 'Lynnwood, WA'); // 'Lynnwood, WA'
  response.send(locationData);
})

function searchToLatLong(query){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  latLong.push(location);
  console.log(location, 'object');
  console.log(latLong, 'latLong');
  console.log(latLong[0].latitude, 'are you here');
  return location;
}

function Location(location){
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
  // latLong.push(this.latitude); //this is latLong at 0 = latitude
  // latLong.push(this.longitude); // this is latLong at 1 = longitude 
}

//Get Weather Data
app.get('/weather', (request, response) => {
  const weatherData = searchWeather(request.query.data || latLong[0].latitude, latLong[0].longitude); 
  response.send(weatherData);
})

function searchWeather(query){
  const darkSky = require('./data/darksky.json');
  let week = darkSky.daily.data;
  week.forEach(day => {
    new Forecast(day);
  })
  return weeklyForecast;
}

function Forecast(day){ //should return an array of objects
  let date = new Date(day.time * 1000);
  this.time = date.toDateString();
  this.summary = day.summary;
  weeklyForecast.push(this);
}

//give error message if on wrong site
app.get('/*' , function(req , res){
  res.status(404).send('Gremlins ate this page... please try again later');
});

app.listen(PORT,()=>
console.log(`app is up on PORT ${PORT}`));
