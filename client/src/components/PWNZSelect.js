import { Component } from "react";
import "./PWNZSelect.css";
import $ from "jquery";

class PWNZSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      size: this.props.size,
      defaultOptions: this.props.options,
      defaultValue: this.props.defaultValue,
      optionsVisibility: 0,
      selectedValue: this.props.defaultValue,
      currentValue: this.props.currentValue || this.props.defaultValue,
      currentOptions: this.props.options,
      fontSize: this.props.fontSize,
      maxOptionsHeight: this.props.maxOptionsHeight
    };
  }

  handleSelectorFocus = () => {
    this.setState({
      optionsVisibility: 1,
      currentValue: "",
      currentOptions: this.state.defaultOptions
    });
  };

  handleSelectorBlur = (e) => {
    this.setState({
      optionsVisibility: 0,
      currentValue: this.state.selectedValue || ""
    });
  };

  handleOptionClick = (target) => {
    let selectedVal = $(target).text();
    this.props.selectValue(selectedVal, this.state.name);
    this.setState({
      selectedValue: selectedVal,
      currentValue: selectedVal
    });
  };

  handleOptionMouseDown = (target) => {
    let selectedVal = $(target).text();
    this.props.selectValue(selectedVal);
    this.setState({
      selectedValue: selectedVal,
      currentValue: selectedVal
    });
  };

  handleChange = (target) => {
    let options = this.state.defaultOptions;
    let value = $(target).val();
    let checkedVals = this.checkValue(value, options, 1, 1);
    let fullCheckedVals = this.checkValue(value, options, 1, 0);
    let selectedVal = fullCheckedVals ? fullCheckedVals[0] : undefined;
    this.props.selectValue(selectedVal, this.state.name);
    this.setState({
      selectedValue: selectedVal,
      currentValue: $(target).val(),
      currentOptions: checkedVals
    });
  };

  checkValue = (value, options, c, m) => {
    //all values converted to string
    //c=0 for case sensetive check and c=1 for non sensetive check
    //m=0 for match sensetive check (full match) and m=1 for part matching
    value = c ? value.toString().toLowerCase() : value.toString;
    //no toString mapping to avoid changes in options array
    return m
      ? options.filter((option) =>
          (c ? option.toString().toLowerCase() : option.toString()).includes(
            value
          )
        )
      : options.filter(
          (option) =>
            (c ? option.toString().toLowerCase() : option.toString()) === value
        );
  };

  render() {
    const options = this.state.currentOptions;
    const optionsVisibility = this.state.optionsVisibility;
    const defaultValue = this.state.defaultValue;
    const currentValue = this.state.currentValue;
    const size = this.props.size;
    const fontSize = this.state.fontSize || 16;
    const maxOptionsHeight = this.state.maxOptionsHeight;
    return (
      <div
        onFocus={this.handleSelectorFocus}
        onBlur={this.handleSelectorBlur}
        className="pwnz-selector"
      >
        <input
          size={size}
          onChange={(e) => this.handleChange(e.target)}
          value={currentValue === undefined ? defaultValue : currentValue}
          style={{
            fontSize: fontSize + "px"
          }}
        ></input>
        <div className="pwnz-selector-div-for-scrollbar">
          <div
            className="pwnz-selector-options"
            style={{
              maxHeight: maxOptionsHeight + "px"
            }}
          >
            {optionsVisibility
              ? options.map((option, index) => (
                  <option
                    key={index}
                    onClick={(e) => this.handleOptionClick(e.target)}
                    onMouseDown={(e) => this.handleOptionMouseDown(e.target)}
                    className="pwnz-selector-option"
                    style={{
                      "font-size": fontSize + "px"
                    }}
                  >
                    {option}
                  </option>
                ))
              : null}
          </div>
        </div>
      </div>
    );
  }
}
export default PWNZSelect;
