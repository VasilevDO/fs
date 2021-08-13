import { Component } from "react";
import "./PwnzHint.css";

export default class PwnzHint extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const text = this.props.hint.text;
    const style = this.props.hint.style;
    const className = "pwnzHint " + this.props.hint.class;

    return (
      <div className={className} style={style}>
        <span>{text}</span>
      </div>
    );
  }
}
