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
  //data the front end needs:
  /*
  formatted_query
  latitude
  longitude
  */
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
  // latLong.push(this.latitude); //this is latLong at 0 = latitude
  // latLong.push(this.longitude); // this is latLong at 1 = longitude 
}

//Get Weather Data
app.get('/weather', (request, response) => {
  const weatherData = searchWeather(request.query.data || latLong[0].latitude, latLong[0].longitude); // 47.8209301, -122.3151314
  console.log(weatherData, 'Im here');
  response.send(weatherData);
})

function searchWeather(query){
  const darkSky = require('./data/darksky.json');
  const weather = new Forecast(darkSky); // might need for loop at daily[i]
  console.log(weather,'weather');
  return weather;
}

function Forecast(searchWeather){ //should return an array of objects
  //data the front end needs:
  /*
  forecast
  time
  8 days
  */
  // latLong = [];
  this.latitude = latLong[0].latitude;
  this.longitude = latLong[0].longitude;
  this.time = daily.data.time; //daily data starts on line 1295
  // this.summary = daily.summary; 
}

//give error message if on wrong site
app.get('/location' , function(req , res){
  res.status(404).send('Are we There Yet?');
});

app.get('/weather' , function(req , res){
  res.status(404).send('Cloudy with a Chance of Meatballs!');
});

app.get('/*' , function(req , res){
  res.status(404).send('Gremlins ate this page... please try again later');
});

app.listen(PORT,()=>
console.log(`app is up on PORT ${PORT}`));
