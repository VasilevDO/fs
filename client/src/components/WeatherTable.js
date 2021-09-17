import React, { Component } from "react";
import { connect } from 'react-redux';
import { getBeautifulDate, dateToString, firstLetterUp } from './pwnz';
import { getWeatherData } from "../redux/weatherActions";

import "./WeatherTable.css";

import refreshPNG from '../assets/buttons/refresh.png';
import { WEATHER_GET_WEATHER } from "../redux/types";

class WeatherTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: this.props.format || this.formats[0], //avaible formats: micro, mini, hourly, daily, current
      hourlyTableDay: "today",
      hourlySortedBy: {
        by: 'time',
        asc: true
      },
      dailySortedBy: {
        by: 'date',
        asc: true
      }
    };
  }

  formats = [
    'current', 'mini', 'hourly', 'daily', 'micro'
  ]

  handleFormatChange = (e) => {
    this.setState({
      format: e.target.value
    });
  };

  createHourlyTable = (hourlyObj, day) => {
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

  handleCityChange = (e) => {
    const city = this.props.state.cities.find(city => city.name === e.target.value);
    this.setState({
      city: city
    });
  };

  updateData = () => {
    this.props.getWeatherData(this.state.city)
  }

  handleHourlySortChange = (e) => {
    const current = this.state.hourlySortedBy;
    const next = {
      asc: true
    };
    next.by = (e.target.innerText.split(',')[0]).toLowerCase().replace(/[\s↑↓]/g, '');
    if (next.by === 'temperature') next.by = 'temp';
    if (next.by === 'windspeed') next.by = 'windSpeed';
    if (current.by === next.by) {
      next.asc = !current.asc;
    }
    this.setState({
      hourlySortedBy: next
    })
  }

  handleDailySortChange = (e) => {
    const current = this.state.dailySortedBy;
    const next = {
      asc: true
    };
    next.by = (e.target.innerText.split(',')[0]).toLowerCase().replace(/[\s↑↓]/g, '');
    if (next.by === 'temperature') next.by = 'temp';
    if (next.by === 'windspeed') next.by = 'windSpeed';
    if (current.by === next.by) {
      next.asc = !current.asc;
    }
    this.setState({
      dailySortedBy: next
    })
  }

  sortHourlyByDateStr = (a, b) => {
    const asc = this.state.hourlySortedBy.asc;
    if (a.date > b.date) return asc ? 1 : -1;
    if (a.date === b.date) return 0;
    if (a.date < b.date) return asc ? -1 : 1;
  }

  sortDailyByDateStr = (a, b) => {
    const asc = this.state.dailySortedBy.asc;
    if (a.date > b.date) return asc ? 1 : -1;
    if (a.date === b.date) return 0;
    if (a.date < b.date) return asc ? -1 : 1;
  }

  sortDailyByTemperature = (a, b) => {
    const asc = this.state.dailySortedBy.asc;
    const first = (+a.temp.max + a.temp.min) / 2;
    const second = (+b.temp.max + b.temp.min) / 2;
    if (first > second) return asc ? 1 : -1;
    if (first === second) return 0;
    if (first < second) return asc ? -1 : 1;
  }

  sortHourlyByValue = (a, b) => {
    const { by, asc } = this.state.hourlySortedBy;
    const first = +(typeof a[by] === 'string' ? -1 : a[by]);
    const second = +(typeof b[by] === 'string' ? -1 : b[by]);
    if (first > second) return asc ? 1 : -1;
    if (first === second) return 0;
    if (first < second) return asc ? -1 : 1;
  }

  sortDailyByValue = (a, b) => {
    const { by, asc } = this.state.dailySortedBy;
    const first = +(typeof a[by] === 'string' ? -1 : a[by]);
    const second = +(typeof b[by] === 'string' ? -1 : b[by]);
    if (first > second) return asc ? 1 : -1;
    if (first === second) return 0;
    if (first < second) return asc ? -1 : 1;
  }

  switchHourlyTableDay = () => {
    const newDay = this.state.hourlyTableDay === "today" ? "tomorrow" : "today";
    this.setState({
      hourlyTableDay: newDay
    });
  };

  render() {
    const reduxState = this.props.state;
    const processing = this.props.processing;
    const { current, mini, hourlyObj, daily } = reduxState.data;
    const format = this.state.format;
    const hourlySortedBy = this.state.hourlySortedBy;

    if (format === 'hourly') {
      for (let key in hourlyObj) {
        if (hourlySortedBy.by === 'time') {
          hourlyObj[key].sort(this.sortHourlyByDateStr);
        } else if (hourlySortedBy.by === 'temp' || hourlySortedBy.by === 'windSpeed' || hourlySortedBy.by === 'humidity' || hourlySortedBy.by === 'pop') {
          hourlyObj[key].sort(this.sortHourlyByValue);
        }
      }
    }

    const dailySortedBy = this.state.dailySortedBy;
    if (format === 'daily') {
      if (dailySortedBy.by === 'date' || dailySortedBy.by === 'sunset' || dailySortedBy.by === 'sunrise') {
        daily.sort(this.sortDailyByDateStr);
      } else if (dailySortedBy.by === 'temp') {
        daily.sort(this.sortDailyByTemperature);
      } else {
        daily.sort(this.sortDailyByValue);
      }
    }

    const { cities } = reduxState;

    const city = this.state.city || (cities ? cities[0] : null);
    const timeUpdated = reduxState.data.current?.date.split(' ')[0];
    const hourlyTableDay = this.state.hourlyTableDay;
    const hourlyTableTitle =
      hourlyTableDay[0].toUpperCase() +
      hourlyTableDay.slice(1) +
      ": " +
      (hourlyTableDay === "today"
        ? getBeautifulDate(dateToString(new Date(Date.now())))
        : getBeautifulDate(
          dateToString(new Date(Date.now() + 24 * 60 * 60 * 1000))
        ));

    if (!current || !mini || !hourlyObj || !daily) {
      return (
        <div className='pwnz-weatherTable-micro pwnz-f-cc pwnz-p5'>
          <span className='pwnz-bb-lightgray pwnz-mb5 pwnz-fwb'>{this.reduxState?.message || 'Want to know weather?'}</span>
          <div className={'pwnz-button pwnz-f-c' + (processing.includes(WEATHER_GET_WEATHER) ? ' pwnz-animatedLoading' : '')}>
            <div onClick={this.updateData} className='pwnz-fwb'>Get weather data</div>
          </div>
        </div>
      )
    }

    if (mini && format === 'micro') {
      return (
        <div className='pwnz-weatherTable-micro'>
          <div className='pwnz-p5'>
            <div className='pwnz-select pwnz-f-grow1'>
              <select className='pwnz-t-c pwnz-w100 pwnz-mr5' value={city.name} onChange={this.handleCityChange}>
                {cities.map(item => <option value={item.name} hidden={item.name === city.name}>{item.name}</option>)}
              </select>
            </div>
            <div className='pwnz-imgButton pwnz-ml5' onClick={this.updateData}>
              <img className={'pwnz-20x20' + (processing.includes(WEATHER_GET_WEATHER) ? ' pwnz-infinitySpin360' : '')} src={refreshPNG} alt='' />
            </div>
          </div>
          <div className='pwnz-p5'>
            {mini.date.split(" ")[0]}{" "}
            {getBeautifulDate(current.date)}
          </div>
          <div className='pwnz-f-c pwnz-p5'>
            <img
              alt="weather icon"
              src={`http://openweathermap.org/img/wn/${mini.currentWeather.icon}.png`}
            />
            <span className='pwnz-ml5'>
              {mini.currentWeather.main}
              <br />
              ({mini.currentWeather.description})
            </span>
            <span className='pwnz-ml5'>
              {mini.temp.current} °C
              <br />
              {mini.windSpeed.current} km/h
            </span>
          </div>
        </div>
      )
    }

    return (
      <div className={"weather-table weather-table-" + format}>
        <div className="weather-table-controlsDiv">
          <div>
            <span className='pwnz-nowrap'>City:</span>
            <select className='pwnz-select' value={city.name} onChange={this.handleCityChange}>
              {cities.map(item => <option value={item.name} hidden={item.name === city.name}>{item.name}</option>)}
            </select>
          </div>
          <div>
            <span className='pwnz-nowrap'>Table format:</span>
            <select className='pwnz-select' value={format} onChange={this.handleFormatChange}>
              {this.formats.map(item => <option value={item} hidden={(item === format) || (item === 'micro')}>{firstLetterUp(item)}</option>)}
            </select>
            <span className='pwnz-nowrap'>Last update: {timeUpdated || "none"}</span>
            <div className={'pwnz-button pwnz-f-c' + (processing.includes(WEATHER_GET_WEATHER) ? ' pwnz-animatedLoading' : '')}>
              <div onClick={this.updateData}>Update</div>
            </div>
          </div>
        </div>
        {mini && format === "mini" ? (
          <table>
            <thead>
              <tr>
                <th colSpan="6">
                  {mini.date.split(" ")[0]}{" "}
                  {getBeautifulDate(current.date)}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan="2">
                  <img
                    alt="weather icon"
                    src={`http://openweathermap.org/img/wn/${mini.currentWeather.icon}.png`}
                  />

                  <p>{mini.currentWeather.main}</p>

                  <p>({mini.currentWeather.description})</p>
                </td>
                <td>C</td>
                <td>km/h</td>
              </tr>
              <tr>
                <td>
                  Current: {mini.temp.current}
                  <br />
                  Morning: {mini.temp.morning}
                  <br />
                  Day: {mini.temp.day}
                  <br />
                  Evening: {mini.temp.evening}
                  <br />
                  Night: {mini.temp.night}
                </td>
                <td>
                  Current: {mini.windSpeed.current}
                  <br />
                  Average: {mini.windSpeed.average}
                </td>
              </tr>
            </tbody>
          </table>
        ) : null}
        {current && format === "current" ? (
          <table>
            <thead>
              <tr>
                <th colSpan="6">
                  {current.date.split(" ")[0]}{" "}
                  {getBeautifulDate(current.date)}
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
                    src={`http://openweathermap.org/img/wn/${current.icon}.png`}
                  />
                  <p>{current.weather}</p>
                </td>
                <td>{current.temp}</td>
                <td>{current.windSpeed}</td>
                <td>{current.humidity}</td>
                <td>{current.pressure}</td>
              </tr>
              <tr>
                <th colSpan="5">Overall daily weather</th>
              </tr>
              <tr>
                <td>
                  <img
                    alt="weather icon"
                    src={`http://openweathermap.org/img/wn/${daily[0].icon}.png`}
                  />
                  <p>{daily[0].weather}</p>
                </td>
                <td>
                  Min: {daily[0].temp.min}
                  <br />
                  Max: {daily[0].temp.max}
                  <br />
                  Morning: {daily[0].temp.morn}
                  <br />
                  Day: {daily[0].temp.day}
                  <br />
                  Evening: {daily[0].temp.eve}
                  <br />
                  Night: {daily[0].temp.night}
                </td>
                <td>{daily[0].windSpeed}</td>
                <td>{daily[0].humidity}</td>
                <td>{daily[0].pressure}</td>
              </tr>
            </tbody>
          </table>
        ) : null}
        {hourlyObj && format === "hourly" ? (
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
                <td className='pwnz-clickable' onClick={this.handleHourlySortChange}>
                  {'Time' + (hourlySortedBy?.by === 'time' ?
                    hourlySortedBy.asc ?
                      ' ↑'
                      : ' ↓'
                    : '')}
                </td>
                <td>Weather</td>
                <td className='pwnz-clickable' onClick={this.handleHourlySortChange}>
                  {'Temperature, C' + (hourlySortedBy?.by === 'temp' ?
                    hourlySortedBy.asc ?
                      ' ↑'
                      : ' ↓'
                    : '')}
                </td>
                <td className='pwnz-clickable' onClick={this.handleHourlySortChange}>
                  {'Wind speed, km/h' + (hourlySortedBy?.by === 'windSpeed' ?
                    hourlySortedBy.asc ?
                      ' ↑'
                      : ' ↓'
                    : '')}
                </td>
                <td className='pwnz-clickable' onClick={this.handleHourlySortChange}>
                  {'Humidity, %' + (hourlySortedBy?.by === 'humidity' ?
                    hourlySortedBy.asc ?
                      ' ↑'
                      : ' ↓'
                    : '')}
                </td>
                <td className='pwnz-clickable' onClick={this.handleHourlySortChange}>
                  {'Pop, %' + (hourlySortedBy?.by === 'pop' ?
                    hourlySortedBy.asc ?
                      ' ↑'
                      : ' ↓'
                    : '')}
                </td>
              </tr>
            </thead>
            <tbody>
              {this.createHourlyTable(hourlyObj, hourlyTableDay).map(
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
        {daily && format === "daily" ? (
          <table>
            <thead className='pwnz-sticky0'>
              <tr>
                <td className='pwnz-clickable' onClick={this.handleDailySortChange}>
                  {'Date' + (dailySortedBy?.by === 'date' ?
                    dailySortedBy.asc ?
                      ' ↑'
                      : ' ↓'
                    : '  ')}
                </td>
                <td className='pwnz-clickable' onClick={this.handleDailySortChange}>
                  {'Sunrise' + (dailySortedBy?.by === 'sunrise' ?
                    dailySortedBy.asc ?
                      ' ↑'
                      : ' ↓'
                    : '  ')}
                </td>
                <td className='pwnz-clickable' onClick={this.handleDailySortChange}>
                  {'Sunset' + (dailySortedBy?.by === 'sunset' ?
                    dailySortedBy.asc ?
                      ' ↑'
                      : ' ↓'
                    : '  ')}
                </td>
                <td>Weather</td>
                <td className='pwnz-clickable' onClick={this.handleDailySortChange}>
                  {'Temperature, C' + (dailySortedBy?.by === 'temp' ?
                    dailySortedBy.asc ?
                      ' ↑'
                      : ' ↓'
                    : '  ')}
                </td>
                <td className='pwnz-clickable' onClick={this.handleDailySortChange}>
                  {'Wind speed, km/h' + (dailySortedBy?.by === 'windSpeed' ?
                    dailySortedBy.asc ?
                      ' ↑'
                      : ' ↓'
                    : '  ')}
                </td>
                <td className='pwnz-clickable' onClick={this.handleDailySortChange}>
                  {'Humidity, %' + (dailySortedBy?.by === 'humidity' ?
                    dailySortedBy.asc ?
                      ' ↑'
                      : ' ↓'
                    : '  ')}
                </td>
                <td className='pwnz-clickable' onClick={this.handleDailySortChange}>
                  <span>
                  {'Pressure, Pa' + (dailySortedBy?.by === 'pressure' ?
                    dailySortedBy.asc ?
                      ' ↑'
                      : ' ↓'
                    : '  ')}
                    </span>
                </td>
              </tr>
            </thead>
            <tbody>
              {daily.map((day) => {
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
  getWeatherData
}

export default connect(mapStateToProps, mapDispatchToProps)(WeatherTable);