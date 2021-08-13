import { Component } from "react";
import "./Calendar.css";
import $ from "jquery";
import Timer from "./Timer.js";
import PWNZSelect from "./PWNZSelect.js";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTime: this.timeStrToObj(
        this.splitDateStr(this.props.selectedDate)[0]
      ),
      selectedDate: this.dateStrToDate(
        this.splitDateStr(this.props.selectedDate)[1]
      ),
      date: this.dateStrToDate(this.splitDateStr(this.props.selectedDate)[1])
    };
  }

  static defaultProps = {
    fMonths: [
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
    ],
    sMonths: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ],
    fWeekdays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    sWeekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    onChange: Function.prototype
  };

  getWeekday = (date) => {
    let weekday = date.getDay();
    return weekday === 0 ? 6 : weekday - 1;
  };

  getFirstWeekdayOfMonth = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth();
    let firstDayOfMonth = new Date(year, month);
    return firstDayOfMonth;
  };

  getDaysInMonth = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth();
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    return daysInMonth.toString();
  };

  handlePrevMonthClick = (date) => {
    let newDate = new Date(date.getFullYear(), date.getMonth() - 1);
    this.setState({ date: newDate });
  };
  handleNextMonthClick = (date) => {
    let newDate = new Date(date.getFullYear(), date.getMonth() + 1);
    this.setState({ date: newDate });
  };

  handlePrevYearClick = (date) => {
    let newDate = new Date(date.getFullYear() - 1, date.getMonth());
    this.setState({ date: newDate });
  };
  handleNextYearClick = (date) => {
    let newDate = new Date(date.getFullYear() + 1, date.getMonth());
    this.setState({ date: newDate });
  };

  handleDayClick = (day, e) => {
    //day is an array contains [date,day number] e to change target background
    if (day === undefined) return;

    if ($(e.target).hasClass("calendar-week-day-selected")) {
      $(e.target).toggleClass("calendar-week-day-selected");
      this.props.datePick(null);
      this.setState({ selectedDate: null });
      return;
    }

    $(".calendar-week-day").removeClass("calendar-week-day-selected");
    $(e.target).toggleClass("calendar-week-day-selected");
    let dateObj = {
      selectedTime: this.state.time,
      selectedDate: day[0]
    };
    this.props.datePick(dateObj);
    this.setState({ selectedDate: day[0] });
  };

  handleSelectTime = (time) => {
    let dateObj = {
      selectedTime: time,
      selectedDate: this.state.selectedDate || this.currentDate()
    };
    this.props.datePick(dateObj);
  };

  handleSelectMonth = (newMonth) => {
    if (!newMonth) return;
    this.setState({
      date: new Date(
        this.state.date.getFullYear(),
        this.props.sMonths.indexOf(newMonth)
      )
    });
  };

  handleSelectYear = (newYear) => {
    if (!newYear) return;
    this.setState({
      date: new Date(newYear, this.state.date.getMonth())
    });
  };

  splitDateStr = (dateStr) => {
    if (!dateStr) return [null, null];
    let dateArr = dateStr.split(" ");
    return dateArr.length - 1 ? dateArr : [null, dateArr[0]];
  };

  dateStrToDate = (dateStr) => {
    if (!dateStr) return null;
    let [day, month, year] = dateStr.split(".");
    return new Date(year, month - 1, day);
  };

  currentDate = () => {
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  currentTime = () => {
    let now = new Date();
    return {
      hour: now.getHours(),
      minute: now.getMinutes()
    };
  };

  timeStrToObj = (time) => {
    if (!time) return null;
    return {
      hour: time.split(":")[0],
      minute: time.split(":")[1]
    };
  };

  render() {
    const { sMonths, sWeekdays } = this.props;
    const currentDate = this.currentDate();
    const currentTime = this.currentTime();
    const selectedTime = this.state.selectedTime;
    const selectedDate = this.state.selectedDate;
    const date = this.state.date || currentDate;
    let years = [];
    for (let i = date.getFullYear() - 25; i < date.getFullYear() + 25; i++) {
      years.push(i);
    }
    const datesArr = [];
    const firstWeekdayOfMonth = this.getWeekday(
      this.getFirstWeekdayOfMonth(date)
    );
    const daysInMonth = this.getDaysInMonth(date);

    for (let i = 1; i <= daysInMonth; i++) {
      datesArr[i - 1 + firstWeekdayOfMonth] = [
        new Date(date.getFullYear(), date.getMonth(), i),
        i
      ];
    }
    let monthArr = [];
    for (let i = 0; i < 6; i++) {
      let weekArr = [];
      for (let j = 0; j < 7; j++) {
        weekArr.push(datesArr[7 * i + j]);
        if (weekArr.length > 6) monthArr.push(weekArr);
      }
    }

    return (
      <>
        <div className="calendar">
          <header className="calendar-header">
            <div className="calendar-header-selector">
              <Timer
                selectTime={this.handleSelectTime}
                time={selectedTime || currentTime}
              ></Timer>
              <div>
                <button
                  className="calendar-date-change-button"
                  onClick={() => this.handlePrevMonthClick(date)}
                >
                  {"<"}
                </button>
                <PWNZSelect
                  className="calendar-pwnz-selector"
                  name={"months"}
                  size={4}
                  options={sMonths}
                  defaultValue={sMonths[date.getMonth()]}
                  selectValue={this.handleSelectMonth}
                  key={sMonths[date.getMonth()]}
                  fontSize={16}
                  maxOptionsHeight={300}
                ></PWNZSelect>
                <button
                  className="calendar-date-change-button"
                  onClick={() => this.handleNextMonthClick(date)}
                >
                  {">"}
                </button>
              </div>
              <div>
                <button
                  className="calendar-date-change-button"
                  onClick={() => this.handlePrevYearClick(date)}
                >
                  {"<"}
                </button>
                <PWNZSelect
                  className="calendar-pwnz-selector"
                  name={"years"}
                  size={4}
                  options={years}
                  defaultValue={date.getFullYear()}
                  selectValue={this.handleSelectYear}
                  key={date.getFullYear()}
                  fontSize={16}
                  maxOptionsHeight={300}
                ></PWNZSelect>
                <button
                  className="calendar-date-change-button"
                  onClick={() => this.handleNextYearClick(date)}
                >
                  {">"}
                </button>
              </div>
            </div>
          </header>

          <table>
            <thead className="calendar-weekdays-header">
              <tr>
                {sWeekdays.map((item, index) => (
                  <th key={item} value={item}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthArr.map((week, weekIndex) => {
                if (week.filter((day) => day !== undefined).length === 0)
                  return null;
                return (
                  <tr className="calendar-week" key={weekIndex}>
                    {monthArr[weekIndex].map((day, dayIndex) => {
                      let className = "calendar-week-day";
                      if (day !== undefined && +day[0] === +currentDate) {
                        className += " calendar-week-day-current";
                      }
                      if (day !== undefined && +day[0] === +selectedDate) {
                        className += " calendar-week-day-selected";
                      }
                      return (
                        <td
                          className={className}
                          key={weekIndex * 7 + dayIndex}
                          onClick={(e) => this.handleDayClick(day, e)}
                        >
                          {day === undefined ? null : day[1]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default Calendar;

/** BACKUP 13/05
 *   <>
        <div className="calendar">
          <header className="calendar-header">
            <div className="calendar-header-selector">
              <Timer selectedTime={this.handleSelectTime}></Timer>
              <div>
                <button onClick={() => this.handlePrevMonthClick(date)}>
                  {"<"}
                </button>
                <select
                  ref={(element) => (this.monthSelect = element)}
                  onChange={this.handleSelectChange}
                  value={date.getMonth()}
                >
                  {sMonths.map((item, index) => (
                    <option key={index} value={index}>
                      {item}
                    </option>
                  ))}
                </select>

                <button onClick={() => this.handleNextMonthClick(date)}>
                  {">"}
                </button>
              </div>
              <div>
                <button onClick={() => this.handlePrevYearClick(date)}>
                  {"<"}
                </button>
                <select
                  ref={(element) => (this.yearSelect = element)}
                  onChange={this.handleSelectChange}
                  value={date.getFullYear()}
                >
                  {years.map((item, index) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <button onClick={() => this.handleNextYearClick(date)}>
                  {">"}
                </button>
              </div>
            </div>
          </header>

          <table>
            <thead className="calendar-weekdays-header">
              <tr>
                {sWeekdays.map((item, index) => (
                  <th key={item} value={item}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthArr.map((week, weekIndex) => {
                if (week.filter((day) => day !== undefined).length === 0)
                  return null;
                return (
                  <tr className="calendar-week" key={weekIndex}>
                    {monthArr[weekIndex].map((day, dayIndex) => {
                      let className = "calendar-week-day";
                      if (
                        day !== undefined &&
                        this.dateToStrFormat(day[0]) === currentDate
                      ) {
                        className += " calendar-week-day-current";
                      }
                      return (
                        <td
                          className={className}
                          key={weekIndex * 7 + dayIndex}
                          onClick={(e) => this.handleDayClick(day, e)}
                        >
                          {day === undefined ? null : day[1]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
*/
