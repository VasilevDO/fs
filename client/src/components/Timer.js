import { Component } from "react";
import "./Timer.css";
import PWNZSelect from "./PWNZSelect.js";

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHour: this.props.time.hour,
      selectedMinute: this.props.time.minute
    };
  }

  static defaultProps = {
    hours: [
      "00",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23"
    ],
    minutes: [
      "00",
      "05",
      "10",
      "15",
      "20",
      "25",
      "30",
      "35",
      "40",
      "45",
      "50",
      "55"
    ],
    selectedTime: null
  };

  handleSelectChange = () => {
    let hour = this.selectedHour.value;
    let minute = this.selectedMinute.value;
    let time = { hour: hour, minute: minute };
    this.props.selectedTime(time);
    this.setState({
      selectedTime: time
    });
  };

  handleSelectMinute = (newMinute) => {
    if (!newMinute) return;
    this.props.selectTime({
      hours: this.state.selectedHour,
      minutes: newMinute
    });
    this.setState({
      selectedMinute: newMinute
    });
  };

  handleSelectHour = (newHour) => {
    if (!newHour) return;
    this.props.selectTime({
      hours: newHour,
      minutes: this.state.selectedMinute
    });
    this.setState({
      selectedHour: newHour
    });
  };

  render() {
    const hours = this.props.hours;
    const minutes = this.props.minutes;
    const selectedHour = ('0'+this.state.selectedHour).slice(-2);
    const selectedMinute = ('0'+this.state.selectedMinute).slice(-2);

    return (
      <>
        <div className="timer">
          <div className="timer-hours">
            <PWNZSelect
              className="calendar-pwnz-selector"
              name={"hours"}
              size={1}
              options={hours}
              defaultValue={selectedHour}
              selectValue={this.handleSelectHour}
              key={selectedHour}
              fontSize={16}
              maxOptionsHeight={300}
            ></PWNZSelect>
          </div>
          <p style={{ "font-size": "16px" }}>:</p>
          <div className="timer-minutes">
            <PWNZSelect
              className="calendar-pwnz-selector"
              name={"minutes"}
              size={1}
              options={minutes}
              defaultValue={selectedMinute}
              selectValue={this.handleSelectMinute}
              key={selectedMinute}
              fontSize={16}
              maxOptionsHeight={300}
            ></PWNZSelect>
          </div>
        </div>
      </>
    );
  }
}

export default Timer;
