import React, { Component } from "react";
import { connect } from 'react-redux';
import $ from "jquery";

import "./WeatherTable.css";

import refreshPNG from '../assets/buttons/refresh.png';

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

function createHourlyTable(hourlyObj, day) {
  const tableArray = [];
  for (let i = 0; i < 24; i++) {
    tableArray.push({
      time: hourlyObj[day][i].date.split(" ")[0],
      todayWeather: hourlyObj[day][i].weather,
      todayIcon: hourlyObj[day][i].icon,
      todayTemp: hourlyObj[day][i].temp,
      todayWindSpeed: hourlyObj[day][i].windSpeed,
      todayHumidity: hourlyObj[day][i].humidity,
      todayPop: hourlyObj[day][i].pop
    });
  }
  return tableArray;
}

function getDateFromUTC(timeUTC) {
  //timeUTC in seconds
  let date = new Date(timeUTC * 1000); //convert secs into millisecs
  let dateStr = `${("0" + date.getHours()).slice(-2)}:${(
    "0" + date.getMinutes()
  ).slice(-2)} ${("0" + date.getDate()).slice(-2)}.${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}.${date.getFullYear()}`;
  return dateStr;
}

function getDateToString(date) {
  //date in ms
  let dateStr = `${("0" + date.getHours()).slice(-2)}:${(
    "0" + date.getMinutes()
  ).slice(-2)} ${("0" + date.getDate()).slice(-2)}.${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}.${date.getFullYear()}`;
  return dateStr;
}

function strDateToDate(strDate) {
  const time = strDate.split(" ")[0];
  const hour = time.split(":")[0];
  const minute = time.split(":")[1];
  const date = strDate.split(" ")[1];
  const day = date.split(".")[0];
  const month = date.split(".")[1] - 1;
  const year = date.split(".")[2];
  return new Date(year, month, day, hour, minute);
}

function getWeekdayName(weekdayNumber) {
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  return weekdayNames[weekdayNumber];
}

function getMonthName(monthNumber) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return monthNames[monthNumber];
}

function getBeautifulDate(dateStr) {
  let [day, month, year] = dateStr.split(" ")[1].split(".");
  month--;
  let date = new Date(year, month, day);
  return `${getWeekdayName(date.getDay())}, ${day} ${getMonthName(
    month
  )} ${year}`;
}

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

class WeatherTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: this.props.format || 'current', //avaible formats: micro, mini, hourly, daily, current
      currentTableData: null,
      hourlyTableData: null,
      hourlyTableDay: "today",
      dailyTableData: null,
      miniTableData: null,
      timeUpdated: null,
      todayWeather: null,
      tomorrowWeather: null
    };
  }

  updateTable = async () => {
    this.setState({
      processing: true
    });
    const weatherObj = await this.getWeatherData(this.state.city);
    if (!weatherObj || weatherObj.message) {
      this.setState({
        message: 'Failed to load weather data, try again later.',
        processing: false
      })
    } else {
      const { current, hourlyObj, daily, mini } = prepareWeatherData(weatherObj);
      this.setState({
        currentTableData: current,
        hourlyTableData: hourlyObj,
        dailyTableData: daily,
        miniTableData: mini,
        timeUpdated: getDateToString(new Date(Date.now())).split(" ")[0],
        message: null,
        processing: false
      });
    }
  };

  handleFormatChange = (e) => {
    this.setState({
      format: e.target.value
    });
  };

  handleCityChange = (e) => {
    const city = this.state.cities.find(city => city.name === e.target.value);
    this.setState({
      city: city
    });
  };

  sortDailyByDate = () => {
    let sorted = this.state.dailyTableData.concat().sort((day1, day2) => {
      return strDateToDate(day1.date) >= strDateToDate(day2.date) ? -1 : 1;
    });

    if (JSON.stringify(sorted) === JSON.stringify(this.state.dailyTableData))
      sorted = sorted.reverse();
    this.setState({
      dailyTableData: sorted
    });
  };

  sortHourlyByTime = (e) => {
    const hourlyTableData = this.state.hourlyTableData;
    const hourlyTableDay = this.state.hourlyTableDay;
    let sorted = hourlyTableData[hourlyTableDay].concat().sort((day1, day2) => {
      let d1Mins =
        day1.date.split(" ")[0].split(":")[0] * 60 +
        +day1.date.split(" ")[0].split(":")[1];
      let d2Mins =
        day2.date.split(" ")[0].split(":")[0] * 60 +
        +day2.date.split(" ")[0].split(":")[1];
      return d1Mins >= d2Mins ? 1 : -1;
    });
    if (
      JSON.stringify(sorted) === JSON.stringify(hourlyTableData[hourlyTableDay])
    )
      sorted = sorted.reverse();
    hourlyTableData[hourlyTableDay] = sorted;
    this.setState({
      hourlyTableData: hourlyTableData
    });
  };

  sortDailyByTime = (e) => {
    const target = $(e.target);
    const criteria = target.text().toLowerCase();
    let sorted = this.state.dailyTableData.concat().sort((day1, day2) => {
      let d1Mins =
        day1[criteria].split(":")[0] * 60 + day1[criteria].split(":")[1];
      let d2Mins =
        day2[criteria].split(":")[0] * 60 + day2[criteria].split(":")[1];
      return d1Mins >= d2Mins ? 1 : -1;
    });
    if (JSON.stringify(sorted) === JSON.stringify(this.state.dailyTableData))
      sorted = sorted.reverse();
    this.setState({
      dailyTableData: sorted
    });
  };

  sortDailyByValue = (e) => {
    const target = $(e.target);
    let criteria = target.text().split(",")[0];
    criteria = criteria[0].toLowerCase() + criteria.slice(1);
    if (criteria.split(" ").length > 1) {
      criteria = criteria
        .split(" ")
        .map((item, index) =>
          index === 0 ? item : item[0].toUpperCase() + item.slice(1)
        )
        .join("");
    }
    let sorted = this.state.dailyTableData.concat().sort((day1, day2) => {
      if (day1[criteria] === day2[criteria]) return 0;
      return day1[criteria] > day2[criteria] ? 1 : -1;
    });
    if (JSON.stringify(sorted) === JSON.stringify(this.state.dailyTableData))
      sorted = sorted.reverse();
    this.setState({
      dailyTableData: sorted
    });
  };

  sortHourlyByValue = (e) => {
    const target = $(e.target);
    const hourlyTableData = this.state.hourlyTableData;
    const hourlyTableDay = this.state.hourlyTableDay;
    let criteria = target.text().split(",")[0];
    criteria = criteria[0].toLowerCase() + criteria.slice(1);
    if (criteria.split(" ").length > 1) {
      criteria = criteria
        .split(" ")
        .map((item, index) =>
          index === 0 ? item : item[0].toUpperCase() + item.slice(1)
        )
        .join("");
    }
    let sorted = hourlyTableData[hourlyTableDay].concat().sort((day1, day2) => {
      let val1 = day1[criteria];
      let val2 = day2[criteria];
      if (val1 === "Expired") val1 = -1;
      if (val2 === "Expired") val2 = -1;
      if (val1 === val2) return 0;
      return val1 > val2 ? 1 : -1;
    });
    if (
      JSON.stringify(sorted) === JSON.stringify(hourlyTableData[hourlyTableDay])
    )
      sorted = sorted.reverse();
    hourlyTableData[hourlyTableDay] = sorted;
    this.setState({
      hourlyTableData: hourlyTableData
    });
  };

  sortDailyByTemperature = () => {
    let sorted = this.state.dailyTableData.concat().sort((day1, day2) => {
      let d1Temp = day1.temp.min + day1.temp.max;
      let d2Temp = day2.temp.min + day2.temp.max;
      return d1Temp > d2Temp ? 1 : -1;
    });
    if (JSON.stringify(sorted) === JSON.stringify(this.state.dailyTableData))
      sorted = sorted.reverse();
    this.setState({
      dailyTableData: sorted
    });
  };

  switchHourlyTableDay = () => {
    const newDay = this.state.hourlyTableDay === "today" ? "tomorrow" : "today";
    this.setState({
      hourlyTableDay: newDay
    });
  };

  getCities = async () => {
    try {
      const method = 'GET';
      const body = null;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.user.token}`
      };
      const { cities } = await fetch('/api/weather/cities', { method, body, headers })
        .then(data => data.json());
      return cities;
    } catch (e) {
    }
  }

  getWeatherData = async (city) => {
    try {
      const method = 'POST';
      const time = [
        (new Date().getTime() / 1000 - 10).toFixed(0), //today in seconds
        (new Date().getTime() / 1000 - 10).toFixed(0) - 86400 //yesterday in seconds
      ]; //-10 secs to fix 'time in future' error
      const body = JSON.stringify({
        city: this.state.city,
        time: time
      });
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.user.token}`
      };
      const weatherObj = await fetch('/api/weather', { method, body, headers })
        .then(data => data.json());
      return weatherObj;
    } catch (e) {
    }
  };

  componentDidMount = async () => {
    try {
      const cities = await this.getCities();
      this.setState({
        cities: cities,
        city: cities[0]
      });
    } catch (e) {
    }
  }

  render() {

    const format = this.state.format;
    const city = this.state.city;
    const currentTableData = this.state.currentTableData;
    const miniTableData = this.state.miniTableData;
    const hourlyTableData = this.state.hourlyTableData;

    console.log(this.state);

    if ((!currentTableData || !miniTableData || !hourlyTableData) && this.state.message) {
      return (
        <div className='pwnz-weatherTable-micro pwnz-f-c pwnz-p5'>
          <span>{this.state.message}</span>
          <div className='pwnz-imgButton pwnz-ml5' onClick={this.updateTable}>
            <img className={'pwnz-20x20' + (this.state.processing ? ' pwnz-infinitySpin360' : '')} src={refreshPNG} alt='' />
          </div>
        </div>
      )
    }

    if (!currentTableData || !miniTableData || !hourlyTableData) {
      return (
        <div className='pwnz-weatherTable-micro pwnz-f-cc pwnz-p5'>
          <span className='pwnz-bb-lightgray pwnz-mb5 pwnz-fwb'>Want to know weather?</span>
          <div className={'pwnz-button pwnz-f-c' + (this.state.processing ? ' pwnz-animatedLoading' : '')}>
            <div onClick={this.updateTable} className='pwnz-fwb'>Get weather data</div>
          </div>
        </div>
      )
    }

    const hourlyTableDay = this.state.hourlyTableDay;
    const hourlyTableTitle =
      hourlyTableDay[0].toUpperCase() +
      hourlyTableDay.slice(1) +
      ": " +
      (hourlyTableDay === "today"
        ? getBeautifulDate(getDateToString(new Date(Date.now())))
        : getBeautifulDate(
          getDateToString(new Date(Date.now() + 24 * 60 * 60 * 1000))
        ));

    const dailyTableData = this.state.dailyTableData;

    const timeUpdated = this.state.timeUpdated;

    if (miniTableData && format === 'micro') {
      return (
        <div className='pwnz-weatherTable-micro'>
          <div className='pwnz-p5'>
            <div className='pwnz-select pwnz-f-grow1'>
              <select className='pwnz-t-c pwnz-w100 pwnz-mr5' onChange={this.handleCityChange}>
                {this.state.cities.map(item => {
                  if (item.name === city.name) {
                    return <option value={item.name} hidden selected>{item.name}</option>
                  }
                  return (
                    <option value={item.name}>{item.name}</option>
                  )
                })}
              </select>
            </div>
            <div className='pwnz-imgButton pwnz-ml5' onClick={this.updateTable}>
              <img className={'pwnz-20x20' + (this.state.processing ? ' pwnz-infinitySpin360' : '')} src={refreshPNG} alt='' />
            </div>
          </div>
          <div className='pwnz-p5'>
            {miniTableData.date.split(" ")[0]}{" "}
            {getBeautifulDate(currentTableData.date)}
          </div>
          <div className='pwnz-f-c pwnz-p5'>
            <img
              alt="weather icon"
              src={`http://openweathermap.org/img/wn/${miniTableData.currentWeather.icon}.png`}
            />
            <span className='pwnz-ml5'>
              {miniTableData.currentWeather.main}
              <br />
              ({miniTableData.currentWeather.description})
            </span>
            <span className='pwnz-ml5'>
              {miniTableData.temp.current} °C
              <br />
              {miniTableData.windSpeed.current} km/h
            </span>
          </div>
        </div>
      )
    }

    return (
      <>
        <div className={"weather-table weather-table-" + format}>
          <div className="weather-table-controlsDiv">
            <div>
              <span className='pwnz-nowrap'>City:</span>
              <select className='pwnz-select' value={city.name} onChange={this.handleCityChange}>
                {this.state.cities.map(city => {
                  return (
                    <option value={city.name}>{city.name}</option>
                  )
                })}
              </select>
            </div>
            <div>
              <span className='pwnz-nowrap'>Table format:</span>
              <select className='pwnz-select' value={format} onChange={this.handleFormatChange}>
                <option value="current">Current</option>
                <option value="mini">Mini</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </select>
              <span className='pwnz-nowrap'>Last update: {timeUpdated || "none"}</span>
              <div className={'pwnz-button pwnz-f-c' + (this.state.processing ? ' pwnz-animatedLoading' : '')}>
                <div onClick={this.updateTable}>Update</div>
              </div>
            </div>
          </div>
          {miniTableData && format === "mini" ? (
            <table>
              <thead>
                <tr>
                  <th colSpan="6">
                    {miniTableData.date.split(" ")[0]}{" "}
                    {getBeautifulDate(currentTableData.date)}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan="2">
                    <img
                      alt="weather icon"
                      src={`http://openweathermap.org/img/wn/${miniTableData.currentWeather.icon}.png`}
                    />

                    <p>{miniTableData.currentWeather.main}</p>

                    <p>({miniTableData.currentWeather.description})</p>
                  </td>
                  <td>C</td>
                  <td>km/h</td>
                </tr>
                <tr>
                  <td>
                    Current: {miniTableData.temp.current}
                    <br />
                    Morning: {miniTableData.temp.morning}
                    <br />
                    Day: {miniTableData.temp.day}
                    <br />
                    Evening: {miniTableData.temp.evening}
                    <br />
                    Night: {miniTableData.temp.night}
                  </td>
                  <td>
                    Current: {miniTableData.windSpeed.current}
                    <br />
                    Average: {miniTableData.windSpeed.average}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : null}
          {currentTableData && format === "current" ? (
            <table>
              <thead>
                <tr>
                  <th colSpan="6">
                    {currentTableData.date.split(" ")[0]}{" "}
                    {getBeautifulDate(currentTableData.date)}
                  </th>
                </tr>

                <tr>
                  <td>Weather</td>
                  <td>Temperature, C</td>
                  <td>Wind speed, km/h</td>
                  <td>Humidity, %</td>
                  <td>Pressure, Pa</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img
                      alt="weather icon"
                      src={`http://openweathermap.org/img/wn/${currentTableData.icon}.png`}
                    />
                    <p>{currentTableData.weather}</p>
                  </td>
                  <td>{currentTableData.temp}</td>
                  <td>{currentTableData.windSpeed}</td>
                  <td>{currentTableData.humidity}</td>
                  <td>{currentTableData.pressure}</td>
                </tr>
                <tr>
                  <th colSpan="5">Overall daily weather</th>
                </tr>
                <tr>
                  <td>
                    <img
                      alt="weather icon"
                      src={`http://openweathermap.org/img/wn/${dailyTableData[0].icon}.png`}
                    />
                    <p>{dailyTableData[0].weather}</p>
                  </td>
                  <td>
                    Min: {dailyTableData[0].temp.min}
                    <br />
                    Max: {dailyTableData[0].temp.max}
                    <br />
                    Morning: {dailyTableData[0].temp.morn}
                    <br />
                    Day: {dailyTableData[0].temp.day}
                    <br />
                    Evening: {dailyTableData[0].temp.eve}
                    <br />
                    Night: {dailyTableData[0].temp.night}
                  </td>
                  <td>{dailyTableData[0].windSpeed}</td>
                  <td>{dailyTableData[0].humidity}</td>
                  <td>{dailyTableData[0].pressure}</td>
                </tr>
              </tbody>
            </table>
          ) : null}
          {hourlyTableData && format === "hourly" ? (
            <table className='pwnz-pos-rel'>
              <thead className='pwnz-sticky0'>
                <tr>
                  <th colSpan="6">
                    <div className='pwnz-f-c'>
                      <div className='pwnz-button pwnz-f-c' >
                        <div onClick={this.switchHourlyTableDay} >{"<"}</div>
                      </div>
                      <span className='pwnz-m010'>{hourlyTableTitle}</span>
                      <div className='pwnz-button pwnz-f-c' >
                        <div onClick={this.switchHourlyTableDay}>{">"}</div>
                      </div>
                    </div>
                  </th>
                </tr>
                <tr>
                  <td className='pwnz-clickable' onClick={this.sortHourlyByTime}>Time</td>
                  <td>Weather</td>
                  <td className='pwnz-clickable' onClick={this.sortHourlyByValue}>Temperature,C</td>
                  <td className='pwnz-clickable' onClick={this.sortHourlyByValue}>Wind speed, km/h</td>
                  <td className='pwnz-clickable' onClick={this.sortHourlyByValue}>Humidity, %</td>
                  <td className='pwnz-clickable' onClick={this.sortHourlyByValue}>Pop, %</td>
                </tr>
              </thead>
              <tbody>
                {createHourlyTable(hourlyTableData, hourlyTableDay).map(
                  (tr) => {
                    return (
                      <tr>
                        <td>{tr.time}</td>
                        <td>
                          <img
                            alt="weather icon"
                            src={`http://openweathermap.org/img/wn/${tr.todayIcon}.png`}
                          />
                          {tr.todayWeather}
                        </td>
                        <td>{tr.todayTemp}</td>
                        <td>{tr.todayWindSpeed}</td>
                        <td>{tr.todayHumidity}</td>
                        <td>{tr.todayPop}</td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          ) : null}
          {dailyTableData && format === "daily" ? (
            <table>
              <thead className='pwnz-sticky0'>
                <tr>
                  <th className='pwnz-clickable' onClick={this.sortDailyByDate}>Date</th>
                  <th className='pwnz-clickable' onClick={this.sortDailyByTime}>Sunrise</th>
                  <th className='pwnz-clickable' onClick={this.sortDailyByTime}>Sunset</th>
                  <th>Weather</th>
                  <th className='pwnz-clickable' onClick={this.sortDailyByTemperature}>Temperature,C</th>
                  <th className='pwnz-clickable' onClick={this.sortDailyByValue}>Wind speed, km/h</th>
                  <th className='pwnz-clickable' onClick={this.sortDailyByValue}>Humidity, %</th>
                  <th className='pwnz-clickable' onClick={this.sortDailyByValue}>Pressure, Pa</th>
                </tr>
              </thead>
              <tbody>
                {dailyTableData.map((day) => {
                  return (
                    <tr>
                      <td>{day.date.split(" ")[1]}</td>
                      <td>{day.sunrise.split(" ")[0]}</td>
                      <td>{day.sunset.split(" ")[0]}</td>
                      <td>
                        <img
                          alt="weather icon"
                          src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                        />
                        <p>{day.weather}</p>
                      </td>
                      <td>
                        Min: {day.temp.min}
                        <br />
                        Max: {day.temp.max}
                        <br />
                        Morning: {day.temp.morn}
                        <br />
                        Day: {day.temp.day}
                        <br />
                        Evening: {day.temp.eve}
                        <br />
                        Night: {day.temp.night}
                      </td>
                      <td>{day.windSpeed}</td>
                      <td>{day.humidity}</td>
                      <td>{day.pressure}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : null}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.weather,
    processing: state.app.processing
  }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(WeatherTable);