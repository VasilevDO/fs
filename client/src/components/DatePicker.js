import { Component } from "react";
import { StrictMode } from "react";
import "./DatePicker.css";
import Calendar from "./Calendar.js";

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: this.props.format || "basic",
      buttonText: this.props.selectedDate
    };
  }

  buttonOuterText = {
    mini: "🕑",
    basic: "Set timer"
  };

  buttonInnerText = {
    mini: "✓",
    basic: "Confirm"
  };

  handleClick = () => {
    let newButtonText = !this.state.calendar //! coz handleClick works after click
      ? this.buttonInnerText[this.state.format]
      : this.props.selectedDate || this.buttonOuterText[this.state.format];
    if (!this.state.calendar) {
    }
    this.setState({
      calendar: !this.state.calendar,
      buttonText: newButtonText
    });
  };

  dateToStrFormat = (date) => {
    if (!date) return null;
    let day = date.getDate();
    let month = date.getMonth() + 1; //+1 coz months starting from 0
    let year = date.getFullYear();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    return day + "." + month + "." + year;
  };

  timeToStrFormat = (time) => {
    if (!time) return null;
    return time.hours + ":" + time.minutes;
  };

  datePick = (dateObj) => {
    let deadline;
    if (!dateObj) {
      deadline = null;
    } else if (dateObj) {
      let dateStr = this.dateToStrFormat(dateObj.selectedDate);
      let timeStr = this.timeToStrFormat(dateObj.selectedTime);
      deadline = timeStr ? [timeStr, dateStr].join(" ") : dateStr;
    }
    this.props.datePick(deadline);
    this.setState({
      buttonText:deadline
    })
  };

  deleteDeadline = () => {
    this.props.datePick(null);
    this.setState({
      buttonText:undefined
    })
  };

  render() {
    const format = this.state.format;
    const selectedDate = this.props.selectedDate;
    const buttonText = this.state.buttonText
      ? this.state.buttonText
      : selectedDate || this.buttonOuterText[format];
    const selectedText = selectedDate
      ? "Deadline: " + selectedDate
      : "No deadline selected";
      const isDisabled=this.props.disabled;
      console.log(this.state);
    return (
      <>
        <div className="date-picker">
          <div className='pwnz-buttonWdropmenu'>
            <button className='pwnz-dropmenu-button' disabled={isDisabled}>{buttonText}</button>
            <div className='pwnz-dropmenu pwnz-dropmenu-down-left' style={{display:'none'}}>
              <div className="date-picker-calendar-selected">
                <p>{selectedText}</p>
                <button onClick={this.deleteDeadline}>Clear</button>
              </div>
              <Calendar
                datePick={this.datePick}
                selectedDate={selectedDate}
              ></Calendar>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default DatePicker;