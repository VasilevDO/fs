const {Router} = require('express');
const config=require('config');
const auth=require('../middleware/auth.middleware');
const router=Router();
const axios = require('axios');


class City {
    constructor(name, lat, lon) {
      this.name = name;
      this.coords = [lat, lon];
    }
  }

const apiKey = "fed13e8b86dce82e596a41fd5b5720ae";

const cities = [
    new City("Saint-Petersburg", 59.9375, 30.308611),
    new City('Pskov', 57.8136, 28.3496),
    new City('Moscow', 55.751244, 37.618423),
    new City("Wellingtion", -41.28666552, 174.772996908),
    new City ('Alupka',44.41808, 34.04531)
  ];

  const time = [
    (new Date().getTime() / 1000 - 10).toFixed(0), //today in seconds
    (new Date().getTime() / 1000 - 10).toFixed(0) - 86400 //yesterday in seconds
  ];

function getURL(city, time) {
    return {
      name: city.name,
      future: `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coords[0]}&lon=${city.coords[1]}&exclude=minutely&units=metric&appid=${apiKey}`,
      pastToday: `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${city.coords[0]}&lon=${city.coords[1]}&dt=${time[0]}&units=metric&appid=${apiKey}`,
      pastYesterday: `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${city.coords[0]}&lon=${city.coords[1]}&dt=${time[1]}&units=metric&appid=${apiKey}`
    };
  }

router.post('/', auth,async (request, response)=> {
    try {
        console.log(request.body);
        const {city,time} = request.body;
        const cityObj=getURL(city||cities[0],time);

        const futureWeather = await axios.get(cityObj.future)
        const pastTodayWeather = await axios.get(cityObj.pastToday)
        const pastYesterdayWeather = await axios.get(cityObj.pastYesterday)

        response.status(201).json({
            futureWeather:futureWeather.data,
            pastTodayWeather:pastTodayWeather.data,
            pastYesterdayWeather:pastYesterdayWeather.data
        })

    } catch (e) {
        response.status(500).json({message:'Service is currently unavailable'});
    }
})

router.get('/cities', auth,async (request, response)=> {
    try {
        response.status(201).json({cities});

    } catch (e) {
        response.status(500).json({message:'Service is currently unavailable'});
    }
})


module.exports=router;



