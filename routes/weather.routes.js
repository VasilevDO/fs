const { Router } = require('express');
const config = require('config');
const auth = require('../middleware/auth.middleware');
const router = Router();
const axios = require('axios');

require('../pwnz.js')();

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
  new City('Alupka', 44.41808, 34.04531)
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

router.post('/', auth, async (request, response) => {
  try {
    const { city, time } = request.body;
    const cityObj = getURL(city || cities[0], time);
    const futureWeather = await axios.get(cityObj.future).then(resp => resp.data);
    const pastTodayWeather = await axios.get(cityObj.pastToday).then(resp => resp.data);
    const pastYesterdayWeather = await axios.get(cityObj.pastYesterday).then(resp => resp.data);
    const weather = prepareWeatherData({
      futureWeather, pastTodayWeather, pastYesterdayWeather
    });
    response.status(200).json({ weather, cities });
  } catch (e) {
    response.status(500).json({ message: 'Service is currently unavailable' });
  }
})

router.get('/cities', auth, async (request, response) => {
  try {
    response.status(201).json({ cities });
  } catch (e) {
    response.status(500).json({ message: 'Service is currently unavailable' });
  }
})

module.exports = router;

const prepareWeatherData = (weatherObj) => {
  const daily = weatherObj.futureWeather.daily.map((day) => {
    return new DayWeather(day);
  });
  weatherObj.pastTodayWeather.hourly.pop(); //to cut current weather from pastTodayWeather
  const hourly = [
    ...weatherObj.pastYesterdayWeather.hourly,
    ...weatherObj.pastTodayWeather.hourly,
    ...weatherObj.futureWeather.hourly
  ]
    .map((hour) => {
      return new HourlyWeather(hour);
    })
    .filter((hour) => {
      return (
        hour.date.split(" ")[1] === getDateToString(new Date()).split(" ")[1] ||
        hour.date.split(" ")[1] ===
        getDateToString(new Date(Date.now() + 86400000)).split(" ")[1]
      );
    });

  const hourlyObj = {
    today: hourly.slice(0, 24),
    tomorrow: hourly.slice(24, 48)
  };

  const current = new CurrentWeather(weatherObj.futureWeather.current);
  const mini = {
    date: getDateFromUTC(weatherObj.futureWeather.current.dt),
    temp: {
      current: weatherObj.futureWeather.current.temp,
      morning: weatherObj.futureWeather.daily[0].temp.morn,
      day: weatherObj.futureWeather.daily[0].temp.day,
      evening: weatherObj.futureWeather.daily[0].temp.eve,
      night: weatherObj.futureWeather.daily[0].temp.night
    },
    windSpeed: {
      current: weatherObj.futureWeather.current.wind_speed,
      average: weatherObj.futureWeather.daily[0].wind_speed
    },
    currentWeather: {
      id: weatherObj.futureWeather.current.weather[0].id,
      main: weatherObj.futureWeather.current.weather[0].main,
      description: weatherObj.futureWeather.current.weather[0].description,
      icon: weatherObj.futureWeather.current.weather[0].icon
    }
  };
  return { current, hourlyObj, daily, mini };
};

class HourlyWeather {
  constructor(hourlyObj) {
    this.date = getDateFromUTC(hourlyObj.dt);
    this.temp = hourlyObj.temp;
    this.windSpeed = hourlyObj.wind_speed;
    this.humidity = hourlyObj.humidity;
    this.id = hourlyObj.weather[0].id;
    this.weather =
      hourlyObj.weather[0].main +
      " " +
      "(" +
      hourlyObj.weather[0].description +
      ")";
    this.pop = isNaN(hourlyObj.pop)
      ? "Expired"
      : Math.round(hourlyObj.pop * 100);
    this.icon = hourlyObj.weather[0].icon;
  }
}

class CurrentWeather {
  constructor(currentObj) {
    this.date = getDateFromUTC(currentObj.dt);
    this.temp = currentObj.temp;
    this.windSpeed = currentObj.wind_speed;
    this.humidity = currentObj.humidity;
    this.pressure = currentObj.pressure;
    this.id = currentObj.weather[0].id;
    this.weather =
      currentObj.weather[0].main +
      " " +
      "(" +
      currentObj.weather[0].description +
      ")";

    this.icon = currentObj.weather[0].icon;
    this.pop = currentObj.pop;
  }
}

class DayWeather {
  constructor(dayObj) {
    this.date = getDateFromUTC(dayObj.dt);
    this.temp = dayObj.temp;
    this.windSpeed = dayObj.wind_speed;
    this.humidity = dayObj.humidity;
    this.pressure = dayObj.pressure;
    this.id = dayObj.weather[0].id;
    this.weather =
      dayObj.weather[0].main + " (" + dayObj.weather[0].description + ")";
    this.icon = dayObj.weather[0].icon;
    this.pop = dayObj.pop;
    this.sunrise = getDateFromUTC(dayObj.sunrise).split(" ")[0];
    this.sunset = getDateFromUTC(dayObj.sunset).split(" ")[0];
  }
}
